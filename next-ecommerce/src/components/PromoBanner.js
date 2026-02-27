"use client";

/**
 * PromoBanner - Full-width promotional banner (e.g. 37% OFF with phones)
 * Design: 3 iPhones, discount text, red Shop Now button
 */

import Link from "next/link";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="py-3 sm:py-4 md:py-6 bg-white px-3 sm:px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 min-h-[140px] sm:min-h-[180px] md:min-h-[240px] lg:min-h-[280px] flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 md:p-8 lg:p-12 gap-4 md:gap-0">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
          </div>
          {/* Content */}
          <div className="relative z-10 flex-1 order-2 md:order-1">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">37% OFF</p>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-2 sm:mb-4">On Latest Smartphones</p>
            <Link
              href="/products?category=Electronics"
              className="inline-flex px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 text-sm sm:text-base bg-brand text-white font-semibold rounded hover:bg-brand-dark transition"
            >
              Shop Now
            </Link>
          </div>
          {/* Phone images */}
          <div className="relative z-10 flex gap-1 sm:gap-2 md:gap-4 order-1 md:order-2 mt-0 md:mt-0 justify-center md:justify-end">
            <div className="w-14 h-24 sm:w-20 sm:h-32 md:w-28 md:h-44 lg:w-32 lg:h-52 relative shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200&h=400&fit=crop"
                alt="Phone"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <div className="w-14 h-24 sm:w-20 sm:h-32 md:w-28 md:h-44 lg:w-32 lg:h-52 relative shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=400&fit=crop"
                alt="Phone"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <div className="w-14 h-24 sm:w-20 sm:h-32 md:w-28 md:h-44 lg:w-32 lg:h-52 relative hidden md:block shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=200&h=400&fit=crop"
                alt="Phone"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
