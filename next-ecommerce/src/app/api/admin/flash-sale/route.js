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
    const userTzHours = Number(process.env.FLASH_SALE_TZ_OFFSET) || 6;
    const isServerUTC = new Date().getTimezoneOffset() === 0;
    const toFormValue = (date) => {
      if (!date) return null;
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      if (isServerUTC && userTzHours) {
        d.setTime(d.getTime() + userTzHours * 60 * 60 * 1000);
      }
      return d.toISOString().slice(0, 16);
    };
    return NextResponse.json({
      startTime: toFormValue(doc.startTime),
      endTime: toFormValue(doc.endTime),
      productIds: Array.isArray(doc.productIds) ? doc.productIds : [],
      bannerImage: doc.bannerImage ?? "",
      bannerImageScale: Math.min(150, Math.max(50, Number(doc.bannerImageScale) || 100)),
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
    const bannerImage = typeof body.bannerImage === "string" ? body.bannerImage.trim() : "";
    const bannerImageScale = Math.min(150, Math.max(50, Number(body.bannerImageScale) || 100));
    const productIds = (Array.isArray(body.productIds) ? body.productIds : [])
      .map((id) => (id != null ? String(id).trim() : ""))
      .filter(Boolean);

    const userTzHours = Number(process.env.FLASH_SALE_TZ_OFFSET) || 6;
    const isServerUTC = new Date().getTimezoneOffset() === 0;
    const adjustForTz = (val) => {
      if (!val || !String(val).trim()) return null;
      const d = new Date(val);
      if (isNaN(d.getTime())) return null;
      if (isServerUTC && userTzHours) {
        return new Date(d.getTime() - userTzHours * 60 * 60 * 1000);
      }
      return d;
    };
    startTime = adjustForTz(startTime);
    endTime = adjustForTz(endTime);

    await connectDB();
    const doc = await FlashSaleSettings.findOneAndUpdate(
      {},
      { startTime, endTime, productIds, bannerImage, bannerImageScale },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      startTime: doc.startTime ? new Date(doc.startTime).toISOString().slice(0, 16) : null,
      endTime: doc.endTime ? new Date(doc.endTime).toISOString().slice(0, 16) : null,
      productIds: Array.isArray(doc.productIds) ? doc.productIds : [],
      bannerImage: doc.bannerImage ?? "",
      bannerImageScale: Math.min(150, Math.max(50, Number(doc.bannerImageScale) || 100)),
    });
  } catch (err) {
    console.error("Admin flash sale PUT:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
