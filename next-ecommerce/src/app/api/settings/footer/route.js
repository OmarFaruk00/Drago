/**
 * Public Footer Settings API - returns footer content for storefront
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import FooterSettings from "@/lib/models/FooterSettings";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  try {
    if (USE_MONGODB) {
      await connectDB();
      const doc = await FooterSettings.findOne().lean();
      if (doc) {
        const { _id, __v, ...rest } = doc;
        return NextResponse.json({ id: _id?.toString(), ...rest });
      }
    }
    return NextResponse.json(null);
  } catch (err) {
    console.error("Footer settings GET:", err);
    return NextResponse.json({ error: "Failed to fetch footer settings" }, { status: 500 });
  }
}
