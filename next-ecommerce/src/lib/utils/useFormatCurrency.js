"use client";

import { formatCurrency as format } from "./formatCurrency";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Hook - returns currency formatter with current locale (tk)
 */
export function useFormatCurrency() {
  const { locale } = useLanguage();
  return (amount) => format(amount, locale);
}
