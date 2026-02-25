/**
 * Public API: GET list of published blog posts
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import BlogPost from "@/lib/models/BlogPost";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  try {
    if (USE_MONGODB) {
      await connectDB();
      const posts = await BlogPost.find({ published: true })
        .sort({ publishedAt: -1 })
        .lean();
      const list = posts.map((p) => ({
        id: p._id?.toString(),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        image: p.image,
        author: p.author,
        category: p.category,
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "",
      }));
      return NextResponse.json(list);
    }
    return NextResponse.json([]);
  } catch (err) {
    console.error("Blog list GET:", err);
    return NextResponse.json([]);
  }
}
