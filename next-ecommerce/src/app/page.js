"use client";

/**
 * Home Page - Matches Figma design
 * Hero, Flash Sale, Categories, Top Products, Promo Banner, Explore Products, Testimonials
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FlashSale from "@/components/FlashSale";
import ProductGrid from "@/components/ProductGrid";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import { categories } from "@/lib/data/categories";
import { testimonials } from "@/lib/data/testimonials";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  // Flash sale: power bank, headphones, speaker (first 3 electronics or manual pick)
  const flashProducts = products.filter((p) =>
    ["5", "1", "12"].includes(p.id)
  ).length
    ? products.filter((p) => ["5", "1", "12"].includes(p.id))
    : products.slice(0, 3);

  return (
    <div>
      <HeroSection />
      <FlashSale products={flashProducts.length ? flashProducts : products} />
      <CategorySection categories={categories} />

      {/* Top Products */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Products</h2>
            <Link href="/products" className="text-red-600 font-medium hover:underline">
              View All →
            </Link>
          </div>
          <ProductGrid products={products.slice(0, 6)} columns={6} />
        </div>
      </section>

      <PromoBanner />

      {/* Explore Our Products */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Explore Our Products</h2>
            <Link href="/products" className="text-red-600 font-medium hover:underline">
              View All →
            </Link>
          </div>
          <ProductGrid products={products.length > 6 ? products.slice(6, 12) : []} columns={6} />
        </div>
      </section>

      <Testimonials testimonials={testimonials} />
    </div>
  );
}
