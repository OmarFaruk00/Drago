"use client";

/**
 * Admin Delivery Settings - Configure delivery charges and COD fee
 */

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

export default function AdminDeliverySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    deliveryInsideDhaka: 60,
    deliveryOutsideDhaka: 120,
    codPercentage: 1,
  });

  useEffect(() => {
    fetch("/api/admin/settings/delivery", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setForm({
            deliveryInsideDhaka: data.deliveryInsideDhaka ?? 60,
            deliveryOutsideDhaka: data.deliveryOutsideDhaka ?? 120,
            codPercentage: data.codPercentage ?? 1,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings/delivery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          deliveryInsideDhaka: data.deliveryInsideDhaka ?? 60,
          deliveryOutsideDhaka: data.deliveryOutsideDhaka ?? 120,
          codPercentage: data.codPercentage ?? 1,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
          <Truck className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Settings</h1>
          <p className="text-sm text-gray-500">Configure delivery charges and COD fee. Changes apply immediately at checkout.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge - Inside Dhaka (৳)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.deliveryInsideDhaka}
              onChange={(e) => setForm((f) => ({ ...f, deliveryInsideDhaka: Number(e.target.value) || 0 }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge - Outside Dhaka (৳)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.deliveryOutsideDhaka}
              onChange={(e) => setForm((f) => ({ ...f, deliveryOutsideDhaka: Number(e.target.value) || 0 }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">COD Fee Percentage (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.codPercentage}
              onChange={(e) => setForm((f) => ({ ...f, codPercentage: Number(e.target.value) || 0 }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="1"
            />
            <p className="mt-1 text-xs text-gray-500">Percentage of order subtotal charged when customer pays Cash on Delivery (default 1%)</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">Settings saved. Checkout will use new values immediately.</span>
          )}
        </div>
      </form>
    </div>
  );
}
