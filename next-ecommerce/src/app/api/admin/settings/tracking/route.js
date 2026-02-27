/**
 * Admin API: GET/PUT /api/admin/settings/tracking
 * Manage GTM ID and Meta Pixel ID in database
 */

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import connectDB from "@/lib/db/mongodb";
import TrackingSettings from "@/lib/models/TrackingSettings";
import { USE_MONGODB } from "@/lib/config";

const fallback = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
};

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (!USE_MONGODB) return NextResponse.json(fallback);
    await connectDB();
    const doc = await TrackingSettings.findOne().lean();
    return NextResponse.json({
      gtmId: doc?.gtmId || fallback.gtmId,
      fbPixelId: doc?.fbPixelId || fallback.fbPixelId,
    });
  } catch (err) {
    console.error("Tracking settings GET:", err);
    return NextResponse.json(fallback);
  }
}

export async function PUT(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { gtmId, fbPixelId } = body;

    if (!USE_MONGODB) {
      return NextResponse.json({ message: "Database required to save tracking settings" }, { status: 400 });
    }

    await connectDB();
    const data = {};
    if (gtmId !== undefined) data.gtmId = String(gtmId).trim();
    if (fbPixelId !== undefined) data.fbPixelId = String(fbPixelId).trim();

    await TrackingSettings.updateSettings(data);
    const doc = await TrackingSettings.findOne().lean();
    return NextResponse.json({
      gtmId: doc?.gtmId || "",
      fbPixelId: doc?.fbPixelId || "",
    });
  } catch (err) {
    console.error("Tracking settings PUT:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
