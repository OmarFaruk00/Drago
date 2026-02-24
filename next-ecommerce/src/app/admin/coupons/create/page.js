"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tag, Percent, Truck, DollarSign, Check } from "lucide-react";

const COUPON_TYPES = [
  { id: "fixed", label: "Fixed Discount", icon: Tag },
  { id: "percentage", label: "Percentage Discount", icon: Percent },
  { id: "free_shipping", label: "Free Shipping", icon: Truck },
  { id: "price_discount", label: "Price Discount", icon: DollarSign },
];

export default function CreateCouponPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "fixed",
    discountValue: "",
    discountUnit: "amount",
    description: "",
    totalUsageLimit: "",
    usagePerCustomer: "",
    forSpecificCustomer: false,
    allowedForCustomerEmail: "",
    startDate: "",
    endDate: "",
  });

  function validate() {
    const e = {};
    if (!form.name?.trim()) e.name = "Coupon name is required";
    if (!form.code?.trim()) e.code = "Coupon code is required";
    if (form.type !== "free_shipping" && (!form.discountValue || Number(form.discountValue) < 0)) {
      e.discountValue = "Discount value must be 0 or greater";
    }
    if (form.type === "percentage" && Number(form.discountValue) > 100) {
      e.discountValue = "Percentage cannot exceed 100";
    }
    if (!form.startDate) e.startDate = "Start date is required";
    if (!form.endDate) e.endDate = "End date is required";
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      e.endDate = "End date must be after start date";
    }
    if (form.forSpecificCustomer && !form.allowedForCustomerEmail?.trim()) {
      e.allowedForCustomerEmail = "Customer email is required for customer-specific coupon";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: (form.name || form.code).trim(),
          code: form.code.trim().toUpperCase(),
          type: form.type,
          discountValue: form.type === "free_shipping" ? 0 : Number(form.discountValue),
          discountUnit: form.type === "percentage" ? "percent" : "amount",
          description: form.description?.trim() || "",
          totalUsageLimit: form.forSpecificCustomer ? 1 : (form.totalUsageLimit ? Number(form.totalUsageLimit) : null),
          usagePerCustomer: form.forSpecificCustomer ? 1 : (form.usagePerCustomer ? Number(form.usagePerCustomer) : null),
          allowedForCustomerEmail: form.forSpecificCustomer && form.allowedForCustomerEmail?.trim() ? form.allowedForCustomerEmail.trim().toLowerCase() : null,
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || "Failed to create coupon" });
        return;
      }
      router.push("/admin/coupons");
      router.refresh();
    } catch (err) {
      setErrors({ submit: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Create Coupon</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/coupons"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-50 text-brand rounded-lg text-sm">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 space-y-8">
          {/* Coupon Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand ${
                    errors.name ? "border-brand" : "border-gray-300"
                  }`}
                  placeholder="e.g. Summer Sale"
                />
                {errors.name && <p className="mt-1 text-sm text-brand">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand ${
                    errors.code ? "border-brand" : "border-gray-300"
                  }`}
                  placeholder="e.g. SAVE20"
                />
                {errors.code && <p className="mt-1 text-sm text-brand">{errors.code}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={form.type === "percentage" ? 100 : undefined}
                    step={form.type === "percentage" ? 1 : 0.01}
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    disabled={form.type === "free_shipping"}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand ${
                      errors.discountValue ? "border-brand" : "border-gray-300"
                    }`}
                    placeholder={form.type === "percentage" ? "10" : "10.00"}
                  />
                  {form.type !== "free_shipping" && (
                    <select
                      value={form.discountUnit}
                      onChange={(e) => setForm((f) => ({ ...f, discountUnit: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="amount">tk</option>
                      <option value="percent">%</option>
                    </select>
                  )}
                </div>
                {errors.discountValue && <p className="mt-1 text-sm text-brand">{errors.discountValue}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                placeholder="Optional description"
              />
            </div>
          </div>

          {/* Coupon Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COUPON_TYPES.map((t) => {
                const Icon = t.icon;
                const selected = form.type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        type: t.id,
                        discountUnit: t.id === "percentage" ? "percent" : "amount",
                      }))
                    }
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                      selected ? "border-brand bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {selected && (
                      <Check className="absolute top-2 right-2 w-5 h-5 text-brand" />
                    )}
                    <Icon className={`w-8 h-8 ${selected ? "text-brand" : "text-gray-400"}`} />
                    <span className="text-sm font-medium text-center">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Usage Limits */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Limits</h3>
            <div className="mb-4 p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.forSpecificCustomer}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    forSpecificCustomer: e.target.checked,
                    totalUsageLimit: e.target.checked ? "1" : f.totalUsageLimit,
                    usagePerCustomer: e.target.checked ? "1" : f.usagePerCustomer,
                    allowedForCustomerEmail: e.target.checked ? f.allowedForCustomerEmail : "",
                  }))}
                  className="rounded border-gray-300 text-brand"
                />
                <span className="font-medium text-gray-900">কাস্টমার স্পেসিফিক কুপন (শুধুমাত্র এই ইমেইল একবার ব্যবহার করতে পারবে)</span>
              </label>
              <p className="mt-1 text-sm text-gray-600">চেক করলে এই কোড শুধু নিচের ইমেইল একবারই ব্যবহার করতে পারবে। অন্যজন ব্যবহার করতে পারবে না।</p>
              {form.forSpecificCustomer && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    value={form.allowedForCustomerEmail}
                    onChange={(e) => setForm((f) => ({ ...f, allowedForCustomerEmail: e.target.value }))}
                    className={`w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand ${
                      errors.allowedForCustomerEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="customer@example.com"
                  />
                  {errors.allowedForCustomerEmail && <p className="mt-1 text-sm text-red-600">{errors.allowedForCustomerEmail}</p>}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total usage limit</label>
                <input
                  type="number"
                  min="0"
                  value={form.forSpecificCustomer ? "1" : form.totalUsageLimit}
                  onChange={(e) => setForm((f) => ({ ...f, totalUsageLimit: e.target.value }))}
                  disabled={form.forSpecificCustomer}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand disabled:bg-gray-100"
                  placeholder="Leave empty for unlimited"
                />
                {form.forSpecificCustomer && <p className="mt-1 text-xs text-gray-500">Customer-specific coupons are one-time use only.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limit per customer</label>
                <input
                  type="number"
                  min="0"
                  value={form.forSpecificCustomer ? "1" : form.usagePerCustomer}
                  onChange={(e) => setForm((f) => ({ ...f, usagePerCustomer: e.target.value }))}
                  disabled={form.forSpecificCustomer}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand disabled:bg-gray-100"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand ${
                    errors.startDate ? "border-brand" : "border-gray-300"
                  }`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-brand">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand ${
                    errors.endDate ? "border-brand" : "border-gray-300"
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-brand">{errors.endDate}</p>}
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Link href="/admin/coupons" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
