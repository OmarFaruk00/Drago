"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    image: "",
    status: "active",
  });
  const [uploading, setUploading] = useState(false);

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
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save category");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-brand rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="e.g. Electronics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="cat-image-upload"
              />
              <label
                htmlFor="cat-image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {uploading ? "Uploading..." : "Upload Image or Drag & Drop"}
                </span>
                <span className="text-xs text-gray-400">PNG, JPG, WEBP</span>
              </label>
              {form.image && (
                <div className="mt-4">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mx-auto max-h-32 rounded object-cover"
                  />
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    className="mt-2 w-full px-3 py-1.5 text-sm border rounded"
                    placeholder="Or paste image URL (https://... or /uploads/...)"
                  />
                </div>
              )}
            </div>
            {!form.image && (
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Or paste image URL (https://... or /uploads/...)"
              />
            )}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
