"use client";

/**
 * Flash Sale - Dedicated page showing only discounted/flash sale products
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import { useFlashSaleCountdown } from "@/lib/utils/useFlashSaleCountdown";

export default function FlashSalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const timeLeft = useFlashSaleCountdown();

  const countdownItems = [
    { label: "Day", value: timeLeft.days },
    { label: "Min", value: timeLeft.min },
    { label: "Hour", value: timeLeft.hrs },
    { label: "Sec", value: timeLeft.sec },
  ];

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        // Flash sale = products with discount (originalPrice > price)
        const flashProducts = list.filter(
          (p) => p.originalPrice != null && p.originalPrice > p.price
        );
        // If no discounted products, show all (fallback)
        setProducts(flashProducts.length > 0 ? flashProducts : list);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
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
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">No flash sale products at the moment.</p>
              <Link href="/products" className="mt-4 inline-block text-brand font-medium hover:underline">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map((product, i) => (
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
