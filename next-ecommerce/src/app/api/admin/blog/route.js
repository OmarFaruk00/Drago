/**
 * Admin API: GET list (all posts), POST create. Requires admin auth.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

function toItem(p) {
  const doc = p.toObject ? p.toObject() : p;
  return {
    id: doc._id?.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    image: doc.image,
    author: doc.author,
    category: doc.category,
    published: doc.published,
    publishedAt: doc.publishedAt,
    createdAt: doc.createdAt,
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  try {
    if (USE_MONGODB) {
      await connectDB();
      const posts = await BlogPost.find().sort({ publishedAt: -1, createdAt: -1 }).lean();
      const list = posts.map((p) => ({
        id: p._id?.toString(),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        image: p.image,
        author: p.author,
        category: p.category,
        published: p.published,
        publishedAt: p.publishedAt,
      }));
      return NextResponse.json(list);
    }
    return NextResponse.json([]);
  } catch (err) {
    console.error("Admin blog GET:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, image, author, category, published } = body;
    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug required" }, { status: 400 });
    }
    if (USE_MONGODB) {
      await connectDB();
      const existing = await BlogPost.findOne({ slug });
      if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      const post = await BlogPost.create({
        title,
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        excerpt: excerpt ?? "",
        content: content ?? "",
        image: image ?? "",
        author: author ?? "Drago",
        category: category ?? "General",
        published: published !== false,
        publishedAt: new Date(),
      });
      return NextResponse.json(toItem(post));
    }
    return NextResponse.json({ id: "1", title, slug });
  } catch (err) {
    console.error("Admin blog POST:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
