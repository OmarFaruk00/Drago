"use client";

/**
 * DashboardLayout - Sidebar + main content, responsive
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/useStore";
import SidebarMenu from "./SidebarMenu";
import LogoutModal from "./LogoutModal";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const logout = useStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutClick = () => setLogoutOpen(true);
  const handleLogoutConfirm = () => {
    logout();
    router.push("/");
    setLogoutOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        <SidebarMenu
          onLogout={handleLogoutClick}
          sidebarOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menu
          </button>
          {children}
        </div>
      </div>
      <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={handleLogoutConfirm} />
    </div>
  );
}
