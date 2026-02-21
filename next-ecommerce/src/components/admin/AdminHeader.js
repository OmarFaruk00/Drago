"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, MessageCircle, LogOut, Menu } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
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
    <header
      className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 gap-4"
      style={{
        backgroundColor: "#070b1d",
        fontFamily: "Inter, Poppins, system-ui, sans-serif",
      }}
    >
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center p-2 text-white/80 hover:bg-white/10 rounded-lg transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/admin" className="flex items-center h-16">
          <Image
            src="/logo.png"
            alt="DRAGO"
            width={220}
            height={70}
            className="h-14 sm:h-16 w-auto object-contain brightness-0 invert opacity-95"
            priority
          />
        </Link>
      </div>
      <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-white/15 bg-white/5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-6">
        <Link
          href="/admin/inbox"
          className="p-2.5 text-white/80 hover:bg-white/10 rounded-full transition"
          title="Messages"
        >
          <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
        </Link>
        <button
          className="p-2.5 text-white/80 hover:bg-white/10 rounded-full transition relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-white/20 animate-pulse" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-medium ring-2 ring-white/10">
                {(admin?.name || "Admin User").charAt(0)}
              </div>
              <span className="hidden md:inline text-sm font-medium text-white/90">
                Admin User
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 rounded-lg transition"
          title="Logout"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
