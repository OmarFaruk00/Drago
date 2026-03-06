/**
 * Public API: GET /api/home/sections
 * Returns { topProducts } for home page Top Products section.
 * Explore Our Products is built client-side from shuffled all products.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import HomeSections from "@/lib/models/HomeSections";
import { getProducts, getProductsByIds } from "@/lib/services/productService";
import { USE_MONGODB } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (!USE_MONGODB) {
      const all = await getProducts({});
      const topProducts = all.slice(0, 10);
      return NextResponse.json({ topProducts, showTestimonials: false });
    }
    await connectDB();
    const settings = await HomeSections.get();
    const topIds = settings?.topProductIds?.length ? settings.topProductIds.map((id) => id.toString()) : [];
    const showTestimonials = !!settings?.showTestimonials;

    if (topIds.length > 0) {
      const topProducts = await getProductsByIds(topIds);
      return NextResponse.json({ topProducts, showTestimonials });
    }

    const all = await getProducts({});
    const topProducts = all.slice(0, 10);
    return NextResponse.json({ topProducts, showTestimonials });
  } catch (err) {
    console.error("Home sections GET:", err);
    return NextResponse.json(
      { error: "Failed to fetch home sections" },
      { status: 500 }
    );
  }
}
