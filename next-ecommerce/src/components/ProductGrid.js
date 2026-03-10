"use client";

/**
 * ProductGrid - 4-col layout for listing
 * Mobile: always 2 cols (odd = last row 1 card). Tablet+: 3–4+ cols.
 */

import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], columns = 4, priorityCount = 0 }) {
  const gridCols = {
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  };

  // Mobile এ যেন প্রতি row তে 2টা card থাকে,
  // তাই total count বিজোড় হলে 1টা item কম দেখাই (শুধু grid view তে)
  const displayProducts =
    Array.isArray(products) && products.length > 0
      ? products.length % 2 === 1
        ? products.slice(0, -1)
        : products
      : [];

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-3`}>
      {displayProducts.map((product, i) => (
        <div key={product.id}>
          <ProductCard product={product} priority={i < priorityCount} />
        </div>
      ))}
    </div>
  );
}
