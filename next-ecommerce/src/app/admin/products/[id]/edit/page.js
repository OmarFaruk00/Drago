"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";

const DEFAULT_CATEGORIES = ["Electronics", "Fashion", "Sports", "Home", "Mobile", "Laptop", "Camera", "Accessories"];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "Electronics",
    image: "",
    specifications: [],
    warranty: "",
  });
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const specsSectionRef = useRef(null);

  useEffect(() => {
    fetch("/api/admin/categories", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map((c) => c.name).filter(Boolean));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const specs = data.specifications && typeof data.specifications === "object";
        const specsArr = specs
          ? Object.entries(data.specifications).map(([key, value]) => ({ key, value: String(value) }))
          : [];
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? "",
          stock: data.stock ?? data.stockQuantity ?? "",
          category: data.category || "Electronics",
          image: data.image || "",
          specifications: specsArr,
          warranty: data.warranty || "",
        });
      })
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#specification-warranty" && specsSectionRef.current) {
      specsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((f) => ({ ...f, image: data.url }));
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          description: form.description || "",
          price: parseFloat(form.price) || 0,
          stock: parseInt(form.stock, 10) ?? 0,
          category: form.category,
          image: form.image || "https://via.placeholder.com/400",
          specifications: (form.specifications || []).filter((s) => s.key && s.value).reduce((o, s) => ({ ...o, [String(s.key).trim()]: String(s.value).trim() }), {}),
          warranty: String(form.warranty || "").trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!form || !form.name) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/admin/products" className="mt-2 inline-block text-red-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload-edit"
              />
              <label
                htmlFor="image-upload-edit"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {uploading ? "Uploading..." : "Click to upload"}
                </span>
              </label>
              {form.image && (
                <div className="mt-4">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mx-auto max-h-40 rounded object-cover"
                  />
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    className="mt-2 w-full px-3 py-1.5 text-sm border rounded"
                    placeholder="Image URL"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div id="specification-warranty" ref={specsSectionRef} className="mt-8 space-y-6 scroll-mt-24 p-6 bg-gray-50/50 rounded-lg border border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Specification & Warranty</h2>
            <p className="text-sm text-gray-500 mb-4">Add or modify specifications (key-value) and warranty. Changes will appear on the product page.</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Add key-value pairs for product specs</span>
              <button type="button" onClick={addSpecification} className="inline-flex items-center gap-1 text-sm text-red-600 font-medium hover:underline">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {(form.specifications || []).map((s, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <input
                    type="text"
                    value={s.key}
                    onChange={(e) => updateSpecification(i, "key", e.target.value)}
                    placeholder="Key (e.g. Display Size)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={s.value}
                    onChange={(e) => updateSpecification(i, "value", e.target.value)}
                    placeholder="Value (e.g. 6.1 Inch)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button type="button" onClick={() => removeSpecification(i)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
            <textarea
              rows={3}
              value={form.warranty}
              onChange={(e) => setForm((f) => ({ ...f, warranty: e.target.value }))}
              placeholder="e.g. 1 year manufacturer warranty"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
