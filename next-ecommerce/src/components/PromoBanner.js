"use client";

/**
 * PromoBanner - Full-width promotional banner (e.g. 37% OFF with phones)
 * Design: 3 iPhones, discount text, red Shop Now button
 */

import Link from "next/link";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="py-8 md:py-12 bg-gray-100">
      <div className="w-full">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 min-h-[200px] md:min-h-[280px] flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
          </div>
          {/* Content */}
          <div className="relative z-10 flex-1">
            <p className="text-4xl md:text-5xl font-bold text-white mb-2">37% OFF</p>
            <p className="text-white/90 text-lg mb-4">On Latest Smartphones</p>
            <Link
              href="/products?category=Electronics"
              className="inline-flex px-8 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
            >
              Shop Now
            </Link>
          </div>
          {/* Phone images */}
          <div className="relative z-10 flex gap-2 md:gap-4 mt-6 md:mt-0">
            <div className="w-24 h-40 md:w-32 md:h-52 relative">
              <Image
                src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200&h=400&fit=crop"
                alt="Phone"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <div className="w-24 h-40 md:w-32 md:h-52 relative">
              <Image
                src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=400&fit=crop"
                alt="Phone"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <div className="w-24 h-40 md:w-32 md:h-52 relative hidden sm:block">
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
