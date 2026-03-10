"use client";

/**
 * GTMProvider - Loads GTM from API (Admin-managed) or env fallback
 * Fetches /api/settings/tracking for gtmId; falls back to NEXT_PUBLIC_GTM_ID
 */

import { useEffect, useState } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

const envGtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

export default function GTMProvider() {
  const [gtmId, setGtmId] = useState(envGtmId);

  useEffect(() => {
    const run = () => {
      fetch("/api/settings/tracking", { credentials: "include" })
        .then((r) => r.json())
        .then((data) => {
          const id = (data?.gtmId || "").trim() || envGtmId;
          if (id) setGtmId(id);
        })
        .catch(() => {
          if (envGtmId) setGtmId(envGtmId);
        });
    };
    const id = typeof requestIdleCallback !== "undefined"
      ? requestIdleCallback(run, { timeout: 2000 })
      : setTimeout(run, 100);
    return () => (typeof requestIdleCallback !== "undefined" ? cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  if (!gtmId) return null;
  return <GoogleTagManager gtmId={gtmId} />;
}
