"use client";

/**
 * ScrollRestoration - Prevents automatic scroll-to-bottom on navigation.
 * Sets history.scrollRestoration = 'manual' and scrolls to top on route change.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
