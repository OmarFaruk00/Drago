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

  // columns 5/6 = desktop 5–6 per row, সব দেখাই। columns 3/4 = mobile 2-col এ বিজোড় হলে last row তে 1টা থাকবে, তাই 1টা কমাই
  const needsEvenForMobile = (columns === 3 || columns === 4) && products.length % 2 === 1;
  const displayProducts =
    Array.isArray(products) && products.length > 0
      ? needsEvenForMobile
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
