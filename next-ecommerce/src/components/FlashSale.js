"use client";

/**
 * FlashSale - 3-slide carousel (4 cards per slide) using ProductCard
 */

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useFlashSaleCountdown } from "@/lib/utils/useFlashSaleCountdown";

export default function FlashSale({ products = [] }) {
  const timeLeft = useFlashSaleCountdown();
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDE_SIZE = 4;
  const TOTAL_SLIDES = 3;
  const TOTAL_PRODUCTS = SLIDE_SIZE * TOTAL_SLIDES;

  // Deterministic initial list so server and client render the same (avoids hydration error)
  const initialPool = useMemo(() => {
    if (!products?.length) return [];
    const pool = [];
    while (pool.length < TOTAL_PRODUCTS) {
      pool.push(...products);
    }
    return pool.slice(0, TOTAL_PRODUCTS);
  }, [products, TOTAL_PRODUCTS]);

  const [preparedProducts, setPreparedProducts] = useState(initialPool);

  // Shuffle only on client after mount so server and first client paint match
  useEffect(() => {
    if (!products?.length) return;
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const pool = [];
    while (pool.length < TOTAL_PRODUCTS) {
      pool.push(...shuffled);
    }
    setPreparedProducts(pool.slice(0, TOTAL_PRODUCTS));
  }, [products, TOTAL_PRODUCTS]);

  const slides = useMemo(() => {
    if (!preparedProducts.length) return [];
    const chunks = [];
    for (let i = 0; i < TOTAL_SLIDES; i += 1) {
      const start = i * SLIDE_SIZE;
      const chunk = preparedProducts.slice(start, start + SLIDE_SIZE);
      if (chunk.length) {
        chunks.push(chunk);
      }
    }
    return chunks;
  }, [preparedProducts]);

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const countdownItems = [
    { label: "Day", value: timeLeft.days },
    { label: "Hour", value: timeLeft.hrs },
    { label: "Min", value: timeLeft.min },
    { label: "Sec", value: timeLeft.sec },
  ];

  return (
    <section className="pt-2 pb-2 sm:pt-3 sm:pb-3 md:pt-4 md:pb-4 px-3 sm:px-4">
      <div className="border border-gray-800 bg-[#02020a] p-3 sm:p-4 md:p-6 text-white rounded-lg sm:rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between">
          {/* FLASH SALE banner - original image */}
          <div className="h-16 sm:h-20 md:h-24 lg:h-28 flex items-center w-full sm:w-auto justify-center sm:justify-start shrink-0">
            <Image
              src="/flash-sale-banner.png.jpg"
              alt="Flash Sale"
              width={280}
              height={112}
              className="h-full w-auto max-w-full sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] object-contain object-left"
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 200px, 280px"
            />
          </div>
          <div className="flex flex-col sm:items-end items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/flash-sale"
              className="flex items-center gap-1 text-white text-sm font-medium hover:text-brand transition"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {countdownItems.map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-normal uppercase tracking-widest text-white/90">
                  {label}
                </span>
                <div className="w-9 h-9 sm:w-12 sm:h-11 md:w-14 md:h-12 rounded-md sm:rounded-lg bg-gray-100 px-1.5 sm:px-2 md:px-4 py-1.5 sm:py-2 md:py-3 text-base sm:text-xl md:text-2xl font-bold text-gray-900 tabular-nums flex items-center justify-center">
                  {String(value).padStart(2, "0")}
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 md:mt-8">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {slides.map((slideProducts, idx) => (
                  <div key={`slide-${idx}`} className="w-full flex-shrink-0 px-0.5 sm:px-1">
                    <div className="flex flex-nowrap gap-2 sm:gap-3 lg:gap-4">
                      {slideProducts.map((product, productIndex) => (
                        <div
                          key={`${idx}-${product.id}`}
                          className={`min-w-[130px] sm:min-w-[170px] flex-[0_0_50%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] ${
                            productIndex >= 2 ? "hidden lg:block" : "block"
                          }`}
                        >
                          <ProductCard product={product} variant="flash" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {slides.map((_, idx) => (
                <span
                  key={`dot-${idx}`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    idx === currentSlide ? "bg-brand" : "bg-white/30"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
