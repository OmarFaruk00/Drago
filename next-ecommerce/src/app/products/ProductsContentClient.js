"use client";

/**
 * Product listing UI - receives initialProducts from server for fast first paint
 */

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import ProductFilterSidebar from "@/components/ProductFilterSidebar";

const PER_PAGE = 12;

export default function ProductsContentClient({ initialProducts = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initialLoadDone = useRef(false);

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const params = new URLSearchParams();
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const inStock = searchParams.get("inStock");
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (inStock) params.set("inStock", inStock);
    if (min) params.set("min", min);
    if (max) params.set("max", max);

    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      if (initialProducts.length > 0) return;
    }
    fetchProducts();
  }, [searchParams]);

  const search = searchParams.get("search");
  const category = searchParams.get("category");

  const total = products.length;
  const totalPages = Math.ceil(total / PER_PAGE) || 1;
  const start = (page - 1) * PER_PAGE;
  const end = Math.min(start + PER_PAGE, total);
  const paginatedProducts = products.slice(start, end);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex-wrap items-center justify-between gap-3 mb-4 flex">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All Categories
            </button>
            <p className="text-sm text-gray-600">
              {loading ? "Loading..." : `Showing ${total > 0 ? start + 1 : 0}–${end} of ${total} results`}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700">
              <option>Sort by: Default sorting</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
            <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
              <button className="p-2 bg-white text-gray-600 border-r border-gray-300" title="Grid view">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button className="p-2 bg-gray-100 text-gray-400" title="List view">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <ProductFilterSidebar
            products={products}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-72 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-lg text-gray-600">No products found.</p>
                  <p className="mt-2 text-sm text-gray-500">Try adjusting your filters.</p>
                </div>
              ) : (
                <>
                  <ProductGrid products={paginatedProducts} columns={4} />
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set("page", String(Math.max(1, page - 1)));
                            router.push(`/products?${params.toString()}`);
                          }}
                          disabled={page <= 1}
                          className="px-3 py-1.5 text-sm border rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const p = i + 1;
                          return (
                            <button
                              key={p}
                              onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set("page", String(p));
                                router.push(`/products?${params.toString()}`);
                              }}
                              className={`w-9 h-9 text-sm border ${page === p ? "bg-brand border-brand text-white" : "hover:bg-gray-50"}`}
                            >
                              {p}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set("page", String(Math.min(totalPages, page + 1)));
                            router.push(`/products?${params.toString()}`);
                          }}
                          disabled={page >= totalPages}
                          className="px-3 py-1.5 text-sm border rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
