"use client";

/**
 * ProductFilterSidebar - Filter by Categories, Price Range, Brands
 * Design: Left sidebar with expandable filter sections
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { getCategories } from "@/lib/data/products";

const brands = ["Samsung", "Apple", "Sony", "LG", "Xiaomi", "OnePlus"];

export default function ProductFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = getCategories();
  const [priceMin, setPriceMin] = useState(searchParams.get("min") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("max") || "");

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const inStockOnly = searchParams.get("inStock") === "true";

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (priceMin) params.set("min", priceMin);
    else params.delete("min");
    if (priceMax) params.set("max", priceMax);
    else params.delete("max");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
        <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
          <div className="space-y-1">
            <button
              onClick={() => updateParams("category", "")}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm ${!currentCategory ? "bg-red-100 text-red-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParams("category", cat)}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm ${currentCategory === cat ? "bg-red-100 text-red-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min (৳)"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <input
              type="number"
              placeholder="Max (৳)"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <button
            onClick={applyPriceFilter}
            className="mt-2 w-full py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Apply
          </button>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Brands</h4>
          <div className="space-y-1">
            <button
              onClick={() => updateParams("brand", "")}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm ${!currentBrand ? "bg-red-100 text-red-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
            >
              All
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => updateParams("brand", brand)}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm ${currentBrand === brand ? "bg-red-100 text-red-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* In stock only */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => updateParams("inStock", e.target.checked ? "true" : "")}
              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">In stock only</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
