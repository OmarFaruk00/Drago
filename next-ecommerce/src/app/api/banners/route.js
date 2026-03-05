/**
 * Public Banners API - returns enabled banners for storefront
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/lib/models/Banner";
import { USE_MONGODB } from "@/lib/config";

export async function GET(request) {
  try {
    if (USE_MONGODB) {
      await connectDB();
      const { searchParams } = new URL(request.url);
      const section = searchParams.get("section")?.trim() || null;
      const query = { enabled: true };
      if (section) {
        if (section === "hero") {
          query.$or = [
            { section: "hero" },
            { section: { $in: [null, ""] } },
            { section: { $exists: false } },
          ];
        } else {
          query.section = section;
        }
      }
      const list = await Banner.find(query).sort({ order: 1 }).lean();
      return NextResponse.json(
        list.map((b) => ({ id: b._id?.toString(), ...b, _id: undefined, __v: undefined }))
      );
    }
    return NextResponse.json([]);
  } catch (err) {
    console.error("Banners GET:", err);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
