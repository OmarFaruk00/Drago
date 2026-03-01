"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminImageUrlField from "@/components/admin/AdminImageUrlField";

export default function AdminTestimonialsPage() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "Customer",
    avatar: "",
    text: "",
    rating: 5,
    order: 0,
    status: "active",
  });

  function loadTestimonials() {
    fetch("/api/admin/testimonials", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setList(Array.isArray(data) ? data : []);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  function resetForm() {
    setForm({ name: "", role: "Customer", avatar: "", text: "", rating: 5, order: 0, status: "active" });
    setEditId(null);
    setShowForm(false);
  }

  function openEdit(item) {
    setForm({
      name: item.name || "",
      role: item.role || "Customer",
      avatar: item.avatar || "",
      text: item.text || "",
      rating: item.rating ?? 5,
      order: item.order ?? 0,
      status: item.status || "active",
    });
    setEditId(item.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name?.trim() || !form.text?.trim()) {
      alert("Name and text are required");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/testimonials/${editId}` : "/api/admin/testimonials";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        loadTestimonials();
        resetForm();
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (err) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        loadTestimonials();
        resetForm();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      alert("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials (What Our Customers Say)</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark"
        >
          <Plus className="w-5 h-5" /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Testimonial" : "Add Testimonial"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Customer name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Customer"
              />
            </div>
            <AdminImageUrlField
              label="Avatar (optional)"
              value={form.avatar}
              onChange={(v) => setForm((f) => ({ ...f, avatar: v }))}
              placeholder="Upload or paste image URL (optional)"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text</label>
              <textarea
                rows={3}
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Customer review..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) || 5 }))}
                className="w-24 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-brand text-white rounded-lg font-medium disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          <p>No testimonials yet.</p>
          <p className="text-sm mt-2">Add testimonials to show real customer reviews on the home page.</p>
          <p className="text-sm">If MongoDB is not set up, the site will show dummy data.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {t.avatar ? (
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="w-full h-full object-cover" unoptimized={!t.avatar.startsWith("/")} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">{t.name?.[0]}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.role}</p>
                <p className="text-gray-700 mt-1">&quot;{t.text}&quot;</p>
                <div className="flex gap-0.5 mt-1 text-amber-500">
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(t)} className="p-2 text-gray-500 hover:text-brand">
                  <Pencil className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-gray-500 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
