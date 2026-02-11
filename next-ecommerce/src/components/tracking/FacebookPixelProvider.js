"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracking/client";

export default function FacebookPixelProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    trackPageView({
      event_source_url:
        typeof window !== "undefined" ? window.location.href : undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
