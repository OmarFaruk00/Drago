"use client";

/**
 * CategorySection - Horizontal scroll of category icons
 * Design: Mobile, Laptop, Camera, Headphone, Watch, Speaker, etc.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { shuffleArray } from "@/lib/utils/shuffle";

export default function CategorySection({ categories }) {
  const [shuffled, setShuffled] = useState(categories);

  useEffect(() => {
    setShuffled(shuffleArray(categories));
  }, [categories]);

  const displayCategories = shuffled.length ? shuffled : categories;
  return (
    <section className="py-8 md:py-12">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
        {/* 3 rows grid - 3 cols on desktop (3+3+2), scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:overflow-visible md:grid md:grid-cols-4 md:grid-rows-2 md:gap-x-6 md:gap-y-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug || cat.name}`}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 w-20 md:w-24 group"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-red-500 transition">
                <Image
                  src={cat.image || `https://via.placeholder.com/80?text=${cat.icon}`}
                  alt={cat.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-[11px] md:text-[13px] font-medium text-gray-700 group-hover:text-red-600 text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
