"use client";

/**
 * Testimonials - "What Our Customers Say" section
 * Design: Red background, 3 cards with avatar, name, quote, 5 stars
 */

import Image from "next/image";

export default function Testimonials({ testimonials }) {
  return (
    <section className="py-12 md:py-16 bg-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-2 ring-red-100">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-semibold text-gray-900">{t.name}</h3>
              <p className="text-gray-600 text-sm mt-1">&quot;{t.text}&quot;</p>
              <div className="flex gap-0.5 mt-3 text-amber-500">
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
