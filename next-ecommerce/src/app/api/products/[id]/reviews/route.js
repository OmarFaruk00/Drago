/**
 * Product Reviews - GET (list) and POST (create, auth required)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import ProductReview from "@/lib/models/ProductReview";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  try {
    await connectDB();
    const reviews = await ProductReview.find({
      productId: id,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const list = reviews.map((r) => ({
      id: r._id?.toString(),
      productId: r.productId?.toString(),
      userName: r.userName,
      userAvatar: r.userAvatar || null,
      text: r.text,
      images: r.images || [],
      rating: r.rating,
      createdAt: r.createdAt,
    }));

    return NextResponse.json(list);
  } catch (err) {
    console.error("Reviews GET:", err);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Login to submit a review." }, { status: 401 });
  }

  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 0));
    const images = Array.isArray(body.images) ? body.images.filter((u) => typeof u === "string" && u) : [];

    if (!text) {
      return NextResponse.json({ error: "Review text is required." }, { status: 400 });
    }
    if (rating < 1) {
      return NextResponse.json({ error: "Please select a rating (1-5)." }, { status: 400 });
    }

    await connectDB();

    const doc = await ProductReview.create({
      productId: id,
      userId: session.user.id,
      userName: session.user.name || "User",
      userEmail: session.user.email || "",
      userAvatar: session.user.image || "",
      text,
      images: images.slice(0, 5),
      rating,
      status: "approved",
    });

    // Update product rating and review count
    const reviews = await ProductReview.find({ productId: id, status: "approved" }).lean();
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;

    await Product.findByIdAndUpdate(id, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: count,
    });

    return NextResponse.json({
      id: doc._id?.toString(),
      userName: doc.userName,
      userAvatar: doc.userAvatar,
      text: doc.text,
      images: doc.images || [],
      rating: doc.rating,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error("Reviews POST:", err);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
