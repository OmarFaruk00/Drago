"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminBlogNewPage() {
  const router = useRouter();
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

  function updateSlugFromTitle() {
    const s = form.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, slug: s }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Post created.");
        router.push("/admin/blog");
      } else {
        alert(data.error || "Failed to create");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="text-gray-600 hover:text-brand">← Blog</Link>
        <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <label className={labelCls}>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            onBlur={updateSlugFromTitle}
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Slug (URL)</label>
          <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputCls} placeholder="my-post-title" />
        </div>
        <div>
          <label className={labelCls}>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Content</label>
          <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={8} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Image URL</label>
          <input type="url" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className={inputCls} />
        </div>
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
            {saving ? "Creating..." : "Create Post"}
          </button>
          <Link href="/admin/blog" className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
