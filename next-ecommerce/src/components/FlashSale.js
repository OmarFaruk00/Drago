"use client";

/**
 * FlashSale - 3-slide carousel (4 cards per slide) using ProductCard
 */

import { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";

function FlashSaleLogo(props) {
  return (
    <svg
      viewBox="0 0 360 150"
      role="img"
      aria-label="Flash Sale"
      {...props}
    >
      <path
        d="M20 40 L330 10 L340 120 L40 140 Z"
        fill="#d71920"
        opacity="0.95"
      />
      <path
        d="M70 5 L330 5 L300 70 L40 80 Z"
        fill="#071933"
      />
      <path
        d="M320 120 L345 110 L335 150 L305 140 Z"
        fill="#ab0f1b"
      />
      <path
        d="M100 0 L145 0 L120 60 L165 60 L95 140 L120 70 L75 70 Z"
        fill="#ffda2d"
      />
      <text
        x="180"
        y="55"
        fill="#ffffff"
        fontSize="36"
        fontWeight="700"
        fontFamily="Montserrat, Arial, sans-serif"
        textAnchor="middle"
      >
        FLASH
      </text>
      <text
        x="200"
        y="110"
        fill="#ffffff"
        fontSize="48"
        fontWeight="800"
        fontFamily="Montserrat, Arial, sans-serif"
        textAnchor="middle"
      >
        SALE
      </text>
    </svg>
  );
}

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

  const preparedProducts = useMemo(() => {
    if (!products?.length) return [];
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const pool = [...shuffled];
    while (pool.length < TOTAL_PRODUCTS) {
      pool.push(...shuffled);
    }
    return pool.slice(0, TOTAL_PRODUCTS);
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
    { label: "Hour", value: timeLeft.hrs },
    { label: "Min", value: timeLeft.min },
    { label: "Sec", value: timeLeft.sec },
  ];

  return (
    <section className="py-8 md:py-12">
      <div className="rounded-lg border border-white/15 bg-[#02020a] p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <FlashSaleLogo className="h-28 w-auto max-w-[320px]" />
          <div className="flex items-center gap-3">
            {countdownItems.map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <div className="w-14 rounded-lg bg-white px-4 py-3 text-2xl font-semibold text-gray-900 shadow-inner">
                  {String(value).padStart(2, "0")}
                </div>
                <span className="mt-2 text-xs font-medium uppercase tracking-widest text-white/80">
                  {label}
                </span>
              </div>
            ))}
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
                    idx === currentSlide ? "bg-red-500" : "bg-white/30"
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
