"use client";

/**
 * Account Settings - Profile picture, Personal Info, Billing Info, Change Password
 */

import { useStore } from "@/lib/store/useStore";
import AccountSettingsForm from "@/components/account/AccountSettingsForm";

export default function SettingsPage() {
  const user = useStore((s) => s.user);

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Account settings</h2>
        <AccountSettingsForm user={user} />
      </div>
    </div>
  );
}
