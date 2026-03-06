"use client";

/**
 * All Categories page - Grid of categories from admin (API). No dummy data.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const mainCategories = categories.filter((c) => !c.parentId);

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("nav.products")}</h1>
          <p className="mt-1 text-gray-600">
            {mainCategories.length} categories — choose one to browse products
          </p>
        </div>
        {mainCategories.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No categories yet. Add categories from admin.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 lg:gap-5">
            {mainCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition w-full border border-gray-100"
              >
                <div className="aspect-square w-full relative bg-gray-50 overflow-hidden">
                  <Image
                    src={cat.image || `https://via.placeholder.com/96?text=${(cat.name || "").slice(0, 1)}`}
                    alt={cat.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 160px"
                  />
                </div>
                <span className="py-3 px-2 text-sm font-medium text-gray-900 text-center group-hover:text-brand line-clamp-2 leading-tight w-full">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
          >
            View all products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
