"use client";

import { useState } from "react";
import Link from "next/link";
import NotificationToggle from "@/components/admin/NotificationToggle";

const NOTIFICATIONS = [
  { key: "newOrders", label: "New Orders" },
  { key: "newCustomers", label: "New Customers" },
  { key: "lowStockAlerts", label: "Low Stock Alerts" },
  { key: "systemAlerts", label: "System Alerts" },
  { key: "marketingEmails", label: "Marketing Emails" },
  { key: "adminAlerts", label: "Admin Alerts" },
];

export default function NotificationSettingsPage() {
  const [toggles, setToggles] = useState({
    newOrders: true,
    newCustomers: true,
    lowStockAlerts: true,
    systemAlerts: false,
    marketingEmails: false,
    adminAlerts: true,
  });

  function handleToggle(key, value) {
    setToggles((t) => ({ ...t, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/settings"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Settings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {NOTIFICATIONS.map((opt) => (
              <div
                key={opt.key}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                <NotificationToggle
                  checked={toggles[opt.key]}
                  onChange={(v) => handleToggle(opt.key, v)}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <Link
              href="/admin/settings"
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </Link>
            <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
