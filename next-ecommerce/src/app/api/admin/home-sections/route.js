/**
 * Admin API: GET/PUT /api/admin/home-sections
 * Manage which product IDs show in Top Products and Explore Our Products.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import HomeSections from "@/lib/models/HomeSections";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

function toJson(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  const topProductIds = (o.topProductIds || []).map((id) => id?.toString?.() ?? id);
  const exploreProductIds = (o.exploreProductIds || []).map((id) => id?.toString?.() ?? id);
  return {
    id: o._id?.toString(),
    topProductIds,
    exploreProductIds,
    exploreCount: o.exploreCount ?? 12,
    _id: undefined,
    __v: undefined,
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (!USE_MONGODB) {
      return NextResponse.json({
        topProductIds: [],
        exploreProductIds: [],
        exploreCount: 12,
      });
    }
    await connectDB();
    let doc = await HomeSections.findOne();
    if (!doc) {
      doc = await HomeSections.create({
        topProductIds: [],
        exploreProductIds: [],
        exploreCount: 12,
      });
    }
    return NextResponse.json(toJson(doc));
  } catch (err) {
    console.error("Admin home-sections GET:", err);
    return NextResponse.json(
      { error: "Failed to fetch home sections" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const topProductIds = Array.isArray(body.topProductIds)
      ? body.topProductIds.filter((id) => id && String(id).trim())
      : undefined;
    const exploreProductIds = Array.isArray(body.exploreProductIds)
      ? body.exploreProductIds.filter((id) => id && String(id).trim())
      : undefined;
    const exploreCount =
      body.exploreCount !== undefined ? Math.max(0, Number(body.exploreCount) || 12) : undefined;

    if (!USE_MONGODB) {
      return NextResponse.json({
        topProductIds: topProductIds || [],
        exploreProductIds: exploreProductIds || [],
        exploreCount: exploreCount ?? 12,
      });
    }
    await connectDB();
    const mongoose = await import("mongoose");
    let doc = await HomeSections.findOne();
    if (!doc) {
      doc = await HomeSections.create({
        topProductIds: [],
        exploreProductIds: [],
        exploreCount: 12,
      });
    }
    if (topProductIds !== undefined) {
      doc.topProductIds = topProductIds
        .map((id) => (mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null))
        .filter(Boolean);
    }
    if (exploreProductIds !== undefined) {
      doc.exploreProductIds = exploreProductIds
        .map((id) => (mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null))
        .filter(Boolean);
    }
    if (exploreCount !== undefined) doc.exploreCount = exploreCount;
    await doc.save();
    return NextResponse.json(toJson(doc));
  } catch (err) {
    console.error("Admin home-sections PUT:", err);
    return NextResponse.json(
      { error: "Failed to update home sections" },
      { status: 500 }
    );
  }
}
