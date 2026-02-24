/**
 * Admin Categories API - CRUD (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Category from "@/lib/models/Category";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) return NextResponse.json([]);

  try {
    await connectDB();
    const list = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json(
      list.map((c) => ({
        id: c._id?.toString(),
        ...c,
        _id: undefined,
        __v: undefined,
      }))
    );
  } catch (err) {
    console.error("Admin categories GET:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, image, status } = body;
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (!USE_MONGODB) {
      return NextResponse.json(
        { error: "Database required to manage categories." },
        { status: 503 }
      );
    }
    await connectDB();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const category = await Category.create({
      name: name.trim(),
      slug,
      image: image || "",
      status: status || "active",
    });
    const c = category.toObject();
    return NextResponse.json({
      id: c._id?.toString(),
      ...c,
      _id: undefined,
      __v: undefined,
    });
  } catch (err) {
    console.error("Admin categories POST:", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
