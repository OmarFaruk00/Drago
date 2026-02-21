"use client";

/**
 * Flash Sale - Dedicated page showing only discounted/flash sale products
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";

export default function FlashSalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Flash Sale</h1>
          <p className="text-gray-600 mb-6">
            Limited time offers – grab the best deals before they&apos;re gone!
          </p>

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
