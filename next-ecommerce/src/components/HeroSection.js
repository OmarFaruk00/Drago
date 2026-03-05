"use client";

/**
 * HeroSection - Slider with 6 hero banners
 */

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&h=600&fit=crop",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1505740106531-4243f3831c78?w=1200&h=600&fit=crop",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?w=1200&h=600&fit=crop",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1522204523234-8729aa6e3d4f?w=1200&h=600&fit=crop",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = slides[index];

  return (
    <section className="relative bg-white overflow-hidden pt-0">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-0 pb-3 sm:pb-4 md:pb-6">
        <div className="relative min-h-[180px] sm:min-h-[260px] md:min-h-[320px] lg:min-h-[360px] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Background image */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={current.image}
                  alt="Big Sale"
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </motion.div>
              {/* Gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              {/* Content */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16"
                variants={container}
                initial="hidden"
                animate="visible"
              >
                <motion.p
                  variants={itemUp}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs text-white/90 mb-2 backdrop-blur"
                >
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t("home.hero.badge") ?? "LIMITED TIME OFFER"}
                </motion.p>
                <motion.h1
                  variants={itemUp}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-1 sm:mb-2 tracking-tight leading-tight"
                >
                  {t("home.hero.bigSale")}
                </motion.h1>
                <motion.p
                  variants={itemUp}
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-4 sm:mb-6 drop-shadow max-w-md"
                >
                  {t("home.hero.updateStyle")}
                </motion.p>
                <motion.div variants={itemUp}>
                  <Link href="/products">
                    <motion.span
                      className="inline-flex w-fit px-5 py-2.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3 text-sm sm:text-base bg-brand text-white font-semibold rounded-lg shadow-lg cursor-pointer"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 40px -12px rgba(220, 38, 38, 0.5)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {t("home.hero.cta")}
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Floating accent */}
          <motion.div
            className="absolute bottom-2 right-4 sm:bottom-4 sm:right-8 md:right-16 w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm"
            animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

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
        </div>
      </div>
    </section>
  );
}
