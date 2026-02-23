"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LiveChatWidget from "./LiveChatWidget";
import ScrollRestoration from "./ScrollRestoration";

export default function StoreShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1 min-h-[100vh] bg-gray-50">{children}</main>
      <Footer />
      <LiveChatWidget />
    </>
  );
}
