"use client";

import { useEffect, useState } from "react";

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    workingDays: "",
    workingDaysFri: "",
  });

  useEffect(() => {
    fetch("/api/admin/pages/contact", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            address: data.address ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
            workingDays: data.workingDays ?? "",
            workingDaysFri: data.workingDaysFri ?? "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) alert("Contact Us page saved.");
      else alert((await res.json()).error || "Failed to save");
    } catch (err) {
      console.error(err);
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

  const inputCls = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contact Us Page</h1>
      <p className="text-sm text-gray-600">Edit the content shown on the public Contact Us page.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Contact Details</h2>
          <div>
            <label className={labelCls}>Address</label>
            <input type="text" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Working Days (e.g. Saturday - Thursday: 9:00 AM - 8:00 PM)</label>
            <input type="text" value={form.workingDays} onChange={(e) => setForm((f) => ({ ...f, workingDays: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Friday / Closed Text</label>
            <input type="text" value={form.workingDaysFri} onChange={(e) => setForm((f) => ({ ...f, workingDaysFri: e.target.value }))} className={inputCls} placeholder="Friday: Closed" />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Save Contact Us"}
          </button>
        </div>
      </form>
    </div>
  );
}
