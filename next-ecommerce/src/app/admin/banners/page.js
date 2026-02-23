"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ImageIcon, Upload } from "lucide-react";
import DeleteSuccessModal from "@/components/admin/DeleteSuccessModal";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    linkText: "",
    order: 0,
    enabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function loadBanners() {
    return fetch("/api/admin/banners", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({
      title: "",
      subtitle: "",
      image: "",
      link: "",
      linkText: "",
      order: banners.length,
      enabled: true,
    });
    setModalOpen(true);
  }

  function openEdit(banner) {
    setEditing(banner);
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image || "",
      link: banner.link || "",
      linkText: banner.linkText || "",
      order: banner.order ?? 0,
      enabled: banner.enabled !== false,
    });
    setModalOpen(true);
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", credentials: "include", body: fd });
    const data = await res.json();
    if (res.ok && data.url) setForm((f) => ({ ...f, image: data.url }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.image?.trim()) return;
    setSaving(true);
    try {
      const url = editing ? `/api/admin/banners/${editing.id}` : "/api/admin/banners";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await loadBanners();
        setModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save banner");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setBanners((p) => p.filter((b) => b.id !== id));
        setConfirmDelete(null);
        setShowDeleteSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      <p className="text-sm text-gray-600">Manage homepage banners. Enable/disable and reorder banners.</p>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {banners.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No banners yet</p>
            <button
              onClick={openAdd}
              className="mt-4 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark"
            >
              Add first banner
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {banners.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="w-24 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={b.image || "https://via.placeholder.com/96x56?text=No+Image"}
                    alt={b.title || "Banner"}
                    width={96}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized={b.image?.startsWith("data:")}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{b.title || "Untitled"}</p>
                  <p className="text-sm text-gray-500 truncate">{b.subtitle || b.link || "—"}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    b.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {b.enabled ? "Enabled" : "Disabled"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(b)}
                    className="p-2 text-gray-500 hover:text-brand hover:bg-brand/5 rounded"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(b.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editing ? "Edit Banner" : "Add Banner"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="banner-upload" />
                    <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center gap-1">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload or paste URL below</span>
                    </label>
                    {form.image && (
                      <img src={form.image} alt="" className="mt-2 mx-auto max-h-24 rounded object-cover" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="Image URL"
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                    placeholder="Banner title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                    placeholder="Optional subtitle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                  <input
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                  <input
                    type="text"
                    value={form.linkText}
                    onChange={(e) => setForm((f) => ({ ...f, linkText: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                    placeholder="Shop Now"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={form.enabled}
                    onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="enabled" className="text-sm text-gray-700">Enabled</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editing ? "Update" : "Add Banner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DeleteSuccessModal isOpen={showDeleteSuccess} onClose={() => setShowDeleteSuccess(false)} />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-gray-900">Delete banner?</h3>
            <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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
