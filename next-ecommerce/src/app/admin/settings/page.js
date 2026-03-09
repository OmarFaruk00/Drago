"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
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
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const fileInputRef = useRef(null);

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
        setAvatarError(false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaveError("");
    if (form.newPassword || form.confirmPassword || form.currentPassword) {
      if (!form.currentPassword) {
        setSaveError("বর্তমান পাসওয়ার্ড দিন (current password required)");
        return;
      }
      if (form.newPassword.length < 6) {
        setSaveError("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর (min 6 characters)");
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setSaveError("নতুন পাসওয়ার্ড মিলছে না (passwords do not match)");
        return;
      }
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        avatar: form.avatar,
        timezone: form.timezone,
        language: form.language,
        notificationPreferences: form.notificationPreferences,
      };
      if (form.newPassword && form.currentPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        setSaveError(data.error || "Failed to save");
      }
    } catch (e) {
      console.error(e);
      setSaveError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setAvatarError(false);
        setForm((f) => ({ ...f, avatar: data.url }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border-2 border-dashed border-gray-300 hover:border-brand transition"
                    >
                      {form.avatar && !avatarError ? (
                        <Image
                          src={form.avatar}
                          alt="Profile"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          unoptimized
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarUploading}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      {avatarUploading ? "Uploading..." : "Add File"}
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
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Admin নিজেই তার পাসওয়ার্ড পরিবর্তন করতে পারবেন।</p>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">বর্তমান পাসওয়ার্ড (Current)</label>
                      <input
                        type="password"
                        value={form.currentPassword}
                        onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">নতুন পাসওয়ার্ড (New, min 6 chars)</label>
                      <input
                        type="password"
                        value={form.newPassword}
                        onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">পুনরায় নিশ্চিত করুন (Confirm)</label>
                      <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand"
                      />
                    </div>
                  </div>
                </div>
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

          {saveError && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{saveError}</div>
          )}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                setSaveError("");
                if (settings) {
                  setForm({
                    name: settings.name || "",
                    email: settings.email || "",
                    phone: settings.phone || "",
                    avatar: settings.avatar || "",
                    timezone: settings.timezone || "GMT+06:00",
                    language: settings.language || "en",
                    notificationPreferences: settings.notificationPreferences || {},
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }
              }}
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
