/**
 * API Route: GET /api/products
 * Returns all products or filtered by query params: category, search, inStock
 * Uses productService - works with dummy data or MongoDB
 */

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/productService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search")?.toLowerCase() || undefined;
    const inStock = searchParams.get("inStock") || undefined;
    const min = searchParams.get("min") || undefined;
    const max = searchParams.get("max") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const color = searchParams.get("color") || undefined;
    const size = searchParams.get("size") || undefined;

    const products = await getProducts({ category, search, inStock, min, max, brand, color, size });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
