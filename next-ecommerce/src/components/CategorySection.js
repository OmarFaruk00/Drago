"use client";

/**
 * CategorySection - Grid of category cards (half the size of Top Products cards)
 * Design: Square cards, image on top, category name below, white bg, subtle border
 */

import Link from "next/link";
import Image from "next/image";

export default function CategorySection({ categories }) {
  return (
    <section className="py-8 md:py-12">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <Link
            href="/products"
            className="text-brand font-medium hover:underline flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {/* 6 per row, 2 rows = 12 cards. Compact spacing like reference */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug || cat.name}`}
              className="flex flex-col items-center bg-white rounded-md border border-brand/10 overflow-hidden group hover:border-brand/25 transition w-full"
            >
              <div className="aspect-square w-full relative bg-gray-50 overflow-hidden">
                <Image
                  src={cat.image || `https://via.placeholder.com/96?text=${cat.icon}`}
                  alt={cat.name}
                  fill
                  className="object-contain p-1 group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 25vw, 80px"
                />
              </div>
              <span className="py-1 text-[10px] font-medium text-gray-900 text-center group-hover:text-brand line-clamp-2 leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
