"use client";

import { usePathname } from "next/navigation";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

export default function AdminRootLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </div>
  );
}
