"use client";

/**
 * Blog listing page
 */

import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/data/blog";

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
            <div className="relative aspect-video bg-gray-100">
              <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105" />
            </div>
            <div className="p-4">
              <p className="text-xs text-red-600 font-medium">{post.category}</p>
              <h2 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-red-600">{post.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{post.date} · {post.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
