"use client";

/**
 * Testimonials - "What Our Customers Say" section
 * Design: Red background, 3 cards with avatar, name, quote, 5 stars
 */

import Image from "next/image";

export default function Testimonials({ testimonials }) {
  return (
    <section className="py-12 md:py-16 bg-brand">
      <div className="w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden mb-2 md:mb-4 ring-2 ring-red-100 flex-shrink-0">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">{t.name}</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm mt-1 line-clamp-3 md:line-clamp-none">&quot;{t.text}&quot;</p>
              <div className="flex gap-0.5 mt-1 md:mt-3 text-amber-500 text-xs md:text-base">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
