"use client";

/**
 * Home Page - Hero, Flash Sale, Categories, Top Products, Promo, Explore, Testimonials
 * Below-fold sections lazy-loaded for faster initial load.
 */

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { categories } from "@/lib/data/categories";
import { testimonials as dummyTestimonials } from "@/lib/data/testimonials";
import { products as staticProducts } from "@/lib/data/products";
import { shuffleArray } from "@/lib/utils/shuffle";

const FlashSale = dynamic(() => import("@/components/FlashSale"), { loading: () => <div className="min-h-[200px] rounded-xl bg-gray-100 animate-pulse" /> });
const CategorySection = dynamic(() => import("@/components/CategorySection"), { loading: () => <div className="min-h-[120px] rounded-lg bg-gray-100 animate-pulse" /> });
const ProductGrid = dynamic(() => import("@/components/ProductGrid"), { loading: () => <div className="min-h-[280px] rounded-lg bg-gray-100 animate-pulse" /> });
const AfterTopProductsBanner = dynamic(() => import("@/components/AfterTopProductsBanner"), { loading: () => <div className="min-h-[100px] rounded-xl bg-gray-100 animate-pulse" /> });
const PromoBanner = dynamic(() => import("@/components/PromoBanner"), { loading: () => <div className="min-h-[140px] rounded-xl bg-gray-100 animate-pulse" /> });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { loading: () => <div className="min-h-[180px] rounded-xl bg-gray-100 animate-pulse" /> });

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
  const [sectionProducts, setSectionProducts] = useState({ topProducts: [] });
  const [testimonials, setTestimonials] = useState(dummyTestimonials);

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
        if (Array.isArray(data.topProducts)) {
          setSectionProducts({ topProducts: data.topProducts });
        }
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, [useDummyProducts]);

  useEffect(() => {
    let isActive = true;
    const tId = setTimeout(() => {
      fetch("/api/testimonials")
        .then((res) => res.json())
        .then((data) => {
          if (!isActive) return;
          if (Array.isArray(data) && data.length > 0) setTestimonials(data);
        })
        .catch(() => {});
    }, 400);
    return () => {
      isActive = false;
      clearTimeout(tId);
    };
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

  const useSectionData = !useDummyProducts && sectionProducts.topProducts.length > 0;
  const topProductsSegment = useSectionData
    ? sectionProducts.topProducts.slice(0, 10)
    : buildSegment(0, 10);
  const topIdsForExplore = topProductsSegment.map((p) => p.id);
  const exploreRows = useMemo(() => {
    const exclude = new Set(topIdsForExplore);
    const pool = productPool.filter((p) => !exclude.has(p.id));
    const shuffled = shuffleArray([...pool]);
    const segment = shuffled.slice(0, 30);
    return {
      row1: segment.slice(0, 6),
      row2: segment.slice(6, 12),
      row3: segment.slice(12, 18),
      row4: segment.slice(18, 24),
      row5: segment.slice(24, 30),
    };
  }, [productPool, topIdsForExplore.join(",")]);

  const topRowOne = topProductsSegment.slice(0, 5);
  const topRowTwo = topProductsSegment.slice(5, 10);

  return (
    <div>
      <HeroSection />
      <section className="max-w-6xl mx-auto mt-3 sm:mt-4 px-3 sm:px-4 md:px-6">
        <FlashSale />
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
            <ProductGrid products={topRowOne} columns={5} priorityCount={5} />
            <ProductGrid products={topRowTwo} columns={5} priorityCount={0} />
          </div>
        </div>
      </section>

      <AfterTopProductsBanner />

      <section className="max-w-6xl mx-auto mt-4 px-4 sm:px-6">
        <PromoBanner />
      </section>

      {/* Explore Our Products - 5 rows × 6, shuffled from all products */}
      <section className="max-w-6xl mx-auto mt-4 px-4 sm:px-6 py-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("home.exploreProducts")}</h2>
            <Link href="/products" className="text-brand font-medium hover:underline">
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="space-y-6">
            <ProductGrid products={exploreRows.row1} columns={6} priorityCount={0} />
            <ProductGrid products={exploreRows.row2} columns={6} priorityCount={0} />
            <ProductGrid products={exploreRows.row3} columns={6} priorityCount={0} />
            <ProductGrid products={exploreRows.row4} columns={6} priorityCount={0} />
            <ProductGrid products={exploreRows.row5} columns={6} priorityCount={0} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-4 mb-12 px-4 sm:px-6">
        <Testimonials testimonials={testimonials} />
      </section>
    </div>
  );
}
