/**
 * Public API: GET /api/home/sections
 * Returns { topProducts, exploreProducts } for home page.
 * Uses HomeSections if set; otherwise fallback: first 12 = top, next 12 = explore.
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
      return NextResponse.json({
        topProducts: all.slice(0, 12),
        exploreProducts: all.slice(12, 24),
      });
    }
    await connectDB();
    const settings = await HomeSections.get();
    const topIds = settings?.topProductIds?.length ? settings.topProductIds.map((id) => id.toString()) : [];
    const exploreIds = settings?.exploreProductIds?.length ? settings.exploreProductIds.map((id) => id.toString()) : [];
    const exploreCount = Math.max(0, Number(settings?.exploreCount) || 12);

    if (topIds.length > 0 || exploreIds.length > 0) {
      const topProducts = topIds.length > 0 ? await getProductsByIds(topIds) : [];
      let exploreProducts = exploreIds.length > 0 ? await getProductsByIds(exploreIds) : [];
      if (exploreIds.length === 0 && exploreCount > 0) {
        const all = await getProducts({});
        const excludeSet = new Set(topIds);
        const rest = all.filter((p) => !excludeSet.has(p.id));
        exploreProducts = rest.slice(0, exploreCount);
      }
      return NextResponse.json({ topProducts, exploreProducts });
    }

    const all = await getProducts({});
    return NextResponse.json({
      topProducts: all.slice(0, 12),
      exploreProducts: all.slice(12, 12 + exploreCount),
    });
  } catch (err) {
    console.error("Home sections GET:", err);
    return NextResponse.json(
      { error: "Failed to fetch home sections" },
      { status: 500 }
    );
  }
}
