"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut, Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminHeader({ onMenuClick }) {
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.admin) setAdmin(data.admin);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
      <button
        onClick={onMenuClick}
        className="lg:hidden flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1 max-w-xl mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex rounded overflow-hidden border border-gray-200">
          <button
            onClick={() => setLocale("en")}
            className={`px-2 py-1 text-xs font-medium ${locale === "en" ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLocale("bn")}
            className={`px-2 py-1 text-xs font-medium ${locale === "bn" ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            BN
          </button>
        </div>
        <button
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : admin ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-medium">
              {admin.name?.charAt(0) || "A"}
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">
              {admin.name}
            </span>
          </div>
        ) : null}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
