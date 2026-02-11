"use client";

/**
 * Home Page - Matches Figma design
 * Hero, Flash Sale, Categories, Top Products, Promo Banner, Explore Products, Testimonials
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { useLanguage } from "@/contexts/LanguageContext";
import CategorySection from "@/components/CategorySection";
import FlashSale from "@/components/FlashSale";
import ProductGrid from "@/components/ProductGrid";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import { categories } from "@/lib/data/categories";
import { testimonials } from "@/lib/data/testimonials";

export default function HomePage() {
  const { t } = useLanguage();
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
      <section className="max-w-6xl mx-auto mt-12 px-4 sm:px-6">
        <FlashSale products={flashProducts.length ? flashProducts : products} />
      </section>
      <section className="max-w-6xl mx-auto mt-8 px-4 sm:px-6">
        <CategorySection categories={categories} />
      </section>

      {/* Top Products */}
      <section className="max-w-6xl mx-auto mt-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.topProducts")}</h2>
          <Link href="/products" className="text-red-600 font-medium hover:underline">
            {t("home.viewAll")}
          </Link>
        </div>
        <div className="space-y-6">
          <ProductGrid products={products.slice(0, 6)} columns={6} />
          <ProductGrid products={products.slice(6, 12)} columns={6} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-4 sm:px-6">
        <PromoBanner />
      </section>

      {/* Explore Our Products */}
      <section className="max-w-6xl mx-auto mt-8 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.exploreProducts")}</h2>
          <Link href="/products" className="text-red-600 font-medium hover:underline">
            {t("home.viewAll")}
          </Link>
        </div>
        <ProductGrid products={products.length > 6 ? products.slice(6, 12) : []} columns={6} />
      </section>

      <section className="max-w-6xl mx-auto mt-8 mb-12 px-4 sm:px-6">
        <Testimonials testimonials={testimonials} />
      </section>
    </div>
  );
}
