"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, FolderTree, Upload } from "lucide-react";
import CategoriesEmptyState from "@/components/admin/CategoriesEmptyState";
import DeleteSuccessModal from "@/components/admin/DeleteSuccessModal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", image: "", status: "active" });
  const [addSaving, setAddSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setConfirmDelete(null);
        setShowDeleteSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    setAddSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) => [...prev, data]);
        setAddModalOpen(false);
        setAddForm({ name: "", image: "", status: "active" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddSaving(false);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", credentials: "include", body: fd });
    const data = await res.json();
    if (res.ok && data.url) setAddForm((f) => ({ ...f, image: data.url }));
  }

  const filtered = categories.filter(
    (c) => !search || (c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        {categories.length > 0 && (
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition"
            >
              <Plus className="w-4 h-4" />
              Add New Category
            </button>
          </div>
        )}
      </div>

      {categories.length === 0 ? (
        <CategoriesEmptyState />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={cat.image || "https://via.placeholder.com/48?text=No+Image"}
                          alt={cat.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized={cat.image?.startsWith("data:")}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{cat.slug || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-brand hover:bg-brand/5 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(cat.id)}
                          className="p-1.5 text-gray-500 hover:text-brand hover:bg-brand/5 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-gray-500">No categories match your search.</p>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                    placeholder="e.g. Electronics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="cat-upload" />
                    <label htmlFor="cat-upload" className="cursor-pointer flex flex-col items-center gap-1">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload or paste URL</span>
                    </label>
                    {addForm.image && (
                      <img src={addForm.image} alt="" className="mt-2 mx-auto max-h-20 rounded object-cover" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={addForm.image}
                    onChange={(e) => setAddForm((f) => ({ ...f, image: e.target.value }))}
                    className="mt-1 w-full px-3 py-1.5 text-sm border rounded"
                    placeholder="Or paste image URL (e.g. https://... or /uploads/...)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addSaving}
                    className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
                  >
                    {addSaving ? "Saving..." : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DeleteSuccessModal isOpen={showDeleteSuccess} onClose={() => setShowDeleteSuccess(false)} />

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-gray-900">Delete Category?</h3>
            <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
