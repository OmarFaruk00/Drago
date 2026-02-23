"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const PLATFORMS = ["facebook", "youtube", "instagram", "tiktok", "twitter", "linkedin"];

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    aboutTitle: "",
    aboutText: "",
    phone: "",
    email: "",
    address: "",
    aboutLinks: [],
    accountLinks: [],
    policyLinks: [],
    socialLinks: [],
  });

  useEffect(() => {
    fetch("/api/admin/footer", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            aboutTitle: data.aboutTitle ?? "",
            aboutText: data.aboutText ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
            address: data.address ?? "",
            aboutLinks: Array.isArray(data.aboutLinks) ? data.aboutLinks : [],
            accountLinks: Array.isArray(data.accountLinks) ? data.accountLinks : [],
            policyLinks: Array.isArray(data.policyLinks) ? data.policyLinks : [],
            socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function addLink(type) {
    const key = type === "social" ? "socialLinks" : type === "about" ? "aboutLinks" : type === "account" ? "accountLinks" : "policyLinks";
    const schema = type === "social" ? { platform: "facebook", url: "" } : { label: "", href: "" };
    setForm((f) => ({ ...f, [key]: [...(f[key] || []), schema] }));
  }

  function updateLink(type, index, field, value) {
    const key = type === "social" ? "socialLinks" : type === "about" ? "aboutLinks" : type === "account" ? "accountLinks" : "policyLinks";
    setForm((f) => {
      const arr = [...(f[key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...f, [key]: arr };
    });
  }

  function removeLink(type, index) {
    const key = type === "social" ? "socialLinks" : type === "about" ? "aboutLinks" : type === "account" ? "accountLinks" : "policyLinks";
    setForm((f) => ({ ...f, [key]: (f[key] || []).filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) alert("Footer settings saved.");
      else {
        const err = await res.json();
        alert(err.error || "Failed to save");
      }
    } catch (e) {
      console.error(e);
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Footer Settings</h1>
      <p className="text-sm text-gray-600">Edit footer content, links, contact info, and social links.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">About section</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Title</label>
            <input
              type="text"
              value={form.aboutTitle}
              onChange={(e) => setForm((f) => ({ ...f, aboutTitle: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
              placeholder="About Drago"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
            <textarea
              value={form.aboutText}
              onChange={(e) => setForm((f) => ({ ...f, aboutText: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
              placeholder="Store description..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Contact info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {["about", "account", "policy"].map((type) => (
          <div key={type} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 capitalize">{type} Links</h2>
            {(form[`${type}Links`] || []).map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={item.label || ""}
                  onChange={(e) => updateLink(type, i, "label", e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={item.href || ""}
                  onChange={(e) => updateLink(type, i, "href", e.target.value)}
                  placeholder="URL"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button type="button" onClick={() => removeLink(type, i)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addLink(type)} className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
              <Plus className="w-4 h-4" /> Add link
            </button>
          </div>
        ))}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Social Links</h2>
          {(form.socialLinks || []).map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select
                value={item.platform || "facebook"}
                onChange={(e) => updateLink("social", i, "platform", e.target.value)}
                className="w-32 px-3 py-2 border rounded-lg text-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <input
                type="url"
                value={item.url || ""}
                onChange={(e) => updateLink("social", i, "url", e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button type="button" onClick={() => removeLink("social", i)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addLink("social")} className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
            <Plus className="w-4 h-4" /> Add social link
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Footer Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
