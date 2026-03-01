"use client";

/**
 * ProductGrid - 4-col layout for listing (Dronado style)
 * Responsive: 2 cols mobile, 3 tablet, 4 desktop
 */

import ProductCard from "./ProductCard";

export default function ProductGrid({ products, columns = 4, priorityCount = 0 }) {
  const gridCols = {
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-3`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < priorityCount} />
      ))}
    </div>
  );
}
