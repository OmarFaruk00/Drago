"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminImageUrlField from "@/components/admin/AdminImageUrlField";
import AdminFooterLogoField from "@/components/admin/AdminFooterLogoField";

const PLATFORMS = ["facebook", "youtube", "instagram", "tiktok", "twitter", "linkedin"];

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    logoUrl: "",
    logoSize: "medium",
    logoScale: 100,
    copyrightText: "",
    aboutTitle: "",
    aboutText: "",
    phone: "",
    email: "",
    address: "",
    aboutLinks: [],
    accountLinks: [],
    policyLinks: [],
    socialLinks: [],
    helpSupportItems: [],
    instagramItems: [],
  });

  useEffect(() => {
    fetch("/api/admin/footer", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            logoUrl: data.logoUrl ?? "",
            logoSize: data.logoSize ?? "medium",
            logoScale: data.logoScale ?? 100,
            copyrightText: data.copyrightText ?? "",
            aboutTitle: data.aboutTitle ?? "",
            aboutText: data.aboutText ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
            address: data.address ?? "",
            aboutLinks: Array.isArray(data.aboutLinks) ? data.aboutLinks : [],
            accountLinks: Array.isArray(data.accountLinks) ? data.accountLinks : [],
            policyLinks: Array.isArray(data.policyLinks) ? data.policyLinks : [],
            socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
            helpSupportItems: Array.isArray(data.helpSupportItems) ? data.helpSupportItems : [],
            instagramItems: Array.isArray(data.instagramItems) ? data.instagramItems : [],
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

  function addHelpSupport() {
    setForm((f) => ({ ...f, helpSupportItems: [...(f.helpSupportItems || []), { label: "", value: "" }] }));
  }
  function updateHelpSupport(i, field, val) {
    setForm((f) => {
      const arr = [...(f.helpSupportItems || [])];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, helpSupportItems: arr };
    });
  }
  function removeHelpSupport(i) {
    setForm((f) => ({ ...f, helpSupportItems: (f.helpSupportItems || []).filter((_, j) => j !== i) }));
  }

  function addInstagram() {
    setForm((f) => ({ ...f, instagramItems: [...(f.instagramItems || []), { image: "", link: "" }] }));
  }
  function updateInstagram(i, field, val) {
    setForm((f) => {
      const arr = [...(f.instagramItems || [])];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, instagramItems: arr };
    });
  }
  function removeInstagram(i) {
    setForm((f) => ({ ...f, instagramItems: (f.instagramItems || []).filter((_, j) => j !== i) }));
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
          <h2 className="font-semibold text-gray-900">Logo &amp; Copyright</h2>
          <AdminFooterLogoField
            label="Footer Logo (optional)"
            value={form.logoUrl}
            onChange={(v) => setForm((f) => ({ ...f, logoUrl: v }))}
            placeholder="Or paste image URL (optional)"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo Size (zoom) — {form.logoScale ?? 100}%
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={150}
                step={5}
                value={form.logoScale ?? 100}
                onChange={(e) => setForm((f) => ({ ...f, logoScale: Number(e.target.value) }))}
                className="flex-1 max-w-xs h-2 rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <span className="text-sm text-gray-500 w-12">{form.logoScale ?? 100}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Adjust zoom. Save to apply on live site.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
            <input
              type="text"
              value={form.copyrightText}
              onChange={(e) => setForm((f) => ({ ...f, copyrightText: e.target.value }))}
              placeholder="e.g. drago © 2025. All Rights Reserved"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Privacy &amp; Policy Links</h2>
          <p className="text-sm text-gray-500">Add links for Delivery Policy, Return Policy, Refund Policy, etc. (label + URL)</p>
          {(form.policyLinks || []).map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={item.label || ""}
                onChange={(e) => updateLink("policy", i, "label", e.target.value)}
                placeholder="e.g. Delivery Policy"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                value={item.href || ""}
                onChange={(e) => updateLink("policy", i, "href", e.target.value)}
                placeholder="URL: /policy/delivery"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button type="button" onClick={() => removeLink("policy", i)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addLink("policy")} className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
            <Plus className="w-4 h-4" /> Add Privacy &amp; Policy link
          </button>
        </div>

        {["about", "account"].map((type) => (
          <div key={type} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 capitalize">{type} Links</h2>
            {(form[`${type}Links`] || []).map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={item.label || ""} onChange={(e) => updateLink(type, i, "label", e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <input type="text" value={item.href || ""} onChange={(e) => updateLink(type, i, "href", e.target.value)} placeholder="URL" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <button type="button" onClick={() => removeLink(type, i)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => addLink(type)} className="inline-flex items-center gap-1 text-sm text-brand hover:underline"><Plus className="w-4 h-4" /> Add link</button>
          </div>
        ))}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Help &amp; Support</h2>
          <p className="text-sm text-gray-500">Add custom lines (e.g. Working Hours, Extra Phone). Or use Contact info above for Address, Phone, Email.</p>
          {(form.helpSupportItems || []).map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={item.label || ""} onChange={(e) => updateHelpSupport(i, "label", e.target.value)} placeholder="Label (e.g. Working Hours)" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <input type="text" value={item.value || ""} onChange={(e) => updateHelpSupport(i, "value", e.target.value)} placeholder="Value (e.g. 9 AM - 5 PM)" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <button type="button" onClick={() => removeHelpSupport(i)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={addHelpSupport} className="inline-flex items-center gap-1 text-sm text-brand hover:underline"><Plus className="w-4 h-4" /> Add Help &amp; Support item</button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Instagram Grid</h2>
          <p className="text-sm text-gray-500">Add images + links for Instagram section (image URL + link URL)</p>
          {(form.instagramItems || []).map((item, i) => (
            <div key={i} className="flex gap-2 items-center flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <AdminImageUrlField
                  label=""
                  value={item.image || ""}
                  onChange={(v) => updateInstagram(i, "image", v)}
                  placeholder="Image URL or Upload"
                />
              </div>
              <input type="url" value={item.link || ""} onChange={(e) => updateInstagram(i, "link", e.target.value)} placeholder="Link URL (optional)" className="flex-1 min-w-[120px] px-3 py-2 border rounded-lg text-sm" />
              <button type="button" onClick={() => removeInstagram(i)} className="p-2 text-red-600 hover:bg-red-50 rounded shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={addInstagram} className="inline-flex items-center gap-1 text-sm text-brand hover:underline"><Plus className="w-4 h-4" /> Add Instagram image</button>
        </div>

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
