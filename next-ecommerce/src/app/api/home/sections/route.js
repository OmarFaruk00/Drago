/**
 * Public API: GET /api/home/sections
 * Returns { topProducts, exploreProducts } for home page.
 * Explore Products: picks from ALL categories (all types) for variety.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import HomeSections from "@/lib/models/HomeSections";
import { getProducts, getProductsByIds } from "@/lib/services/productService";
import { USE_MONGODB } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Pick products from all categories (round-robin) to show diverse types.
 */
function pickFromAllCategories(products, excludeIds, count) {
  const exclude = new Set(excludeIds);
  const rest = products.filter((p) => !exclude.has(p.id));
  if (rest.length === 0 || count <= 0) return [];

  const byCat = {};
  for (const p of rest) {
    const cat = p.category || "Other";
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(p);
  }
  let cats = Object.keys(byCat);
  const result = [];
  while (result.length < count && cats.length > 0) {
    let added = 0;
    for (const cat of cats) {
      const arr = byCat[cat];
      if (arr.length > 0) {
        result.push(arr.shift());
        added++;
        if (result.length >= count) break;
      }
    }
    cats = cats.filter((c) => byCat[c]?.length > 0);
    if (added === 0) break;
  }
  return result.slice(0, count);
}

export async function GET() {
  try {
    if (!USE_MONGODB) {
      const all = await getProducts({});
      const topProducts = all.slice(0, 12);
      const topIds = topProducts.map((p) => p.id);
      const exploreProducts = pickFromAllCategories(all, topIds, 12);
      return NextResponse.json({ topProducts, exploreProducts });
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
        exploreProducts = pickFromAllCategories(all, topIds, exploreCount);
      }
      return NextResponse.json({ topProducts, exploreProducts });
    }

    const all = await getProducts({});
    const topProducts = all.slice(0, 12);
    const topIdsFallback = topProducts.map((p) => p.id);
    const exploreProducts = pickFromAllCategories(all, topIdsFallback, exploreCount);
    return NextResponse.json({
      topProducts,
      exploreProducts,
    });
  } catch (err) {
    console.error("Home sections GET:", err);
    return NextResponse.json(
      { error: "Failed to fetch home sections" },
      { status: 500 }
    );
  }
}
