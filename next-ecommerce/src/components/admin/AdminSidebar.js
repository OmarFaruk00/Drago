"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ListOrdered,
  Tag,
  FolderTree,
  Users,
  BarChart3,
  Star,
  Inbox,
  User,
  Truck,
  Image,
  FileText,
  LayoutGrid,
  X,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/orders", label: "Orders", icon: ListOrdered, showBadge: true },
  { href: "/admin/products", label: "Products", icon: Tag },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/home-sections", label: "Home Sections", icon: LayoutGrid },
  { href: "/admin/footer", label: "Footer", icon: FileText },
  { href: "/admin/coupons", label: "Coupons", icon: Star },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/delivery-settings", label: "Delivery Settings", icon: Truck },
  { href: "/admin/settings", label: "Personal Settings", icon: User },
];

export default function AdminSidebar({ sidebarOpen, onClose }) {
  const pathname = usePathname();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.orders || [];
        const pending = list.filter((o) => (o.status || "").toLowerCase() === "pending");
        setOrderCount(pending.length);
      })
      .catch(() => {});
  }, []);

  const content = (
    <nav className="flex flex-col gap-0.5 p-3">
      {menuItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));
        const Icon = item.icon;
        const showBadge = item.showBadge && orderCount > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-white text-gray-900 rounded-r-lg"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Icon
              className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-gray-900" : "text-white"}`}
            />
            <span className="flex-1">{item.label}</span>
            {showBadge && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isActive ? "bg-gray-200 text-gray-800" : "bg-gray-800 text-white"
                }`}
              >
                {orderCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside
        className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:w-64 z-30 bg-brand overflow-y-auto"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <div className="flex-1 pt-4 pb-4 min-h-0">{content}</div>
      </aside>
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-brand shadow-xl transform transition-transform duration-200 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end h-14 px-4 border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 pt-2 overflow-y-auto">{content}</div>
      </div>
    </>
  );
}
