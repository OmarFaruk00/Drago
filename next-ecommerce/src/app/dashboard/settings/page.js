"use client";

/**
 * Settings - Profile form
 */

import { useStore } from "@/lib/store/useStore";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default function SettingsPage() {
  const user = useStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <SettingsForm user={user} />
      </div>
    </div>
  );
}
