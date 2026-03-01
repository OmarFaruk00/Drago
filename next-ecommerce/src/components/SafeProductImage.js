"use client";

/**
 * SafeProductImage - Handles Google imgres URLs, unconfigured hosts, and invalid images.
 * Use wherever product/cart/wishlist images are displayed.
 */

import NextImage from "next/image";
import { useState, useEffect } from "react";

const PLACEHOLDER = "https://via.placeholder.com/400?text=No+Image";
const ALLOWED_HOSTS = [
  "images.unsplash.com",
  "via.placeholder.com",
  "res.cloudinary.com",
  "creassmart.com",
  "localhost",
  "127.0.0.1",
];

export function extractDirectImageUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("google.com")) {
    try {
      const u = new URL(url);
      const imgurl = u.searchParams.get("imgurl");
      if (imgurl && imgurl.startsWith("http")) return decodeURIComponent(imgurl);
    } catch (_) {}
  }
  return url;
}

function isAllowedUrl(url) {
  if (!url || url.startsWith("/uploads/") || url.startsWith("data:") || url.startsWith("/")) return true;
  try {
    const u = new URL(url);
    return ALLOWED_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith("." + h));
  } catch {
    return false;
  }
}

export default function SafeProductImage({
  src,
  alt = "Product",
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  loading,
  placeholder = PLACEHOLDER,
}) {
  const resolved = extractDirectImageUrl(src || placeholder);
  const [imgSrc, setImgSrc] = useState(resolved || placeholder);
  const needsUnopt =
    imgSrc?.startsWith("/uploads/") ||
    imgSrc?.startsWith("data:") ||
    !isAllowedUrl(imgSrc);
  useEffect(() => {
    setImgSrc(extractDirectImageUrl(src || placeholder) || placeholder);
  }, [src, placeholder]);
  const imgProps = {
    src: imgSrc,
    alt,
    className,
    sizes,
    priority,
    loading,
    unoptimized: needsUnopt,
    onError: () => setImgSrc(placeholder),
  };
  if (fill) {
    imgProps.fill = true;
  } else {
    imgProps.width = width ?? 200;
    imgProps.height = height ?? 200;
  }

  return <NextImage {...imgProps} />;
}
