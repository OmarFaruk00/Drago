"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "./AdminLayout";

export default function AdminLayoutWrapper({ children }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <AdminLayout>{children}</AdminLayout>;
}
