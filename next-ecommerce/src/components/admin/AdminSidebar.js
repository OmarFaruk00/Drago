"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Users,
  BarChart3,
  Tag,
  Inbox,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ sidebarOpen, onClose }) {
  const pathname = usePathname();

  const content = (
    <nav className="flex flex-col gap-0.5 p-3">
      {menuItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:left-0 z-30 bg-red-600">
        <div className="flex items-center justify-between h-16 px-6 border-b border-red-500">
          <Link href="/admin" className="text-white font-bold text-lg">
            Admin
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto pt-2">{content}</div>
      </aside>
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-red-600 shadow-xl transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-red-500">
          <span className="text-white font-bold text-lg">Admin</span>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="pt-2">{content}</div>
      </div>
    </>
  );
}
