"use client";

/**
 * LiveChatIcon - Fixed floating chat button, always visible (links to WhatsApp)
 */

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function LiveChatIcon() {
  return (
    <Link
      href="https://wa.me/8801923035628"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200"
      aria-label="Live Chat - WhatsApp"
    >
      <MessageCircle className="w-7 h-7" strokeWidth={2} />
    </Link>
  );
}
