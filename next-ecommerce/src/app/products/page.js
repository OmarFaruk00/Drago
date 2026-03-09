/**
 * Products page - Server fetches products so first load is fast (no long loading at bottom)
 */

import { Suspense } from "react";
import { getProducts } from "@/lib/services/productService";
import ProductsContentClient from "./ProductsContentClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const params = searchParams || {};
  const category = params.category || undefined;
  const search = params.search || undefined;
  const inStock = params.inStock === "true" || params.inStock === true ? true : undefined;
  const min = params.min || undefined;
  const max = params.max || undefined;
  const brand = params.brand || undefined;
  const color = params.color || undefined;
  const size = params.size || undefined;
  const initialProducts = await getProducts({
    category,
    search,
    inStock,
    min,
    max,
    brand,
    color,
    size,
  });

  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500">Loading...</div>}>
      <ProductsContentClient initialProducts={initialProducts} />
    </Suspense>
  );
}
