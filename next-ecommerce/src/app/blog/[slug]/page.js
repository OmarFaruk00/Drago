"use client";

/**
 * Blog Details Page - Hero, title, content, sidebar, comments
 */

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogContent from "@/components/blog/BlogContent";
import BlogSidebar from "@/components/blog/BlogSidebar";
import CommentSection from "@/components/blog/CommentSection";
import { blogPosts } from "@/lib/data/blog";

export default function BlogDetailsPage() {
  const params = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const found = blogPosts.find((p) => p.slug === params.slug);
    setPost(found || blogPosts[0]);
  }, [params.slug]);

  if (!post)
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        Loading...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-red-600">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Blog Details</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Hero image */}
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 mb-6">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 70vw"
            />
          </div>
          <BlogHeader post={post} />
          <div className="mt-6">
            <BlogContent post={post} />
          </div>
          <CommentSection />
        </div>

        {/* Sidebar - collapses on mobile */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <BlogSidebar recentPosts={blogPosts.filter((p) => p.id !== post.id)} />
          </div>
        </aside>
      </div>
    </div>
  );
}
