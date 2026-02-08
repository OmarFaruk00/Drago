"use client";

/**
 * FlashSale - Countdown timer + product cards
 * Design: Red/black timer (DAYS, HRS, MIN, SEC), 3 products horizontal
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function FlashSale({ products }) {
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">FLASH SALE</h2>
          {/* Countdown timer - red/black style */}
          <div className="flex gap-2">
            {items.map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gray-900 text-white font-bold text-lg rounded">
                  {String(value).padStart(2, "0")}
                </div>
                <span className="text-xs text-gray-500 mt-1">{label}</span>
              </div>
            ))}
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
