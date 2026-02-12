"use client";

/**
 * Wishlist - Product cards with Add to Cart
 */

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { useLanguage } from "@/contexts/LanguageContext";
import { wishlistItems } from "@/lib/data/dashboard";

export default function WishlistPage() {
  const addToCart = useStore((s) => s.addToCart);
  const formatCurrency = useFormatCurrency();
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("dashboard.wishlist")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 hover:shadow-md transition"
          >
            <Link href={`/products/${product.id}`} className="flex-shrink-0 w-20 h-20 relative rounded overflow-hidden bg-gray-100">
              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${product.id}`} className="font-medium text-gray-900 hover:text-brand line-clamp-2 text-sm">
                {product.name}
              </Link>
              <p className="text-sm font-bold text-brand mt-1">{formatCurrency(product.price)}</p>
              <button
                onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, 1)}
                className="mt-2 w-full py-1.5 bg-brand text-white text-xs font-medium rounded hover:bg-brand-dark"
              >
                {t("product.addToCart")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
