"use client";

/**
 * ProductCard - Compact Daraz-style marketplace card
 * 220-260px width, 180px image, tight spacing, dense UI
 */

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function ProductCard({ product }) {
  const addToCart = useStore((s) => s.addToCart);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      1
    );
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded border border-gray-100 overflow-hidden w-full hover:shadow-md hover:scale-[1.02] transition-all duration-200"
    >
      {/* Image - fixed 180px height */}
      <div className="relative h-[180px] bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">Out of Stock</span>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Content - tight padding */}
      <div className="p-2">
        <h3 className="text-[11px] leading-tight text-gray-800 line-clamp-2 min-h-[28px] group-hover:text-red-600">
          {product.name}
        </h3>
        {/* Rating - minimal */}
        <div className="flex items-center gap-0.5 mt-1">
          <span className="text-amber-500 text-[10px]">★</span>
          <span className="text-[10px] text-gray-600">{product.rating}</span>
          <span className="text-[9px] text-gray-400">({product.reviewCount})</span>
        </div>
        {/* Price */}
        <div className="mt-1 flex items-baseline gap-1 flex-wrap">
          <span className="text-sm font-bold text-red-600">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
        {/* Add to Cart - compact */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="mt-1.5 w-full py-1.5 bg-red-600 text-white text-[11px] font-medium rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
