"use client";

/**
 * Blog listing page - posts from API (admin-managed)
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-video bg-gray-100">
                {post.image ? (
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-brand font-medium">{post.category}</p>
                <h2 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-brand">{post.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {post.date} · {post.author}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
