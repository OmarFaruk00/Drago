"use client";

/**
 * Checkout Page - Places order to database
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackLead, trackPurchase } from "@/lib/tracking/client";

export default function CheckoutPage() {
  const formatCurrency = useFormatCurrency();
  const { t } = useLanguage();
  const { cart, clearCart, user } = useStore();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    zip: "",
    country: "Bangladesh",
  });

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => {
    if (cart.length === 0 || placed) return;
    trackLead({
      value: subtotal,
      currency: "BDT",
      num_items: itemCount,
    });
  }, [cart.length, placed, subtotal, itemCount]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const cartSnapshot = cart.map((item) => ({ ...item }));

    try {
      const items = cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
      }));
      const shippingAddress = [form.address, form.city, form.zip, form.country].filter(Boolean).join(", ");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerName: form.fullName,
          customerEmail: form.email,
          items,
          total: subtotal,
          shippingAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to place order");
        return;
      }
      trackPurchase({
        value: subtotal,
        currency: "BDT",
        content_ids: cartSnapshot.map((item) => item.id),
        contents: cartSnapshot.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          item_price: item.price,
        })),
        num_items: cartSnapshot.reduce((sum, item) => sum + item.quantity, 0),
      });
      setPlaced(true);
      clearCart();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !placed) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("cart.empty")}</h1>
        <Link href="/products" className="text-brand hover:underline">
          {t("cart.addItems")}
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <h1 className="text-2xl font-bold text-green-800 mb-2">{t("checkout.orderSuccessTitle")}</h1>
            <p className="text-green-700 mb-6">{t("checkout.orderSuccessMsg")}</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
            >
              {t("cart.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("checkout.title")}</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={form.zip}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">{t("cart.orderSummary")}</h2>
            <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>{t("cart.total")}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            {error && <p className="text-sm text-brand mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-50 transition"
            >
              {loading ? "..." : t("checkout.placeOrder")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
