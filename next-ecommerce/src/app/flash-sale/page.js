"use client";

/**
 * Flash Sale - Dedicated page. Shows only when admin has set an active flash sale (time + products).
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import { useFlashSaleCountdown } from "@/lib/utils/useFlashSaleCountdown";

export default function FlashSalePage() {
  const [flashData, setFlashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const timeLeft = useFlashSaleCountdown(flashData?.endTime ?? null);

  const countdownItems = [
    { label: "Day", value: timeLeft.days },
    { label: "Hour", value: timeLeft.hrs },
    { label: "Min", value: timeLeft.min },
    { label: "Sec", value: timeLeft.sec },
  ];

  const expired = timeLeft.days === 0 && timeLeft.hrs === 0 && timeLeft.min === 0 && timeLeft.sec === 0;

  useEffect(() => {
    fetch("/api/flash-sale")
      .then((res) => res.json())
      .then((data) => {
        if (data.active && Array.isArray(data.products)) {
          setFlashData({ products: data.products, endTime: data.endTime });
        } else {
          setFlashData(null);
        }
      })
      .catch(() => setFlashData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-brand transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Flash Sale</h1>
              <p className="text-gray-600">
                Limited time offers – grab the best deals before they&apos;re gone!
              </p>
            </div>
            {/* Same countdown timer as home page */}
            {!expired && flashData && (
              <div className="flex items-center gap-4">
                {countdownItems.map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1">
                    <span className="text-xs font-normal uppercase tracking-widest text-gray-500">
                      {label}
                    </span>
                    <div className="w-12 sm:w-14 rounded-lg bg-gray-900 px-2 sm:px-4 py-2 sm:py-3 text-xl sm:text-2xl font-bold text-white tabular-nums">
                      {String(value).padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : !flashData || !flashData.products.length || expired ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">No flash sale at the moment. Check back later or browse all products.</p>
              <Link href="/products" className="mt-4 inline-block text-brand font-medium hover:underline">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {flashData.products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="flash"
                  priority={i < 6}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
