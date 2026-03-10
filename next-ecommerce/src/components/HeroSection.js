"use client";

/**
 * HeroSection - Slider from admin banners (up to 6).
 * Entire banner is clickable; no overlay text.
 */

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const SWIPE_THRESHOLD = 50;

export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
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
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[index];
  if (loading || slides.length === 0 || !current || !current.image) {
    return (
      <section className="relative bg-white overflow-hidden pt-0">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-0 pb-3 sm:pb-4 md:pb-6">
          <div className="relative min-h-[180px] sm:min-h-[260px] md:min-h-[320px] lg:min-h-[360px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
        </div>
      </section>
    );
  }

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
          {/* Clickable overlay - full banner */}
          <Link href={current.link || "/products"} className="absolute inset-0 block" aria-label={current.title || "Banner"}>
            <span className="sr-only">{current.title || "Banner"}</span>
          </Link>

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
