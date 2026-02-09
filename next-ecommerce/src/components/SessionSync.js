"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useStore } from "@/lib/store/useStore";

/**
 * Syncs NextAuth session to Zustand store for backward compatibility
 */
export default function SessionSync() {
  const { data: session, status } = useSession();
  const setUser = useStore((s) => s.setUser);
  const logout = useStore((s) => s.logout);

  useEffect(() => {
    if (status === "unauthenticated") {
      logout();
    } else if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar: session.user.image,
      });
    }
  }, [session, status, setUser, logout]);

  return null;
}
