"use client";

/**
 * ProductGrid - 4-col layout for listing (Dronado style)
 * Responsive: 2 cols mobile, 3 tablet, 4 desktop.
 * On mobile, when product count is odd, last card spans full width so no empty slot.
 */

import ProductCard from "./ProductCard";

export default function ProductGrid({ products, columns = 4, priorityCount = 0 }) {
  const gridCols = {
    3: "grid-cols-3 sm:grid-cols-3",
    4: "grid-cols-3 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  };
  const isLastAlone = columns >= 3 ? products.length % 3 === 1 : products.length % 2 === 1;

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-3`}>
      {products.map((product, i) => {
        const spanLast = isLastAlone && i === products.length - 1;
        return (
          <div
            key={product.id}
            className={spanLast ? "col-span-3 sm:col-span-1" : ""}
          >
            <ProductCard product={product} priority={i < priorityCount} />
          </div>
        );
      })}
    </div>
  );
}
