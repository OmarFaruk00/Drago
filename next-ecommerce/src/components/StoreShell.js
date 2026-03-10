"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollRestoration from "./ScrollRestoration";

const LiveChatWidget = dynamic(() => import("./LiveChatWidget"), { ssr: false, loading: () => null });

export default function StoreShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (isAdmin) return;
    const t = setTimeout(() => setShowChat(true), 2500);
    return () => clearTimeout(t);
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1 min-h-[100vh] bg-gray-50">{children}</main>
      <Footer />
      {showChat && <LiveChatWidget />}
    </>
  );
}
