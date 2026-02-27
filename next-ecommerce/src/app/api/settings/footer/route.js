/**
 * Public Footer Settings API - returns footer content for storefront
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import FooterSettings from "@/lib/models/FooterSettings";
import { USE_MONGODB } from "@/lib/config";
import { readFooterSettings } from "@/lib/store/footerFileStore";

export async function GET() {
  try {
    if (USE_MONGODB) {
      const conn = await connectDB();
      if (conn) {
        const doc = await FooterSettings.findOne().lean();
        if (doc) {
          const { _id, __v, ...rest } = doc;
          return NextResponse.json({ id: _id?.toString(), ...rest });
        }
      }
    }
    const fileData = readFooterSettings();
    if (fileData) return NextResponse.json(fileData);
    return NextResponse.json({});
  } catch (err) {
    console.error("Footer settings GET:", err);
    const fileData = readFooterSettings();
    if (fileData) return NextResponse.json(fileData);
    return NextResponse.json({});
  }
}
