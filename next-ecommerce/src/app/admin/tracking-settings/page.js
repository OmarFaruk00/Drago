"use client";

/**
 * Admin Tracking Settings - Configure GTM ID and Meta Pixel ID
 * Values from DB override .env; used by GTMProvider and analytics
 */

import { useEffect, useState } from "react";
import { BarChart2 } from "lucide-react";

export default function AdminTrackingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    gtmId: "",
    fbPixelId: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings/tracking", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setForm({
            gtmId: data.gtmId || "",
            fbPixelId: data.fbPixelId || "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings/tracking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          gtmId: data.gtmId || "",
          fbPixelId: data.fbPixelId || "",
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (err) {
      alert("Something went wrong");
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
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
          <BarChart2 className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tracking Settings</h1>
          <p className="text-sm text-gray-500">
            Google Tag Manager & Meta Pixel IDs. Values here override .env. GTM loads Meta Pixel and other tags via dataLayer.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager Container ID</label>
            <input
              type="text"
              value={form.gtmId}
              onChange={(e) => setForm((f) => ({ ...f, gtmId: e.target.value.trim() }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="GTM-XXXXXX"
            />
            <p className="mt-1 text-xs text-gray-500">e.g. GTM-XXXXXXX. Leave empty to use NEXT_PUBLIC_GTM_ID from .env</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Pixel ID (optional)</label>
            <input
              type="text"
              value={form.fbPixelId}
              onChange={(e) => setForm((f) => ({ ...f, fbPixelId: e.target.value.trim() }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand"
              placeholder="1234567890123456"
            />
            <p className="mt-1 text-xs text-gray-500">Override NEXT_PUBLIC_FB_PIXEL_ID from .env if set</p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">Settings saved.</span>}
        </div>
      </form>
    </div>
  );
}
