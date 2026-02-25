/**
 * Admin API: GET/PUT/DELETE single blog post. Requires admin auth.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";
import mongoose from "mongoose";

function toItem(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: o._id?.toString(),
    title: o.title,
    slug: o.slug,
    excerpt: o.excerpt,
    content: o.content,
    image: o.image,
    author: o.author,
    category: o.category,
    published: o.published,
    publishedAt: o.publishedAt,
  };
}

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  try {
    if (USE_MONGODB) {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json(null);
      const post = await BlogPost.findById(id);
      if (!post) return NextResponse.json(null);
      return NextResponse.json(toItem(post));
    }
    return NextResponse.json(null);
  } catch (err) {
    console.error("Admin blog GET id:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  try {
    const body = await request.json();
    if (USE_MONGODB) {
      await connectDB();
      const post = await BlogPost.findById(id);
      if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      if (body.title !== undefined) post.title = body.title;
      if (body.slug !== undefined) post.slug = body.slug.trim().toLowerCase().replace(/\s+/g, "-");
      if (body.excerpt !== undefined) post.excerpt = body.excerpt;
      if (body.content !== undefined) post.content = body.content;
      if (body.image !== undefined) post.image = body.image;
      if (body.author !== undefined) post.author = body.author;
      if (body.category !== undefined) post.category = body.category;
      if (body.published !== undefined) post.published = body.published;
      await post.save();
      return NextResponse.json(toItem(post));
    }
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Admin blog PUT:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  try {
    if (USE_MONGODB) {
      await connectDB();
      await BlogPost.findByIdAndDelete(id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin blog DELETE:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
