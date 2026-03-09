"use client";

/**
 * ProductFilterSidebar - Dronado-style sticky filter
 * All Categories from API (admin), Price, Color, Size, Rating, Brand, Top Selling
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useMemo } from "react";
import SafeProductImage from "@/components/SafeProductImage";
import Link from "next/link";
import { colors } from "@/lib/data/sidebarCategories";

export default function ProductFilterSidebar({ products = [], isOpen, onClose }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [expandedCats, setExpandedCats] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const sidebarCategories = useMemo(() => {
    const main = categories.filter((c) => !c.parentId);
    const byParent = {};
    categories.forEach((c) => {
      const pid = c.parentId?.toString?.() || c.parentId;
      if (pid) {
        if (!byParent[pid]) byParent[pid] = [];
        byParent[pid].push(c);
      }
    });
    return main.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug || m.name,
      count: products.filter((p) => p.category === m.name).length,
      children: (byParent[m.id] || []).map((s) => ({
        name: s.name,
        slug: s.name,
        count: products.filter((p) => p.category === s.name).length,
      })),
    }));
  }, [categories, products]);
  const [priceMin, setPriceMin] = useState(searchParams.get("min") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("max") || "");
  const [priceRange, setPriceRange] = useState(500);

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentColor = searchParams.get("color") || "";
  const currentSize = searchParams.get("size") || "";

  const distinctBrands = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.brand && typeof p.brand === "string") {
        const b = p.brand.trim();
        if (b) set.add(b);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const distinctSizes = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (Array.isArray(p.sizeVariants)) {
        p.sizeVariants.forEach((v) => {
          if (v?.size) {
            const s = String(v.size).trim();
            if (s) set.add(s);
          }
        });
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [products]);

  const toggleCategory = (id) => {
    setExpandedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const updateParams = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
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
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const topSelling = products.slice(0, 4);

  const sidebarContent = (
    <div className="space-y-6">
      {/* All Products - link to products page (clears filters) */}
      <Link
        href="/products"
        onClick={() => onClose?.()}
        className="block py-2 text-sm font-medium text-brand hover:text-brand-dark"
      >
        All Products
      </Link>
      {/* All Categories - from admin API, hierarchical */}
      {sidebarCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">All Categories</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {sidebarCategories.map((cat) => (
              <div key={cat.id} className="border-b border-gray-200 last:border-b-0">
                {cat.children?.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-400 text-xs">({cat.count})</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedCats.includes(cat.id) ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedCats.includes(cat.id) && (
                      <div className="bg-gray-50 py-1">
                        {cat.children.map((sub) => (
                          <button
                            key={sub.name}
                            onClick={() => {
                              updateParams("category", sub.slug);
                              onClose?.();
                            }}
                            className={`block w-full text-left px-4 py-1.5 text-xs ${currentCategory === sub.slug ? "text-brand font-medium" : "text-gray-600 hover:text-brand"}`}
                          >
                            {sub.name} ({sub.count})
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      updateParams("category", cat.slug || cat.name);
                      onClose?.();
                    }}
                    className={`block w-full text-left px-3 py-2.5 text-sm ${currentCategory === (cat.slug || cat.name) ? "text-brand font-medium bg-brand/5" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter by Price */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Filter by Price</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-1.5 rounded bg-gray-200 appearance-none cursor-pointer accent-brand"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min (tk)"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
            />
            <input
              type="number"
              placeholder="Max (tk)"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
            />
          </div>
          <p className="text-xs text-gray-500">Range: {priceMin || 0} - {priceMax || priceRange} tk</p>
          <button
            onClick={applyPriceFilter}
            className="w-full py-1.5 bg-brand text-white text-xs font-medium rounded hover:bg-brand-dark"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Filter by Color */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Filter by Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => updateParams("color", currentColor === c.name ? "" : c.name)}
              className={`w-7 h-7 rounded-full border-2 transition ${
                currentColor === c.name ? "border-brand ring-1 ring-brand" : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Filter by Size */}
      {distinctSizes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Filter by Size</h4>
          <div className="flex flex-wrap gap-1">
            {distinctSizes.map((s) => (
              <button
                key={s}
                onClick={() => updateParams("size", currentSize === s ? "" : s)}
                className={`px-2.5 py-1 text-xs border rounded ${currentSize === s ? "border-brand bg-brand/10 text-brand" : "border-gray-300 hover:border-gray-400"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter by Brand */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Filter by Brand</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {distinctBrands.map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer py-0.5">
              <input
                type="checkbox"
                checked={currentBrand === b}
                onChange={() => updateParams("brand", currentBrand === b ? "" : b)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-xs text-gray-700">{b}</span>
            </label>
          ))}
          {distinctBrands.length === 0 && (
            <p className="text-xs text-gray-500">No brands yet. Add brands on products from admin.</p>
          )}
        </div>
      </div>

      {/* Top Selling Products */}
      {topSelling.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Selling Products</h4>
          <div className="space-y-2">
            {topSelling.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                onClick={onClose}
                className="flex gap-2 p-2 rounded border border-gray-100 hover:border-red-200 group"
              >
                <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <SafeProductImage src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-800 line-clamp-2 group-hover:text-brand">{p.name}</p>
                  <p className="text-xs font-bold text-brand mt-0.5">{Number(p.price).toLocaleString()} tk</p>
                  <span className="text-amber-500 text-[10px]">★ {p.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop - Sticky sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-lg border border-gray-200 p-4">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile - Drawer overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
          <h3 className="font-semibold">Filters</h3>
          <button onClick={onClose} className="p-2 -m-2 text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">{sidebarContent}</div>
      </div>
    </>
  );
}
