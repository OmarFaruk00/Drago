"use client";

/**
 * Checkout Page - Places order to database
 * Fetches delivery charges and COD fee from MongoDB (admin settings)
 */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { filterCities, filterThanas } from "@/lib/data/bangladeshLocations";
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
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryArea, setDeliveryArea] = useState("inside"); // "inside" | "outside" - Inside Dhaka / Outside Dhaka
  const [deliverySettings, setDeliverySettings] = useState({
    deliveryInsideDhaka: 60,
    deliveryOutsideDhaka: 120,
    codPercentage: 1,
  });
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    thana: "",
    addressNote: "",
    country: "Bangladesh",
  });
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [thanaSuggestions, setThanaSuggestions] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showThanaDropdown, setShowThanaDropdown] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const cityRef = useRef(null);
  const thanaRef = useRef(null);

  useEffect(() => {
    fetch("/api/settings/delivery")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setDeliverySettings({
            deliveryInsideDhaka: data.deliveryInsideDhaka ?? 60,
            deliveryOutsideDhaka: data.deliveryOutsideDhaka ?? 120,
            codPercentage: data.codPercentage ?? 1,
          });
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryChargeBase = deliveryArea === "inside" ? deliverySettings.deliveryInsideDhaka : deliverySettings.deliveryOutsideDhaka;
  const deliveryCharge = appliedCoupon?.freeShipping ? 0 : deliveryChargeBase;
  const codFee = paymentMethod === "cod" ? Math.round((subtotal * deliverySettings.codPercentage) / 100) : 0;
  const discountAmount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryCharge + codFee);
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
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    if (name === "city") next.thana = "";
    setForm(next);
  };

  useEffect(() => {
    if (showCityDropdown) setCitySuggestions(filterCities(form.city));
  }, [form.city, showCityDropdown]);

  useEffect(() => {
    if (showThanaDropdown && form.city) setThanaSuggestions(filterThanas(form.city, form.thana));
  }, [form.city, form.thana, showThanaDropdown]);

  const selectCity = (c) => {
    setForm({ ...form, city: c, thana: "" });
    setShowCityDropdown(false);
  };
  const selectThana = (t) => {
    setForm({ ...form, thana: t });
    setShowThanaDropdown(false);
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      setCouponError("Enter a coupon code");
      return;
    }
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          customerEmail: form.email || "",
          subtotal,
        }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: code.toUpperCase(),
          name: data.name,
          discount: data.discount ?? 0,
          freeShipping: data.freeShipping ?? false,
        });
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message || "Invalid coupon");
      }
    } catch {
      setCouponError("Could not validate coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
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
      const shippingAddress = [form.address, form.addressNote, form.thana, form.city, form.country].filter(Boolean).join(", ");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerName: form.fullName,
          customerEmail: form.email || "",
          customerPhone: form.phone,
          items,
          total,
          shippingAddress,
          couponCode: appliedCoupon?.code || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to place order");
        return;
      }
      trackPurchase({
        value: total,
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
        {/* Shipping form - সিরিয়াল: 1.Full name 2.Mobile 3.Address 4.City 5.Thana(Optional) 6.Note 7.Inside/Outside Dhaka 8.Payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <div className="space-y-4">
            {/* 1. Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            {/* 2. Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="01XXXXXXXXX"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <input type="hidden" name="email" value={form.email} />
            {/* 3. Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                name="address"
                placeholder="House / Road / Area"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            {/* 4. City */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              />
              {showCityDropdown && citySuggestions.length > 0 && (
                <ul ref={cityRef} className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {citySuggestions.map((c) => (
                    <li key={c} onClick={() => selectCity(c)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* 5. Thana (Optional) */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Thana (Optional)</label>
              <input
                type="text"
                name="thana"
                placeholder="Thana"
                value={form.thana}
                onChange={handleChange}
                onFocus={() => form.city && setShowThanaDropdown(true)}
                onBlur={() => setTimeout(() => setShowThanaDropdown(false), 200)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              />
              {showThanaDropdown && thanaSuggestions.length > 0 && (
                <ul ref={thanaRef} className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {thanaSuggestions.map((t) => (
                    <li key={t} onClick={() => selectThana(t)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* 6. Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
              <textarea
                name="addressNote"
                placeholder="Additional note for delivery (e.g. landmark, floor)"
                value={form.addressNote}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand resize-none"
              />
            </div>
            {/* 7. Inside Dhaka / Outside Dhaka */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Area *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryArea"
                    checked={deliveryArea === "inside"}
                    onChange={() => setDeliveryArea("inside")}
                    className="text-brand"
                  />
                  <span>Inside Dhaka</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryArea"
                    checked={deliveryArea === "outside"}
                    onChange={() => setDeliveryArea("outside")}
                    className="text-brand"
                  />
                  <span>Outside Dhaka</span>
                </label>
              </div>
            </div>
            {/* 8. Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="text-brand"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="text-brand"
                  />
                  <span>Online Payment</span>
                </label>
              </div>
            </div>
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
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {appliedCoupon && appliedCoupon.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({appliedCoupon.name})</span>
                  <span>-{formatCurrency(appliedCoupon.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery ({deliveryArea === "inside" ? "Inside Dhaka" : "Outside Dhaka"}){appliedCoupon?.freeShipping && " (Free)"}</span>
                <span>{formatCurrency(deliveryCharge)}</span>
              </div>
              {paymentMethod === "cod" && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>COD Fee ({deliverySettings.codPercentage}%)</span>
                  <span>{formatCurrency(codFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-lg pt-2">
                <span>{t("cart.total")}</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            {/* Coupon */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-800 font-medium">{appliedCoupon.name} applied</span>
                  <button type="button" onClick={handleRemoveCoupon} className="text-sm text-green-700 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {couponError && <p className="mt-1 text-sm text-red-600">{couponError}</p>}
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
