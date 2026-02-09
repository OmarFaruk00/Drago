"use client";

/**
 * ProductCard - Daraz-style compact card with action icons
 * Wishlist, Compare, Quick View on hover; Add to cart
 */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store/useStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function ProductCard({ product }) {
  const router = useRouter();
  const addToCart = useStore((s) => s.addToCart);
  const [showActions, setShowActions] = useState(false);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      1
    );
  };

  const iconBtn = (onClick, title, d) => (
    <button
      key={title}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e);
      }}
      className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow border border-gray-100 text-gray-600 hover:text-red-600 hover:border-red-200 transition"
      title={title}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
      </svg>
    </button>
  );

  return (
    <div
      className="group block bg-white rounded border border-gray-100 overflow-hidden w-full hover:shadow-md hover:border-red-100 transition-all duration-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image - fixed 180px height */}
      <Link href={`/products/${product.id}`} className="block">
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
        {/* Action icons - visible on hover (desktop) or always (mobile) */}
        <div
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 transition-opacity ${
            showActions ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"
          }`}
        >
          {iconBtn(null, "Wishlist", "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z")}
          {iconBtn(null, "Compare", "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4")}
          {iconBtn(() => router.push(`/products/${product.id}`), "Quick View", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z")}
        </div>
      </div>

      </Link>
      {/* Content - tight padding */}
      <div className="p-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[11px] leading-tight text-gray-800 line-clamp-2 min-h-[28px] group-hover:text-red-600">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-0.5 mt-1">
          <span className="text-amber-500 text-[10px]">★</span>
          <span className="text-[10px] text-gray-600">{product.rating}</span>
          <span className="text-[9px] text-gray-400">({product.reviewCount})</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1 flex-wrap">
          <span className="text-sm font-bold text-red-600">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="mt-1.5 w-full py-1.5 bg-red-600 text-white text-[11px] font-medium rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
