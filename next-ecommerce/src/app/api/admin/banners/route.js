/**
 * Admin Banners API - CRUD (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/lib/models/Banner";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

function toJson(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return { id: o._id?.toString(), ...o, _id: undefined, __v: undefined };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      const list = await Banner.find().sort({ order: 1 }).lean();
      return NextResponse.json(
        list.map((b) => ({ id: b._id?.toString(), ...b, _id: undefined, __v: undefined }))
      );
    }
    return NextResponse.json([]);
  } catch (err) {
    console.error("Admin banners GET:", err);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { title, subtitle, image, link, linkText, order, enabled } = body;
    if (!image || !image.trim()) {
      return NextResponse.json({ error: "Banner image is required" }, { status: 400 });
    }

    if (USE_MONGODB) {
      await connectDB();
      const banner = await Banner.create({
        title: title || "",
        subtitle: subtitle || "",
        image: image.trim(),
        link: link || "",
        linkText: linkText || "",
        order: typeof order === "number" ? order : 0,
        enabled: enabled !== false,
      });
      return NextResponse.json(toJson(banner));
    }
    return NextResponse.json({ error: "MongoDB not configured" }, { status: 500 });
  } catch (err) {
    console.error("Admin banners POST:", err);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
