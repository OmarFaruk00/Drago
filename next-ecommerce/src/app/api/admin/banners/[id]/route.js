/**
 * Admin Single Banner API - GET, PUT, DELETE (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/lib/models/Banner";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";
import mongoose from "mongoose";

function toJson(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return { id: o._id?.toString(), ...o, _id: undefined, __v: undefined };
}

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (!USE_MONGODB) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }
    await connectDB();
    const banner = await Banner.findById(id);
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json(toJson(banner));
  } catch (err) {
    console.error("Admin banner GET:", err);
    return NextResponse.json({ error: "Failed to fetch banner" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (!USE_MONGODB) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  try {
    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }
    const body = await request.json();
    const { title, subtitle, image, link, linkText, order, enabled } = body;

    await connectDB();
    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(image !== undefined && { image }),
        ...(link !== undefined && { link }),
        ...(linkText !== undefined && { linkText }),
        ...(order !== undefined && { order }),
        ...(enabled !== undefined && { enabled }),
      },
      { new: true }
    );
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json(toJson(banner));
  } catch (err) {
    console.error("Admin banner PUT:", err);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (!USE_MONGODB) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  try {
    const id = params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 });
    }
    await connectDB();
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin banner DELETE:", err);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
