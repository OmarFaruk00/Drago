/**
 * Public API: GET /api/categories
 * Returns active categories for storefront (no auth). Used by home, categories page, sidebar.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Category from "@/lib/models/Category";
import { USE_MONGODB } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (!USE_MONGODB) return NextResponse.json([]);
    await connectDB();
    const list = await Category.find({ status: "active" }).sort({ name: 1 }).lean();
    return NextResponse.json(
      list.map((c) => ({
        id: c._id?.toString(),
        name: c.name,
        slug: c.slug || c.name?.toLowerCase?.().replace(/[^a-z0-9]+/g, "-") || "",
        image: c.image || "",
        parentId: c.parentId?.toString() || null,
        _id: undefined,
        __v: undefined,
      }))
    );
  } catch (err) {
    console.error("Categories GET:", err);
    return NextResponse.json([], { status: 200 });
  }
}
