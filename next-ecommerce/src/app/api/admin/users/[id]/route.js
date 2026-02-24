/**
 * Admin User by ID - PUT, DELETE
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  if (!USE_MONGODB) return NextResponse.json({ error: "Database required." }, { status: 503 });
  try {
    const body = await request.json();
    const { name, email, role } = body;
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const update = {};
    if (name != null) update.name = name;
    if (email != null) update.email = email;
    if (role != null) update.role = role;
    const user = await User.findByIdAndUpdate(id, update, { new: true })
      .select("-password")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ ...user, id: user._id?.toString() });
  } catch (err) {
    console.error("Admin user PUT:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
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
    const user = await User.findByIdAndDelete(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin user DELETE:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
