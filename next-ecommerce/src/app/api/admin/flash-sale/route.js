/**
 * Admin API: GET /api/admin/flash-sale, PUT /api/admin/flash-sale
 * Get/update flash sale settings (startTime, endTime, productIds).
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import FlashSaleSettings from "@/lib/models/FlashSaleSettings";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) {
    return NextResponse.json({ startTime: null, endTime: null, productIds: [] });
  }
  try {
    await connectDB();
    const doc = await FlashSaleSettings.findOne().lean();
    if (!doc) {
      return NextResponse.json({ startTime: null, endTime: null, productIds: [] });
    }
    return NextResponse.json({
      startTime: doc.startTime ? new Date(doc.startTime).toISOString().slice(0, 16) : null,
      endTime: doc.endTime ? new Date(doc.endTime).toISOString().slice(0, 16) : null,
      productIds: Array.isArray(doc.productIds) ? doc.productIds : [],
    });
  } catch (err) {
    console.error("Admin flash sale GET:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) {
    return NextResponse.json({ error: "Database required" }, { status: 503 });
  }
  try {
    const body = await request.json();
    let startTime = body.startTime;
    let endTime = body.endTime;
    const productIds = (Array.isArray(body.productIds) ? body.productIds : [])
      .map((id) => (id != null ? String(id).trim() : ""))
      .filter(Boolean);

    if (startTime) startTime = new Date(startTime);
    else startTime = null;
    if (endTime) endTime = new Date(endTime);
    else endTime = null;

    await connectDB();
    const doc = await FlashSaleSettings.findOneAndUpdate(
      {},
      { startTime, endTime, productIds },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      startTime: doc.startTime ? new Date(doc.startTime).toISOString().slice(0, 16) : null,
      endTime: doc.endTime ? new Date(doc.endTime).toISOString().slice(0, 16) : null,
      productIds: Array.isArray(doc.productIds) ? doc.productIds : [],
    });
  } catch (err) {
    console.error("Admin flash sale PUT:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
