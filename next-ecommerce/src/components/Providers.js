"use client";

import { SessionProvider } from "next-auth/react";
import SessionSync from "./SessionSync";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <SessionSync />
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}
