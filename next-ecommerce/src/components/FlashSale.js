"use client";

/**
 * FlashSale - Purple gradient banner with FLASH SALE + LIMITED OFFER
 * Lightning theme, countdown timer, product cards
 */

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

function LightningIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export default function FlashSale({ products }) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: 2, hrs: 6, min: 1, sec: 29 });

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

  const items = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HRS", value: timeLeft.hrs },
    { label: "MIN", value: timeLeft.min },
    { label: "SEC", value: timeLeft.sec },
  ];

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flash Sale Banner - Purple gradient, lightning style */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-purple-800 p-6 md:p-8 mb-6 border-2 border-purple-900/30">
          {/* Dotted pattern overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }} />
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* FLASH SALE text block */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-4 py-1 bg-red-500 text-white font-bold text-sm tracking-wider shadow-lg border-l-2 border-t-2 border-white/30">
                  FLASH
                </span>
                <LightningIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <LightningIcon className="w-8 h-8 text-amber-400 -ml-1 hidden sm:block" />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-amber-400 tracking-tight drop-shadow-lg">
                  SALE
                </h2>
                <LightningIcon className="w-6 h-6 text-amber-400" />
              </div>
              <p className="mt-2 text-white font-semibold text-sm tracking-widest uppercase">
                {t("home.limitedOffer")}
              </p>
            </div>

            {/* Countdown timer */}
            <div className="flex gap-2">
              {items.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black/40 text-white font-bold text-lg rounded-lg border border-white/20">
                    {String(value).padStart(2, "0")}
                  </div>
                  <span className="text-xs text-white/90 mt-1 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 3 Product cards horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
