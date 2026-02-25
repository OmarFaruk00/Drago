/**
 * Public API: GET single blog post by slug
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { USE_MONGODB } from "@/lib/config";

export async function GET(request, { params }) {
  const slug = params?.slug;
  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });
  try {
    if (USE_MONGODB) {
      await connectDB();
      const post = await BlogPost.findOne({ slug, published: true }).lean();
      if (!post) return NextResponse.json(null);
      return NextResponse.json({
        id: post._id?.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        author: post.author,
        category: post.category,
        date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "",
      });
    }
    return NextResponse.json(null);
  } catch (err) {
    console.error("Blog slug GET:", err);
    return NextResponse.json(null);
  }
}
