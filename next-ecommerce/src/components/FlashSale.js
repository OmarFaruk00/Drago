"use client";

/**
 * FlashSale - Fetches from /api/flash-sale. Renders only when active and end time not passed.
 * Products and time are set by admin (Flash Sale settings).
 */

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useFlashSaleCountdown } from "@/lib/utils/useFlashSaleCountdown";

export default function FlashSale() {
  const [flashData, setFlashData] = useState(null);
  const timeLeft = useFlashSaleCountdown(flashData?.endTime ?? null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/flash-sale")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.active && data.endTime != null) {
          setFlashData({
            products: Array.isArray(data.products) ? data.products : [],
            endTime: data.endTime,
            bannerImage: data.bannerImage ?? "",
            bannerImageScale: Math.min(150, Math.max(50, Number(data.bannerImageScale) || 100)),
          });
        } else {
          setFlashData(null);
        }
      })
      .catch(() => setFlashData(null));
  }, []);

  const products = flashData?.products ?? [];
  const SLIDE_SIZE = 4;
  const TOTAL_SLIDES = 3;
  const TOTAL_PRODUCTS = SLIDE_SIZE * TOTAL_SLIDES;

  const initialPool = useMemo(() => {
    if (!products?.length) return [];
    const pool = [];
    while (pool.length < TOTAL_PRODUCTS) {
      pool.push(...products);
    }
    return pool.slice(0, TOTAL_PRODUCTS);
  }, [products.length]);

  const [preparedProducts, setPreparedProducts] = useState(initialPool);

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
  }, [products]);

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

  const expired = timeLeft.days === 0 && timeLeft.hrs === 0 && timeLeft.min === 0 && timeLeft.sec === 0;
  if (!flashData || expired) return null;

  return (
    <section className="pt-2 pb-2 sm:pt-3 sm:pb-3 md:pt-4 md:pb-4 px-3 sm:px-4">
      <div className="border border-gray-800 bg-[#02020a] p-3 sm:p-4 md:p-6 text-white rounded-lg sm:rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between">
          {/* FLASH SALE banner - from admin (optional) */}
          {flashData.bannerImage && (
            <div
              className="h-16 sm:h-20 md:h-24 lg:h-28 flex items-center w-full sm:w-auto justify-center sm:justify-start shrink-0"
              style={{ transform: `scale(${(flashData.bannerImageScale || 100) / 100})`, transformOrigin: "left center" }}
            >
              <Image
                src={flashData.bannerImage}
                alt="Flash Sale"
                width={280}
                height={112}
                className="h-full w-auto max-w-full sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] object-contain object-left"
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 200px, 280px"
                unoptimized={flashData.bannerImage?.startsWith("data:")}
              />
            </div>
          )}
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
          {products.length > 0 ? (
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
          ) : (
            <div className="py-8 text-center">
              <p className="text-white/80 text-sm mb-4">No products in this flash sale yet.</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-brand font-medium hover:underline"
              >
                Browse all products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
