"use client";

/**
 * ProductGrid - Dense marketplace grid (5-6 cols desktop)
 * Daraz-style compact layout, 200-240px cards
 */

import ProductCard from "./ProductCard";

export default function ProductGrid({ products, columns = 6 }) {
  // Dense: auto-fill for 5-6 cols, or fixed columns
  const isDense = columns >= 5;

  return (
    <div
      className={`grid gap-2 sm:gap-3 ${
        isDense
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
