/**
 * Admin Category by ID - GET, PUT, DELETE
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Category from "@/lib/models/Category";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  if (!USE_MONGODB) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const category = await Category.findById(id).lean();
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({
      id: category._id?.toString(),
      ...category,
      _id: undefined,
      __v: undefined,
    });
  } catch (err) {
    console.error("Admin category GET:", err);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    const body = await request.json();

    if (!USE_MONGODB) return NextResponse.json({ error: "Database required." }, { status: 503 });
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const update = {};
    if (body.name != null) update.name = body.name;
    if (body.image != null) update.image = body.image;
    if (body.status != null) update.status = body.status;
    if (body.slug != null) update.slug = body.slug;
    if (body.parentId !== undefined) update.parentId = body.parentId || null;
    const category = await Category.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({
      id: category._id?.toString(),
      ...category,
      _id: undefined,
      __v: undefined,
    });
  } catch (err) {
    console.error("Admin category PUT:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    if (!USE_MONGODB) return NextResponse.json({ error: "Database required." }, { status: 503 });
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin category DELETE:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
