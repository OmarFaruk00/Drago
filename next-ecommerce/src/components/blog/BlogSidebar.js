"use client";

/**
 * BlogSidebar - Top Categories, Popular Tags, Recent Posts, Ad banner
 */

import Link from "next/link";
import Image from "next/image";
import { topCategories, popularTags, blogPosts } from "@/lib/data/blog";

export default function BlogSidebar({ recentPosts = blogPosts }) {
  return (
    <aside className="space-y-8">
      {/* Top Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Categories</h3>
        <ul className="space-y-1">
          {topCategories.map((c) => (
            <li key={c.name}>
              <Link href={`/products?category=${c.name}`} className="text-gray-600 hover:text-brand text-sm">
                {c.name} ({c.count})
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Tag</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, i) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className={`px-3 py-1 text-xs rounded border transition ${
                i < 2 ? "border-brand bg-red-50 text-brand" : "border-gray-200 text-gray-600 hover:border-red-300"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Posts</h3>
        <ul className="space-y-3">
          {recentPosts.slice(0, 3).map((p) => (
            <li key={p.id}>
              <Link href={`/blog/${p.slug}`} className="flex gap-3 group">
                <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  <Image src={p.image} alt="" fill className="object-cover group-hover:scale-105" sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-800 line-clamp-2 group-hover:text-brand">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.date}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Ad Banner */}
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-100">
        <div className="relative h-32">
          <Image
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
            alt="Ad"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-sm font-semibold text-gray-800 mt-2">Fresh Deals</p>
        <span className="inline-block mt-1 px-2 py-0.5 bg-brand text-white text-xs font-bold rounded">80% OFF</span>
        <Link href="/products" className="mt-3 inline-block px-4 py-2 bg-brand text-white text-sm font-medium rounded hover:bg-brand-dark">
          Shop Now
        </Link>
      </div>
    </aside>
  );
}
