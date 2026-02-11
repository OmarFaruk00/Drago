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
import { shuffleArray } from "@/lib/utils/shuffle";

export default function HomePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [shuffledProducts, setShuffledProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (products.length) {
      setShuffledProducts(shuffleArray(products));
    }
  }, [products]);

  const productPool = shuffledProducts.length ? shuffledProducts : products;

  const buildSegment = (start, count) => {
    if (!productPool.length) return [];
    const segment = [];
    for (let i = 0; i < count; i += 1) {
      const index = (start + i) % productPool.length;
      segment.push(productPool[index]);
    }
    return segment;
  };

  const topProductsSegment = buildSegment(0, 12);
  const exploreProductsSegment = buildSegment(12, 12);

  const topRowOne = topProductsSegment.slice(0, 6);
  const topRowTwo = topProductsSegment.slice(6, 12);
  const exploreRowOne = exploreProductsSegment.slice(0, 6);
  const exploreRowTwo = exploreProductsSegment.slice(6, 12);

  return (
    <div>
      <HeroSection />
      <section className="max-w-6xl mx-auto -mt-2 px-4 sm:px-6">
        <FlashSale products={productPool} />
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
          <ProductGrid products={topRowOne} columns={6} />
          <ProductGrid products={topRowTwo} columns={6} />
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
        <div className="space-y-6">
          <ProductGrid products={exploreRowOne} columns={6} />
          <ProductGrid products={exploreRowTwo} columns={6} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-8 mb-12 px-4 sm:px-6">
        <Testimonials testimonials={testimonials} />
      </section>
    </div>
  );
}
