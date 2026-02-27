/**
 * Admin Product by ID - GET, PUT, DELETE
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";
import { requireAdmin } from "@/lib/adminAuth";
import { products } from "@/lib/data/products";
import { USE_MONGODB } from "@/lib/config";

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    if (USE_MONGODB) {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
      const product = await Product.findById(id).lean();
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      return NextResponse.json({
        id: product._id?.toString(),
        ...product,
        _id: undefined,
        __v: undefined,
        stock: product.stockQuantity ?? 0,
      });
    }

    const p = products.find((x) => x.id === id);
    if (!p) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({
      ...p,
      stock: p.stockQuantity ?? (p.inStock ? 99 : 0),
    });
  } catch (err) {
    console.error("Admin product GET:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    const body = await request.json();

    if (USE_MONGODB) {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
      const update = {};
      if (body.name != null) update.name = body.name;
      if (body.description != null) update.description = body.description;
      if (body.price != null) update.price = body.price;
      if (body.image != null) update.image = body.image;
      if (body.category != null) update.category = body.category;
      if (body.stock != null) {
        update.stockQuantity = body.stock;
        update.inStock = body.stock > 0;
      }
      if (body.specifications != null) update.specifications = typeof body.specifications === "object" ? body.specifications : {};
      if (body.warranty != null) update.warranty = typeof body.warranty === "string" ? body.warranty : "";
      const product = await Product.findByIdAndUpdate(id, update, { new: true }).lean();
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      return NextResponse.json({
        id: product._id?.toString(),
        ...product,
        _id: undefined,
        __v: undefined,
        stock: product.stockQuantity,
      });
    }

    const idx = products.findIndex((p) => p.id === id);
    if (idx < 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    const p = products[idx];
    if (body.name != null) p.name = body.name;
    if (body.price != null) p.price = body.price;
    if (body.stock != null) {
      p.stockQuantity = body.stock;
      p.inStock = body.stock > 0;
    }
    if (body.category != null) p.category = body.category;
    if (body.image != null) p.image = body.image;
    if (body.description != null) p.description = body.description;
    if (body.specifications != null) p.specifications = typeof body.specifications === "object" ? body.specifications : {};
    if (body.warranty != null) p.warranty = typeof body.warranty === "string" ? body.warranty : "";
    return NextResponse.json({ ...p, stock: p.stockQuantity ?? (p.inStock ? 99 : 0) });
  } catch (err) {
    console.error("Admin product PUT:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    if (USE_MONGODB) {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
      const product = await Product.findByIdAndDelete(id);
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    const idx = products.findIndex((p) => p.id === id);
    if (idx < 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    products.splice(idx, 1);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin product DELETE:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
