"use client";

/**
 * CategorySection - Horizontal scroll of category icons
 * Design: Mobile, Laptop, Camera, Headphone, Watch, Speaker, etc.
 */

import Link from "next/link";
import Image from "next/image";

export default function CategorySection({ categories }) {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 md:overflow-visible md:flex-wrap md:justify-start scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug || cat.name}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 w-20 md:w-24 group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-red-500 transition">
                <Image
                  src={cat.image || `https://via.placeholder.com/80?text=${cat.icon}`}
                  alt={cat.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-red-600 text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
