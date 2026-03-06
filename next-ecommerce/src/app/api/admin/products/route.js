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
    const { name, price, originalPrice, image, images, category, subCategory, stock, description, sizeVariants, colors, specifications, warranty, freeShipping, productCode } = body;
    const catStr = typeof category === "string" ? category : (category?.name ?? "General");
    if (!name || price == null) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    if (USE_MONGODB) {
      await connectDB();
      const imgList = Array.isArray(images) && images.length > 0 ? images : [image || "https://via.placeholder.com/400"];
      const product = await Product.create({
        name: String(name).trim(),
        price: Number(price) || 0,
        originalPrice: originalPrice != null && originalPrice > 0 ? originalPrice : null,
        image: imgList[0],
        images: imgList,
        category: catStr || "General",
        subCategory: subCategory || "",
        stockQuantity: stock ?? 0,
        inStock: (stock ?? 0) > 0,
        description: description || "",
        sizeVariants: Array.isArray(sizeVariants) ? sizeVariants : [],
        colors: Array.isArray(colors) ? colors : [],
        specifications: specifications && typeof specifications === "object" ? specifications : {},
        warranty: typeof warranty === "string" ? warranty : "",
        freeShipping: !!freeShipping,
        productCode: (productCode != null && typeof productCode === "string") ? productCode.trim() : "",
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

    const imgList = Array.isArray(images) && images.length > 0 ? images : [image || "https://via.placeholder.com/400"];
    const newProduct = {
      id: String(products.length + 1),
      name,
      price: Number(price ?? 0),
      originalPrice: originalPrice != null && originalPrice > 0 ? Number(originalPrice) : null,
      image: imgList[0],
      images: imgList,
      category: catStr || "General",
      subCategory: subCategory || "",
      rating: 0,
      reviewCount: 0,
      inStock: (stock ?? 0) > 0,
      stockQuantity: stock ?? 0,
      description: description || "",
      sizeVariants: Array.isArray(sizeVariants) ? sizeVariants : [],
      colors: Array.isArray(colors) ? colors : [],
      specifications: specifications && typeof specifications === "object" ? specifications : {},
      warranty: typeof warranty === "string" ? warranty : "",
      freeShipping: !!freeShipping,
    };
    products.push(newProduct);
    return NextResponse.json(newProduct);
  } catch (err) {
    console.error("Admin products POST:", err);
    const msg =
      err?.message ||
      (err?.code === 11000 ? "A product with this name or slug already exists." : "Failed to create product");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
