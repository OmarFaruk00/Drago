"use client";

/**
 * AccountLayout - Customer account wrapper with sidebar
 * Used inside StoreShell (Navbar + Footer unchanged)
 */

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useStore } from "@/lib/store/useStore";
import AccountSidebar from "./AccountSidebar";
import LogoutModal from "./LogoutModal";

export default function AccountLayout({ children }) {
  const logout = useStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <AccountSidebar onLogout={handleLogoutClick} />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/40"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl p-4 pt-20">
              <AccountSidebar onLogout={() => { setSidebarOpen(false); handleLogoutClick(); }} />
            </div>
          </>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
