/**
 * Admin Coupon by ID - GET, PUT, DELETE
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Coupon from "@/lib/models/Coupon";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

function getStatus(coupon) {
  const now = new Date();
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);
  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  if (!USE_MONGODB) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await connectDB();
    const coupon = await Coupon.findById(id).lean();
    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    const doc = { ...coupon, id: coupon._id?.toString(), _id: undefined, __v: undefined };
    doc.status = getStatus(doc);
    return NextResponse.json(doc);
  } catch (err) {
    console.error("Coupon GET:", err);
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    const body = await request.json();

    if (!USE_MONGODB) {
      return NextResponse.json({ error: "Database required." }, { status: 503 });
    }
    await connectDB();
    const update = { ...body };
    delete update._id;
    delete update.id;
    delete update.usageCount;
    const coupon = await Coupon.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    const doc = { ...coupon, id: coupon._id?.toString(), _id: undefined, __v: undefined };
    doc.status = getStatus(doc);
    return NextResponse.json(doc);
  } catch (err) {
    console.error("Coupon PUT:", err);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    if (!USE_MONGODB) {
      return NextResponse.json({ error: "Database required." }, { status: 503 });
    }
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Coupon DELETE:", err);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
