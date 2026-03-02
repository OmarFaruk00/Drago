/**
 * Moderators API - Get, Update, Delete single moderator (super_admin only)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/lib/models/Admin";
import { requireSuperAdmin } from "../../../../../lib/adminAuth.js";
import { USE_MONGODB } from "@/lib/config";
import mongoose from "mongoose";

const DEFAULT_PERMISSIONS = {
  products: false,
  orders: false,
  customers: false,
  coupons: false,
  categories: false,
  content: false,
  delivery: false,
  dashboard: false,
};

export async function GET(request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid moderator ID" }, { status: 400 });
  }

  try {
    await connectDB();
    const doc = await Admin.findOne({ _id: id, role: "moderator" })
      .select("-password")
      .lean();
    if (!doc) return NextResponse.json({ error: "Moderator not found" }, { status: 404 });
    return NextResponse.json({
      ...doc,
      id: doc._id?.toString(),
      _id: undefined,
      __v: undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid moderator ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, password, permissions } = body;

    await connectDB();
    const doc = await Admin.findOne({ _id: id, role: "moderator" }).select("+password");
    if (!doc) return NextResponse.json({ error: "Moderator not found" }, { status: 404 });

    if (name != null && String(name).trim()) doc.name = String(name).trim();
    if (password != null && String(password).length >= 6) {
      doc.password = String(password);
    }
    if (permissions && typeof permissions === "object") {
      const perm = { ...(doc.permissions || DEFAULT_PERMISSIONS) };
      Object.keys(DEFAULT_PERMISSIONS).forEach((k) => {
        perm[k] = permissions[k] === true;
      });
      doc.permissions = perm;
    }
    await doc.save();

    const out = doc.toObject();
    delete out.password;
    return NextResponse.json({ ...out, id: doc._id?.toString() });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to update moderator" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireSuperAdmin();
  if (auth.error) return auth.error;

  const id = params?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid moderator ID" }, { status: 400 });
  }

  try {
    await connectDB();
    const result = await Admin.deleteOne({ _id: id, role: "moderator" });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Moderator not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
