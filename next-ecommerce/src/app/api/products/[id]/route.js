/**
 * API Route: GET /api/products/[id]
 * Returns a single product by ID
 * Uses productService - works with dummy data or MongoDB
 */

import { NextResponse } from "next/server";
import { getProductById } from "@/lib/services/productService";

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
