"use client";

import { useEffect, useState } from "react";
import { Upload, Key } from "lucide-react";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "events", label: "Events" },
];

const NOTIFICATION_OPTIONS = [
  { key: "newOrder", label: "New Order" },
  { key: "customerSignup", label: "Customer Sign-up" },
  { key: "stockAlert", label: "Stock Alert" },
  { key: "productUpdates", label: "Product Updates" },
  { key: "newMessages", label: "New Messages" },
  { key: "promotionOffers", label: "Promotion Offers" },
  { key: "securityBilling", label: "Security and Billing" },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
        checked ? "bg-brand" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    timezone: "GMT+06:00",
    language: "en",
    notificationPreferences: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          avatar: data.avatar || "",
          timezone: data.timezone || "GMT+06:00",
          language: data.language || "en",
          notificationPreferences: data.notificationPreferences || {},
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function updateNotification(key, value) {
    setForm((f) => ({
      ...f,
      notificationPreferences: {
        ...f.notificationPreferences,
        [key]: value,
      },
    }));
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
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-brand text-brand"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6">
          {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {form.avatar ? (
                        <img src={form.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Add File
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                    <select
                      value={form.timezone}
                      onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                    >
                      <option value="GMT+06:00">GMT +06:00</option>
                      <option value="GMT+00:00">GMT +00:00</option>
                      <option value="GMT-05:00">GMT -05:00</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={form.language}
                      onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                    >
                      <option value="en">English</option>
                      <option value="bn">Bangla</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 text-brand hover:text-brand-dark"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="font-medium text-gray-900">Notification Preferences</h3>
                <div className="space-y-4">
                  {NOTIFICATION_OPTIONS.map((opt) => (
                    <div key={opt.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{opt.label}</span>
                      <Toggle
                        checked={!!form.notificationPreferences[opt.key]}
                        onChange={(v) => updateNotification(opt.key, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <p className="text-gray-500">Security settings coming soon.</p>
              </div>
            )}

            {activeTab === "events" && (
              <div>
                <p className="text-gray-500">Events and activity log coming soon.</p>
              </div>
            )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() =>
                settings &&
                setForm({
                  name: settings.name || "",
                  email: settings.email || "",
                  phone: settings.phone || "",
                  avatar: settings.avatar || "",
                  timezone: settings.timezone || "GMT+06:00",
                  language: settings.language || "en",
                  notificationPreferences: settings.notificationPreferences || {},
                })
              }
              className="px-6 py-2.5 border border-brand text-brand rounded-lg hover:bg-red-50"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
            >
              {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
