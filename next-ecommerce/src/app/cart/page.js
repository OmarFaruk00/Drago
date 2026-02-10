"use client";

/**
 * Cart Page - Display cart items, subtotal, proceed to checkout
 */

import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import CartItem from "@/components/CartItem";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CartPage() {
  const { cart } = useStore();
  const formatCurrency = useFormatCurrency();
  const { t } = useLanguage();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("cart.empty")}</h1>
        <p className="text-gray-600 mb-6">{t("cart.emptyHint")}</p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-orange-600"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("cart.title")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">{t("cart.orderSummary")}</h2>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>{t("cart.subtotal")} ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="border-t border-gray-200 my-4 pt-4">
              <div className="flex justify-between font-bold text-gray-900">
                <span>{t("cart.total")}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-3 bg-red-600 text-white text-center font-semibold rounded-lg hover:bg-orange-600 transition"
            >
              {t("cart.checkout")}
            </Link>
            <Link
              href="/products"
              className="block w-full py-2 mt-2 text-center text-red-600 hover:underline"
            >
              {t("cart.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
