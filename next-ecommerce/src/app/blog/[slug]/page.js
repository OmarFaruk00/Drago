"use client";

/**
 * Blog post detail - fetches from API by slug
 */

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogContent from "@/components/blog/BlogContent";
import BlogSidebar from "@/components/blog/BlogSidebar";

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params?.slug;
  const [post, setPost] = useState(undefined);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch(`/api/blog/${encodeURIComponent(slug)}`).then((r) => r.json()),
      fetch("/api/blog").then((r) => r.json()),
    ])
      .then(([single, list]) => {
        setPost(single || null);
        setRecentPosts(Array.isArray(list) ? list.filter((p) => p.slug !== slug) : []);
      })
      .catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <p className="text-gray-600">Post not found.</p>
        <Link href="/blog" className="mt-2 inline-block text-brand hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-brand">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{post.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 mb-6">
            {post.image ? (
              <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 70vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          <BlogHeader post={post} />
          <div className="mt-6">
            <BlogContent post={post} />
          </div>
        </div>
        <aside className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <BlogSidebar recentPosts={recentPosts} />
          </div>
        </aside>
      </div>
    </div>
  );
}
