"use client";

/**
 * AuthLink - For Cart, Shop, Product, Wishlist: if logged in → target page, else → /register
 */

import Link from "next/link";
import { useStore } from "@/lib/store/useStore";

export default function AuthLink({ href, children, className = "" }) {
  const user = useStore((s) => s.user);
  const target = user ? href : `/register?callbackUrl=${encodeURIComponent(href)}`;

  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}
