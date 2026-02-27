/**
 * Public API: GET /api/settings/tracking
 * Returns GTM ID and FB Pixel ID (from DB or env fallback)
 * No auth required - used by client for analytics init
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import TrackingSettings from "@/lib/models/TrackingSettings";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  try {
    const fallback = {
      gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
      fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
    };
    if (!USE_MONGODB) {
      return NextResponse.json(fallback);
    }
    await connectDB();
    const doc = await TrackingSettings.findOne().lean();
    if (!doc) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json({
      gtmId: doc.gtmId || fallback.gtmId,
      fbPixelId: doc.fbPixelId || fallback.fbPixelId,
    });
  } catch (err) {
    console.error("Tracking settings GET:", err);
    return NextResponse.json({
      gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
      fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
    });
  }
}
