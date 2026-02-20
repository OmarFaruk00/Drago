"use client";

/**
 * FlashSale - 3-slide carousel (4 cards per slide) using ProductCard
 */

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function FlashSale({ products = [] }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hrs: 6,
    min: 1,
    sec: 29,
  });
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
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hrs, min, sec } = prev;
        if (sec > 0) sec--;
        else {
          sec = 59;
          if (min > 0) min--;
          else {
            min = 59;
            if (hrs > 0) hrs--;
            else {
              hrs = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hrs, min, sec };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const countdownItems = [
    { label: "Day", value: timeLeft.days },
    { label: "Min", value: timeLeft.min },
    { label: "Hour", value: timeLeft.hrs },
    { label: "Sec", value: timeLeft.sec },
  ];

  return (
    <section className="pt-2 pb-2 md:pt-4 md:pb-4">
      <div className="border border-gray-800 bg-[#02020a] p-4 md:p-6 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* FLASH SALE banner - original image */}
          <div className="h-28 flex items-center">
            <Image
              src="/flash-sale-banner.png.jpg"
              alt="Flash Sale"
              width={280}
              height={112}
              className="h-full w-auto max-w-[280px] object-contain object-left"
              priority
            />
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link
              href="/products"
              className="flex items-center gap-1 text-white text-sm font-medium hover:text-brand transition"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-4">
            {countdownItems.map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <span className="text-xs font-normal uppercase tracking-widest text-white/90">
                  {label}
                </span>
                <div className="w-14 rounded-lg bg-gray-100 px-4 py-3 text-2xl font-bold text-gray-900 tabular-nums">
                  {String(value).padStart(2, "0")}
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {slides.map((slideProducts, idx) => (
                  <div key={`slide-${idx}`} className="w-full flex-shrink-0 px-1">
                    <div className="flex flex-nowrap gap-3 lg:gap-4">
                      {slideProducts.map((product, productIndex) => (
                        <div
                          key={`${idx}-${product.id}`}
                          className={`min-w-[170px] flex-[0_0_50%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] ${
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
