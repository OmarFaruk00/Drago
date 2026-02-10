"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/i18n/translations";

const LanguageContext = createContext({ locale: "en", t: () => "", setLocale: () => {} });

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("locale") : null;
    if (saved === "bn" || saved === "en") setLocaleState(saved);
    setMounted(true);
  }, []);

  function setLocale(lang) {
    if (lang !== "en" && lang !== "bn") return;
    setLocaleState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", lang);
      document.documentElement.lang = lang === "bn" ? "bn" : "en";
    }
  }

  function t(key) {
    const dict = translations[locale] || translations.en;
    return dict[key] ?? translations.en[key] ?? key;
  }

  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = locale === "bn" ? "bn" : "en";
    }
  }, [locale, mounted]);

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
