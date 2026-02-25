"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminBlogPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/admin/blog", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        else if (data?.error) setPosts([]);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    fetch(`/api/admin/blog/${id}`, { method: "DELETE", credentials: "include" })
      .then((r) => {
        if (r.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
        else alert("Failed to delete");
      })
      .catch(() => alert("Failed to delete"));
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-medium rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>
      <p className="text-sm text-gray-600">Manage blog posts shown on the public Blog page.</p>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No posts yet. <Link href="/admin/blog/new" className="text-brand hover:underline">Add one</Link>.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/blog/${p.id}/edit`} className="inline-flex items-center gap-1 text-sm text-brand hover:underline mr-3">
                      <Pencil className="w-4 h-4" /> Edit
                    </Link>
                    <button type="button" onClick={() => handleDelete(p.id, p.title)} className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
