"use client";

/**
 * AccountBreadcrumb - Bar path with icons: Home > Account > [Current Page]
 * Shows when user is in account section
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGE_LABELS = {
  "/account": "Dashboard",
  "/account/profile": "Dashboard",
  "/account/wishlist": "Wishlist",
  "/account/cart": "Shopping Cart",
  "/account/orders": "Order History",
  "/account/settings": "Settings",
};

function getCurrentLabel(pathname) {
  if (!pathname) return "Account";
  if (pathname.startsWith("/account/orders/") && pathname !== "/account/orders") {
    return "Order Details";
  }
  return PAGE_LABELS[pathname] || pathname.split("/").pop() || "Account";
}

export default function AccountBreadcrumb() {
  const pathname = usePathname();
  const currentLabel = getCurrentLabel(pathname);

  return (
    <nav className="w-full py-3 flex items-center gap-2 text-sm flex-wrap" style={{ backgroundColor: "#404040" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-2">
      <Link href="/" className="flex items-center text-white hover:text-brand transition" aria-label="Home">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
      <span className="text-white"> &gt; </span>
      <Link href="/account/profile" className="text-white hover:text-brand transition">
        Account
      </Link>
      <span className="text-white"> &gt; </span>
      <span className="text-brand font-medium">{currentLabel}</span>
      </div>
    </nav>
  );
}
