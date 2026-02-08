"use client";

/**
 * Product Listing Page - Grid of products with filters
 * Uses API to fetch products (or direct import for now)
 */

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import ProductFilterSidebar from "@/components/ProductFilterSidebar";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      const category = searchParams.get("category");
      const search = searchParams.get("search");
      const inStock = searchParams.get("inStock");
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      if (inStock) params.set("inStock", inStock);
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [searchParams]);

  const search = searchParams.get("search");
  const category = searchParams.get("category");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {search ? `Search: "${search}"` : category ? category : "All Products"}
        </h1>
        <p className="text-gray-600 mt-1">
          {loading ? "Loading..." : `${products.length} products found`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <ProductFilterSidebar />

        {/* Product grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-xl">No products found.</p>
              <p className="mt-2">Try adjusting your filters.</p>
            </div>
          ) : (
            <ProductGrid products={products} columns={6} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
