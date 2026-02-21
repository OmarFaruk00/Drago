/**
 * Admin Products Import API - Bulk create products (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";
import { requireAdmin } from "@/lib/adminAuth";
import { products } from "@/lib/data/products";
import { USE_MONGODB } from "@/lib/config";

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const items = Array.isArray(body.products) ? body.products : Array.isArray(body) ? body : [];
    if (items.length === 0) {
      return NextResponse.json({ error: "No products to import" }, { status: 400 });
    }

    const created = [];

    if (USE_MONGODB) {
      await connectDB();
      for (const p of items) {
        const name = p.name || p.title || "";
        const price = Number(p.price) || 0;
        if (!name || price < 0) continue;
        const product = await Product.create({
          name,
          price,
          image: p.image || "https://via.placeholder.com/400",
          category: p.category || "General",
          stockQuantity: p.stock ?? p.stockQuantity ?? 0,
          inStock: (p.stock ?? p.stockQuantity ?? 0) > 0,
          description: p.description || "",
        });
        created.push(product.toObject());
      }
    } else {
      for (const p of items) {
        const name = p.name || p.title || "";
        const price = Number(p.price) || 0;
        if (!name || price < 0) continue;
        const newProduct = {
          id: String(products.length + 1),
          name,
          price,
          originalPrice: p.originalPrice ?? null,
          image: p.image || "https://via.placeholder.com/400",
          category: p.category || "General",
          rating: 0,
          reviewCount: 0,
          inStock: (p.stock ?? p.stockQuantity ?? 0) > 0,
          stockQuantity: p.stock ?? p.stockQuantity ?? 0,
          description: p.description || "",
        };
        products.push(newProduct);
        created.push(newProduct);
      }
    }

    return NextResponse.json({ success: true, imported: created.length });
  } catch (err) {
    console.error("Admin products import:", err);
    return NextResponse.json({ error: "Failed to import products" }, { status: 500 });
  }
}
