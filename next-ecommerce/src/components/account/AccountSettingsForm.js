"use client";

/**
 * AccountSettingsForm - Personal Info, Billing Info, Change Password
 * Account dashboard settings form
 */

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store/useStore";
import ProfileAvatarCard from "./ProfileAvatarCard";
import { cities } from "@/lib/data/bangladeshLocations";

const COUNTRIES = [
  { value: "BD", label: "Bangladesh" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "IN", label: "India" },
];

function getInitialForm(user) {
  const parts = (user?.name || "").trim().split(/\s+/);
  const firstName = user?.firstName ?? parts[0] ?? "";
  const lastName = user?.lastName ?? (parts.length > 1 ? parts.slice(1).join(" ") : "");
  return {
    firstName,
    lastName,
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    streetAddress: user?.streetAddress ?? "",
    country: user?.country ?? "BD",
    state: user?.state ?? "",
    city: user?.city ?? "",
    zipCode: user?.zipCode ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

export default function AccountSettingsForm({ user }) {
  const { update: updateSession } = useSession();
  const setUser = useStore((s) => s.setUser);
  const [form, setForm] = useState(() => getInitialForm(user));
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    setForm(getInitialForm(user));
  }, [user?.id, user?.email, user?.name]);

  const handleAvatarChange = useCallback(
    async (fileOrNull) => {
      if (!user?.id) return;
      setAvatarLoading(true);
      try {
        if (fileOrNull instanceof File) {
          const fd = new FormData();
          fd.append("file", fileOrNull);
          const up = await fetch("/api/account/upload", { method: "POST", body: fd, credentials: "include" });
          const upJson = await up.json();
          if (!up.ok || !upJson.url) {
            alert(upJson.error || "Upload failed");
            return;
          }
          const res = await fetch("/api/account/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatar: upJson.url }),
            credentials: "include",
          });
          const json = await res.json();
          if (!res.ok) {
            alert("Update failed");
            return;
          }
          setUser({ ...user, avatar: json.avatar });
          updateSession?.();
          alert("Profile picture updated successfully!");
        } else {
          const res = await fetch("/api/account/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatar: null }),
            credentials: "include",
          });
          const json = await res.json();
          if (!res.ok) {
            alert("Update failed");
            return;
          }
          setUser({ ...user, avatar: null });
          updateSession?.();
          alert("Profile picture removed.");
        }
      } catch (err) {
        alert("Something went wrong");
      } finally {
        setAvatarLoading(false);
      }
    },
    [user, setUser, updateSession]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save logic
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileAvatarCard
        currentImage={user?.avatar}
        onImageChange={handleAvatarChange}
        loading={avatarLoading}
      />

      {/* Personal Information */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Your first name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Your last name"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Billing Information</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Street Address</label>
            <input
              type="text"
              value={form.streetAddress}
              onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
              placeholder="Enter your address"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Country / Region</label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className={inputClass}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Default: Bangladesh. You can change if needed.</p>
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                list="bd-states-datalist"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="Type or select city..."
                className={inputClass}
                autoComplete="off"
              />
              <datalist id="bd-states-datalist">
                {cities.map((district) => (
                  <option key={district} value={district} />
                ))}
              </datalist>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              placeholder="Your current password"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                placeholder="Your new password"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark"
      >
        Save Changes
      </button>
    </form>
  );
}
