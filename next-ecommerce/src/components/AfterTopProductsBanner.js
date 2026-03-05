"use client";

/**
 * AfterTopProductsBanner - Banners for section "after_top_products" (below Top Products on home)
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AfterTopProductsBanner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch("/api/banners?section=after_top_products", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data.filter((b) => b.image && b.image.trim()));
        }
      })
      .catch(() => {});
  }, []);

  if (banners.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto mt-4 px-4 sm:px-6">
      <div className={banners.length === 1 ? "" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        {banners.map((b) => (
          <Link
            key={b.id}
            href={b.link || "#"}
            className="block rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className="relative aspect-[3/1] min-h-[100px] sm:min-h-[120px]">
              <Image
                src={b.image}
                alt={b.title || "Banner"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                unoptimized={b.image?.startsWith("data:")}
              />
              {(b.title || b.subtitle || b.linkText) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4">
                  {b.title && <p className="text-white font-semibold text-lg">{b.title}</p>}
                  {b.subtitle && <p className="text-white/90 text-sm">{b.subtitle}</p>}
                  {b.linkText && (
                    <span className="mt-1 inline-flex text-brand-100 font-medium text-sm">{b.linkText}</span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
