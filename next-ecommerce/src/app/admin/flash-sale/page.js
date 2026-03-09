"use client";

/**
 * Admin Flash Sale - Set start/end time and select products for flash sale.
 * When time ends, flash sale section is hidden on the site.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { Zap, Search, ZoomIn, ZoomOut } from "lucide-react";
import AdminImageUrlField from "@/components/admin/AdminImageUrlField";

export default function AdminFlashSalePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    productIds: [],
    bannerImage: "",
    bannerImageScale: 100,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/flash-sale", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/products", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([settings, productsData]) => {
        const list = Array.isArray(productsData) ? productsData : [];
        setProducts(list);
        setForm({
          startTime: settings.startTime ?? "",
          endTime: settings.endTime ?? "",
          productIds: Array.isArray(settings.productIds) ? settings.productIds : [],
          bannerImage: settings.bannerImage ?? "",
          bannerImageScale: Math.min(150, Math.max(50, Number(settings.bannerImageScale) || 100)),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleProduct = (id) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id) ? f.productIds.filter((x) => x !== id) : [...f.productIds, id],
    }));
  };

  const filteredProducts = products.filter(
    (p) => !search || (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/flash-sale", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          startTime: form.startTime || null,
          endTime: form.endTime || null,
          productIds: form.productIds,
          bannerImage: form.bannerImage || "",
          bannerImageScale: Math.min(150, Math.max(50, Number(form.bannerImageScale) || 100)),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm((f) => ({
          ...f,
          productIds: data.productIds ?? f.productIds,
          bannerImage: data.bannerImage ?? f.bannerImage,
          bannerImageScale: data.bannerImageScale ?? f.bannerImageScale,
        }));
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
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
          <Zap className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flash Sale</h1>
          <p className="text-sm text-gray-500">
            Set start and end time. Select products to show in the flash sale. When the end time passes, the flash sale section will be hidden on the site.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
          <h2 className="font-semibold text-gray-900 mb-2">Flash Sale Banner Logo (top right)</h2>
          <p className="text-sm text-gray-500 mb-4">Upload or paste URL. Use zoom to adjust size. Leave empty to hide.</p>
          <AdminImageUrlField
            value={form.bannerImage}
            onChange={(v) => setForm((f) => ({ ...f, bannerImage: v || "" }))}
            label="Banner Image"
            placeholder="Image URL or upload"
          />
          {form.bannerImage && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Zoom (50% - 150%)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, bannerImageScale: Math.max(50, (f.bannerImageScale || 100) - 10) }))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={form.bannerImageScale ?? 100}
                  onChange={(e) => setForm((f) => ({ ...f, bannerImageScale: Number(e.target.value) }))}
                  className="flex-1 h-2 rounded-full accent-brand"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, bannerImageScale: Math.min(150, (f.bannerImageScale || 100) + 10) }))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-sm font-medium text-gray-700 w-12">{form.bannerImageScale ?? 100}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-2">Select products for Flash Sale</h2>
          <p className="text-sm text-gray-500 mb-4">Only selected products will appear in the flash sale section when it is active.</p>
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">No products found.</p>
            ) : (
              filteredProducts.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.productIds.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className="rounded border-gray-300 text-brand"
                  />
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={p.image || "https://via.placeholder.com/40"}
                      alt=""
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized={p.image?.startsWith("data:")}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate flex-1">{p.name}</span>
                  <span className="text-sm text-gray-500">৳{p.price?.toLocaleString?.() ?? p.price}</span>
                </label>
              ))
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">{form.productIds.length} product(s) selected.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Flash Sale Settings"}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
