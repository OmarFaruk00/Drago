"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  GripVertical,
} from "lucide-react";

function ProductChip({ product, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 group">
      <span className="text-gray-400"><GripVertical className="w-4 h-4" /></span>
      <span className="flex-1 text-sm font-medium text-gray-900 truncate">{product?.name ?? product?.id ?? "—"}</span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Move up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Move down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded hover:bg-red-100 text-red-600"
          aria-label="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminHomeSectionsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({
    topProductIds: [],
    exploreProductIds: [],
    exploreCount: 12,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/home-sections", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([prods, sect]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        if (sect && !sect.error) {
          setSettings({
            topProductIds: Array.isArray(sect.topProductIds) ? sect.topProductIds : [],
            exploreProductIds: Array.isArray(sect.exploreProductIds) ? sect.exploreProductIds : [],
            exploreCount: Math.max(0, Number(sect.exploreCount) ?? 12),
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const productMap = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const topProducts = settings.topProductIds.map((id) => productMap[id]).filter(Boolean);
  const exploreProducts = settings.exploreProductIds.map((id) => productMap[id]).filter(Boolean);
  const availableForTop = products.filter((p) => !settings.topProductIds.includes(p.id));
  const availableForExplore = products.filter((p) => !settings.exploreProductIds.includes(p.id));

  function addToTop(productId) {
    if (!productId || settings.topProductIds.includes(productId)) return;
    setSettings((s) => ({
      ...s,
      topProductIds: [...s.topProductIds, productId],
    }));
  }

  function addToExplore(productId) {
    if (!productId || settings.exploreProductIds.includes(productId)) return;
    setSettings((s) => ({
      ...s,
      exploreProductIds: [...s.exploreProductIds, productId],
    }));
  }

  function removeFromTop(productId) {
    setSettings((s) => ({
      ...s,
      topProductIds: s.topProductIds.filter((id) => id !== productId),
    }));
  }

  function removeFromExplore(productId) {
    setSettings((s) => ({
      ...s,
      exploreProductIds: s.exploreProductIds.filter((id) => id !== productId),
    }));
  }

  function moveInTop(index, dir) {
    const next = [...settings.topProductIds];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setSettings((s) => ({ ...s, topProductIds: next }));
  }

  function moveInExplore(index, dir) {
    const next = [...settings.exploreProductIds];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setSettings((s) => ({ ...s, exploreProductIds: next }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/home-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (res.ok) alert("Home sections saved.");
      else {
        const err = await res.json();
        alert(err.error || "Failed to save");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save");
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
      <h1 className="text-2xl font-bold text-gray-900">Home Sections</h1>
      <p className="text-sm text-gray-600">
        Choose which products appear in &quot;Top Products&quot; and &quot;Explore Our Products&quot; on the homepage. Order = display order.
      </p>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Top Products</h2>
            <p className="text-xs text-gray-500">These show in the &quot;Top Products&quot; block. Add and reorder below.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add product</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                value=""
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) addToTop(v);
                  e.target.value = "";
                }}
              >
                <option value="">Select a product…</option>
                {availableForTop.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {settings.topProductIds.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No products selected. Add from dropdown above.</p>
              ) : (
                settings.topProductIds.map((id, i) => (
                  <ProductChip
                    key={id}
                    product={productMap[id]}
                    onRemove={() => removeFromTop(id)}
                    onMoveUp={() => moveInTop(i, -1)}
                    onMoveDown={() => moveInTop(i, 1)}
                    canMoveUp={i > 0}
                    canMoveDown={i < settings.topProductIds.length - 1}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Explore Our Products</h2>
            <p className="text-xs text-gray-500">These show in &quot;Explore Our Products&quot;. If none selected, homepage shows up to the count below from the rest.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Explore count (when no list set)</label>
              <input
                type="number"
                min={0}
                value={settings.exploreCount}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    exploreCount: Math.max(0, parseInt(e.target.value, 10) || 0),
                  }))
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
              />
              <span className="ml-2 text-sm text-gray-500">products</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add product</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                value=""
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) addToExplore(v);
                  e.target.value = "";
                }}
              >
                <option value="">Select a product…</option>
                {availableForExplore.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {settings.exploreProductIds.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No products selected. Homepage will show up to {settings.exploreCount} from the rest.</p>
              ) : (
                settings.exploreProductIds.map((id, i) => (
                  <ProductChip
                    key={id}
                    product={productMap[id]}
                    onRemove={() => removeFromExplore(id)}
                    onMoveUp={() => moveInExplore(i, -1)}
                    onMoveDown={() => moveInExplore(i, 1)}
                    canMoveUp={i > 0}
                    canMoveDown={i < settings.exploreProductIds.length - 1}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Home Sections"}
          </button>
        </div>
      </form>
    </div>
  );
}
