/**
 * Admin Testimonials API - CRUD (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) return NextResponse.json([]);

  try {
    await connectDB();
    const list = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(
      list.map((t) => ({
        id: t._id?.toString(),
        name: t.name,
        role: t.role || "Customer",
        avatar: t.avatar || "",
        text: t.text,
        rating: t.rating ?? 5,
        order: t.order ?? 0,
        status: t.status || "active",
        createdAt: t.createdAt,
      }))
    );
  } catch (err) {
    console.error("Admin testimonials GET:", err);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) {
    return NextResponse.json({ error: "Database required" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { name, role, avatar, text, rating, order, status } = body;
    if (!name?.trim() || !text?.trim()) {
      return NextResponse.json({ error: "Name and text are required" }, { status: 400 });
    }
    await connectDB();
    const doc = await Testimonial.create({
      name: name.trim(),
      role: role?.trim() || "Customer",
      avatar: avatar?.trim() || "",
      text: text.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      order: Number(order) || 0,
      status: status || "active",
    });
    return NextResponse.json({
      id: doc._id?.toString(),
      name: doc.name,
      role: doc.role,
      avatar: doc.avatar,
      text: doc.text,
      rating: doc.rating,
      order: doc.order,
      status: doc.status,
    });
  } catch (err) {
    console.error("Admin testimonials POST:", err);
    return NextResponse.json({ error: err?.message || "Failed to create testimonial" }, { status: 500 });
  }
}
