"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", image: "", status: "active" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/categories/${params.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setForm({
          name: data.name || "",
          image: data.image || "",
          status: data.status || "active",
        });
      })
      .catch(() => setForm(null))
      .finally(() => setLoading(false));
  }, [params.id]);

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
      if (res.ok && data.url) setForm((f) => ({ ...f, image: data.url }));
      else setError(data.error || "Upload failed");
    } catch {
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
      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
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
        <p className="text-gray-500">Category not found.</p>
        <Link href="/admin/categories" className="mt-2 inline-block text-red-600 hover:underline">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/categories" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" />
        Back to Categories
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" id="edit-cat-img" />
              <label htmlFor="edit-cat-img" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="text-sm text-gray-500">{uploading ? "Uploading..." : "Upload Image"}</span>
              </label>
              {form.image && (
                <div className="mt-4">
                  <img src={form.image} alt="Preview" className="mx-auto max-h-32 rounded object-cover" />
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    className="mt-2 w-full px-3 py-1.5 text-sm border rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50">
            {saving ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
