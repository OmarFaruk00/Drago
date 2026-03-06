"use client";

/**
 * HeroSection - Simple slider from admin banners (up to 6), fallback to default slides.
 * No arrow icons on mobile; user swipes with finger. Desktop: arrows on hover.
 */

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState, useRef } from "react";

const SWIPE_THRESHOLD = 50;

const DEFAULT_SLIDES = [
  { id: "d1", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop", title: "", subtitle: "", link: "", linkText: "" },
  { id: "d2", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=600&fit=crop", title: "", subtitle: "", link: "", linkText: "" },
  { id: "d3", image: "https://images.unsplash.com/photo-1505740106531-4243f3831c78?w=1200&h=600&fit=crop", title: "", subtitle: "", link: "", linkText: "" },
  { id: "d4", image: "https://images.unsplash.com/photo-1514996937319-344454492b37?w=1200&h=600&fit=crop", title: "", subtitle: "", link: "", linkText: "" },
  { id: "d5", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop", title: "", subtitle: "", link: "", linkText: "" },
  { id: "d6", image: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d4f?w=1200&h=600&fit=crop", title: "", subtitle: "", link: "", linkText: "" },
];

export default function HeroSection() {
  const { t } = useLanguage();
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goPrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((i) => (i + 1) % slides.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    if (diff > 0) goNext();
    else goPrev();
  };

  useEffect(() => {
    fetch("/api/banners?section=hero", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const withImage = data.filter((b) => b.image && b.image.trim());
          if (withImage.length > 0) {
            setSlides(
              withImage.slice(0, 6).map((b) => ({
              id: b.id || b._id,
              image: b.image || "",
              title: b.title || "",
              subtitle: b.subtitle || "",
              link: b.link || "",
              linkText: b.linkText || "",
              }))
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[index];
  if (!current || !current.image) return null;

  return (
    <section className="relative bg-white overflow-hidden pt-0">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-0 pb-3 sm:pb-4 md:pb-6">
        <div
          className="relative group min-h-[180px] sm:min-h-[260px] md:min-h-[320px] lg:min-h-[360px] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={current.image}
              alt={current.title || "Hero"}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16">
            {(current.title || current.subtitle) && (
              <>
                {current.title && (
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-1 sm:mb-2 tracking-tight leading-tight">
                    {current.title}
                  </h1>
                )}
                {current.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-4 sm:mb-6 drop-shadow max-w-md">
                    {current.subtitle}
                  </p>
                )}
              </>
            )}
            {!current.title && !current.subtitle && (
              <>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-1 sm:mb-2 tracking-tight leading-tight">
                  {t("home.hero.bigSale")}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-4 sm:mb-6 drop-shadow max-w-md">
                  {t("home.hero.updateStyle")}
                </p>
              </>
            )}
            <div>
              <Link href={current.link || "/products"}>
                <span className="inline-flex w-fit px-5 py-2.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3 text-sm sm:text-base bg-brand text-white font-semibold rounded-lg shadow-lg cursor-pointer">
                  {current.linkText || t("home.hero.cta")}
                </span>
              </Link>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrows - desktop only (hidden on mobile; user swipes) */}
          <button
            type="button"
            onClick={goPrev}
            className="hidden sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-3 w-9 h-9 rounded-full bg-black/35 text-white hover:bg-black/60 transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="hidden sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-3 w-9 h-9 rounded-full bg-black/35 text-white hover:bg-black/60 transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
