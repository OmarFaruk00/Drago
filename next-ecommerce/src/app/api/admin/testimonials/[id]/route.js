/**
 * Admin Testimonials [id] - PUT, DELETE
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (!USE_MONGODB) return NextResponse.json({ error: "Database required" }, { status: 503 });

  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const body = await request.json();
    const { name, role, avatar, text, rating, order, status } = body;

    await connectDB();
    const updateFields = {};
    if (name != null) updateFields.name = String(name).trim();
    if (role != null) updateFields.role = String(role).trim() || "Customer";
    if (avatar != null) updateFields.avatar = String(avatar).trim();
    if (text != null) updateFields.text = String(text).trim();
    if (rating != null) updateFields.rating = Math.min(5, Math.max(1, Number(rating) || 5));
    if (order != null) updateFields.order = Number(order) || 0;
    if (status != null) updateFields.status = status === "hidden" ? "hidden" : "active";

    const doc = await Testimonial.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    if (!doc) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
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
    console.error("Admin testimonials PUT:", err);
    return NextResponse.json({ error: err?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (!USE_MONGODB) return NextResponse.json({ error: "Database required" }, { status: 503 });

  try {
    const id = params?.id;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await connectDB();
    const doc = await Testimonial.findByIdAndDelete(id);
    if (!doc) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin testimonials DELETE:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete" }, { status: 500 });
  }
}
