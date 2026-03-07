"use client";

/**
 * ProductCard - Daraz-style compact card with action icons
 * Wishlist, Compare, Quick View on hover; Add to cart
 */

import SafeProductImage from "@/components/SafeProductImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLACEHOLDER = "https://via.placeholder.com/400x400?text=No+Image";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/lib/store/useStore";

export default function ProductCard({ product, variant = "default", priority = false }) {
  const formatCurrency = useFormatCurrency();
  const { t } = useLanguage();
  const router = useRouter();
  const addToWishlist = useStore((s) => s.addToWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const wishlist = useStore((s) => s.wishlist);
  const isInWishlist = wishlist?.some((w) => w.id === product.id) ?? false;
  const [showActions, setShowActions] = useState(false);
  const ratingVal = Math.min(5, Math.max(0, Number(product.rating) || 0));
  const ratingText = ratingVal % 1 === 0 ? String(Math.round(ratingVal)) : ratingVal.toFixed(1);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const iconBtn = (onClick, title, d) => (
    <button
      key={title}
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e);
      }}
      className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow border border-gray-100 text-gray-600 hover:text-brand hover:border-brand/30 transition"
      title={title}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
      </svg>
    </button>
  );

  return (
    <div
      className="group block bg-white rounded-xl shadow-sm overflow-hidden w-full hover:shadow-md transition-all duration-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
      <div
        className={`relative bg-gray-50 overflow-hidden ${
          variant === "flash" ? "aspect-square w-full" : "h-[180px]"
        }`}
      >
        <SafeProductImage
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={`group-hover:scale-105 transition-transform duration-200 ${
            variant === "flash" ? "object-cover p-2" : "object-contain p-1"
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          placeholder={PLACEHOLDER}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">{t("product.outOfStock")}</span>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-1 left-1 bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
        {product.freeShipping && (
          <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            Free Shipping
          </span>
        )}
        {/* Wishlist - top right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isInWishlist) removeFromWishlist(product.id);
            else addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, inStock: product.inStock, freeShipping: !!product.freeShipping });
          }}
          className="absolute top-1 right-1 w-8 h-8 flex items-center justify-center rounded-full shadow border bg-white/90 text-gray-600 hover:text-brand hover:border-brand/30 transition z-10"
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className="w-4 h-4" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* Action icons - Quick View, visible on hover (desktop) or always (mobile) */}
        <div
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 transition-opacity ${
            showActions ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"
          }`}
        >
          {iconBtn(() => router.push(`/products/${product.id}`), t("product.quickView"), "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z")}
        </div>
      </div>

      </Link>
      {/* Content - tight padding */}
      <div className="p-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold leading-tight text-gray-800 line-clamp-2 min-h-[32px] group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-1 flex-wrap">
          <span className="text-base font-bold text-brand">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="flex items-center gap-0.5 text-amber-500">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-[10px] sm:text-xs font-medium text-gray-700">{ratingText}/5</span>
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500">
              ({product.reviewCount ?? 0})
            </span>
            <span className={`text-[10px] sm:text-xs shrink-0 font-medium ${product.inStock ? "text-green-600" : "text-gray-500"}`}>
              {product.inStock ? "Stock in" : "Stock out"}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/products/${product.id}`);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-200 hover:border-gray-300 transition shrink-0"
            aria-label="View product"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
