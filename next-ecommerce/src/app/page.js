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
import { products as staticProducts } from "@/lib/data/products";
import { shuffleArray } from "@/lib/utils/shuffle";

const PRODUCT_CACHE_KEY = "drago.products.cache.v1";
const PRODUCT_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

const readCachedProducts = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PRODUCT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !Array.isArray(parsed.items) ||
      !parsed.timestamp ||
      Date.now() - parsed.timestamp > PRODUCT_CACHE_TTL
    ) {
      window.sessionStorage.removeItem(PRODUCT_CACHE_KEY);
      return null;
    }
    return parsed.items;
  } catch {
    return null;
  }
};

const writeCachedProducts = (items) => {
  if (typeof window === "undefined" || !Array.isArray(items) || !items.length)
    return;
  try {
    window.sessionStorage.setItem(
      PRODUCT_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), items })
    );
  } catch {
    // ignore quota errors
  }
};

export default function HomePage() {
  const { t } = useLanguage();
  const useDummyProducts =
    process.env.NEXT_PUBLIC_USE_DUMMY_PRODUCTS === "true";
  const [products, setProducts] = useState(staticProducts);
  const [shuffledProducts, setShuffledProducts] = useState(staticProducts);
  const [shuffledCategories, setShuffledCategories] = useState(categories);
  const [sectionProducts, setSectionProducts] = useState({
    topProducts: [],
    exploreProducts: [],
  });

  useEffect(() => {
    setShuffledCategories(shuffleArray([...categories]));
  }, []);

  useEffect(() => {
    if (useDummyProducts) return;
    const cached = readCachedProducts();
    if (cached?.length) setProducts(cached);
    let isActive = true;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!isActive) return;
        if (Array.isArray(data) && data.length) {
          setProducts(data);
          writeCachedProducts(data);
        } else {
          setProducts(staticProducts);
        }
      })
      .catch(() => {
        if (!isActive) return;
        setProducts(staticProducts);
      });
    return () => {
      isActive = false;
    };
  }, [useDummyProducts]);

  useEffect(() => {
    if (useDummyProducts) return;
    let isActive = true;
    fetch("/api/home/sections")
      .then((res) => res.json())
      .then((data) => {
        if (!isActive || !data) return;
        if (Array.isArray(data.topProducts) && Array.isArray(data.exploreProducts)) {
          setSectionProducts({
            topProducts: data.topProducts,
            exploreProducts: data.exploreProducts,
          });
        }
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, [useDummyProducts]);

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

  const useSectionData =
    !useDummyProducts &&
    (sectionProducts.topProducts.length > 0 || sectionProducts.exploreProducts.length > 0);
  const topProductsSegment = useSectionData
    ? sectionProducts.topProducts
    : buildSegment(0, 12);
  const exploreProductsSegment = useSectionData
    ? sectionProducts.exploreProducts
    : buildSegment(12, 12);

  const topRowOne = topProductsSegment.slice(0, 6);
  const topRowTwo = topProductsSegment.slice(6, 12);
  const exploreRowOne = exploreProductsSegment.slice(0, 6);
  const exploreRowTwo = exploreProductsSegment.slice(6, 12);

  return (
    <div>
      <HeroSection />
      <section className="max-w-6xl mx-auto mt-4 px-4 sm:px-6">
        <FlashSale products={productPool} />
      </section>

      {/* Categories - Top Products এর উপরে */}
      <section className="max-w-6xl mx-auto mt-4 px-4 sm:px-6 py-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <CategorySection categories={shuffledCategories} />
        </div>
      </section>

      {/* Top Products */}
      <section className="max-w-6xl mx-auto mt-4 px-4 sm:px-6 py-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("home.topProducts")}</h2>
            <Link href="/products" className="text-brand font-medium hover:underline">
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="space-y-6">
            <ProductGrid products={topRowOne} columns={6} priorityCount={6} />
            <ProductGrid products={topRowTwo} columns={6} priorityCount={0} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-4 px-4 sm:px-6">
        <PromoBanner />
      </section>

      {/* Explore Our Products */}
      <section className="max-w-6xl mx-auto mt-4 px-4 sm:px-6 py-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("home.exploreProducts")}</h2>
            <Link href="/products" className="text-brand font-medium hover:underline">
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="space-y-6">
            <ProductGrid products={exploreRowOne} columns={6} priorityCount={0} />
            <ProductGrid products={exploreRowTwo} columns={6} priorityCount={0} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-4 mb-12 px-4 sm:px-6">
        <Testimonials testimonials={testimonials} />
      </section>
    </div>
  );
}
