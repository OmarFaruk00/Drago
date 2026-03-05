"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SECTIONS = [
  { key: "delivery", label: "Delivery Policy" },
  { key: "return", label: "Return Policy" },
  { key: "refund", label: "Refund Policy" },
  { key: "cancellation", label: "Cancellation Policy" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "warranty", label: "Warranty Policy" },
];

export default function AdminPolicyPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetch("/api/admin/pages/policy", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          const next = {};
          SECTIONS.forEach((s) => {
            next[`${s.key}Title`] = data[`${s.key}Title`] ?? s.label;
            next[`${s.key}Text`] = data[`${s.key}Text`] ?? "";
          });
          setForm(next);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages/policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) alert("Policy page saved.");
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
      <div className="flex items-center gap-4">
        <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Privacy & Policy</h1>
      <p className="text-sm text-gray-600">Edit the content shown on the /policy page. Footer links point to each section (e.g. /policy#delivery).</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {SECTIONS.map((sec) => (
          <section key={sec.key} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">{sec.label}</h2>
            <div>
              <label className={labelCls}>Section Title</label>
              <input
                type="text"
                value={form[`${sec.key}Title`] ?? sec.label}
                onChange={(e) => set(`${sec.key}Title`, e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Content</label>
              <textarea
                value={form[`${sec.key}Text`] ?? ""}
                onChange={(e) => set(`${sec.key}Text`, e.target.value)}
                rows={4}
                className={inputCls}
                placeholder={`Enter ${sec.label} content...`}
              />
            </div>
          </section>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Policy Page"}
          </button>
        </div>
      </form>
    </div>
  );
}
