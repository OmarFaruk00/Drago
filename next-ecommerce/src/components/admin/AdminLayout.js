"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 min-h-0">
        <AdminSidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:pl-[calc(16rem+1rem)] lg:pr-8 lg:py-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
