/**
 * Admin Products API - CRUD (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";
import { requireAdmin } from "@/lib/adminAuth";
import { products } from "@/lib/data/products";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      const list = await Product.find().lean();
      return NextResponse.json(
        list.map((p) => ({
          id: p._id?.toString(),
          ...p,
          _id: undefined,
          __v: undefined,
          stock: p.stockQuantity ?? (p.inStock ? 99 : 0),
        }))
      );
    }
    return NextResponse.json(
      products.map((p) => ({
        ...p,
        stock: p.stockQuantity ?? (p.inStock ? 99 : 0),
      }))
    );
  } catch (err) {
    console.error("Admin products GET:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, price, image, category, stock, description } = body;
    if (!name || price == null) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    if (USE_MONGODB) {
      await connectDB();
      const product = await Product.create({
        name,
        price,
        image: image || "https://via.placeholder.com/400",
        category: category || "General",
        stockQuantity: stock ?? 0,
        inStock: (stock ?? 0) > 0,
        description: description || "",
      });
      const p = product.toObject();
      return NextResponse.json({
        id: p._id?.toString(),
        ...p,
        _id: undefined,
        __v: undefined,
        stock: p.stockQuantity,
      });
    }

    const newProduct = {
      id: String(products.length + 1),
      name,
      price: Number(price),
      originalPrice: null,
      image: image || "https://via.placeholder.com/400",
      category: category || "General",
      rating: 0,
      reviewCount: 0,
      inStock: (stock ?? 0) > 0,
      stockQuantity: stock ?? 0,
      description: description || "",
    };
    products.push(newProduct);
    return NextResponse.json(newProduct);
  } catch (err) {
    console.error("Admin products POST:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
