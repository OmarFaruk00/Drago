"use client";

/**
 * HeroSection - Big Sale banner with lifestyle image
 * Design: "Big Sale", "Update Your Style", red Shop Now button
 */

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="relative min-h-[280px] md:min-h-[360px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
          {/* Background image - woman with shopping bags */}
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop"
            alt="Big Sale"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-2">
              Big Sale
            </h1>
            <p className="text-lg md:text-xl text-white/95 mb-6 drop-shadow">
              Update Your Style
            </p>
            <Link
              href="/products"
              className="inline-flex w-fit px-8 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
