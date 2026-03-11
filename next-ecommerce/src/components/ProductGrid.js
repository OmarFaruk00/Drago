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
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  };

  const list = Array.isArray(products) ? products : [];
  const isOdd = list.length % 2 === 1;
  const lastIndex = list.length - 1;

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-3`}>
      {list.map((product, i) => {
        const hideOnMobile = isOdd && i === lastIndex;
        return (
          <div key={product.id} className={hideOnMobile ? "hidden sm:block" : ""}>
          <ProductCard product={product} priority={i < priorityCount} />
          </div>
        );
      })}
    </div>
  );
}
