"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminImageUrlField from "@/components/admin/AdminImageUrlField";

export default function AdminBlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    author: "Drago",
    category: "General",
    published: true,
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/blog/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            title: data.title ?? "",
            slug: data.slug ?? "",
            excerpt: data.excerpt ?? "",
            content: data.content ?? "",
            image: data.image ?? "",
            author: data.author ?? "Drago",
            category: data.category ?? "General",
            published: data.published !== false,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Post updated.");
        router.push("/admin/blog");
      } else {
        alert((await res.json()).error || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="text-gray-600 hover:text-brand">← Blog</Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <label className={labelCls}>Title *</label>
          <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputCls} required />
        </div>
        <div>
          <label className={labelCls}>Slug (URL)</label>
          <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Content</label>
          <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={8} className={inputCls} />
        </div>
        <AdminImageUrlField
          label="Image (optional)"
          value={form.image}
          onChange={(v) => setForm((f) => ({ ...f, image: v }))}
          placeholder="Upload or paste image URL (optional)"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Author</label>
            <input type="text" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <input type="text" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputCls} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
          <label htmlFor="published" className="text-sm text-gray-700">Published</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Post"}
          </button>
          <Link href="/admin/blog" className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
