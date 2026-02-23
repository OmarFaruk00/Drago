"use client";

/**
 * LiveChatWidget - Fixed floating chat button.
 * Logged-in users: direct website live chat. Non-logged-in: Login required + WhatsApp option.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, X, Send, User, Lock } from "lucide-react";
import { useStore } from "@/lib/store/useStore";

const CHAT_ICON_SRC = "/Drago%20Live%20chat.png";
const WHATSAPP_URL = "https://wa.me/8801923035628";

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const user = useStore((s) => s.user);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-brand/20 hover:scale-105 hover:shadow-xl hover:ring-brand/40 transition-all duration-200"
        aria-label="Open live chat"
      >
        {!imgError ? (
          <Image
            src={CHAT_ICON_SRC}
            alt="Drago Live Chat"
            width={64}
            height={64}
            className="h-12 w-12 object-contain rounded-full"
            onError={() => setImgError(true)}
          />
        ) : (
          <MessageCircle className="w-8 h-8 text-brand" strokeWidth={2} />
        )}
      </button>

      {isOpen && (
        user ? (
          <ChatWindowLoggedIn onClose={() => setIsOpen(false)} />
        ) : (
          <LoginRequiredPopup onClose={() => setIsOpen(false)} />
        )
      )}
    </>
  );
}

/**
 * Login Required popup - for non-logged-in users. Shows Login button + WhatsApp option.
 */
function LoginRequiredPopup({ onClose }) {
  return (
    <div
      className="fixed bottom-24 right-6 z-[9999] w-[340px] sm:w-[380px] flex flex-col bg-white rounded-xl shadow-xl border-2 border-brand overflow-hidden"
      role="dialog"
      aria-label="Helpline"
    >
      {/* Header - Helpline */}
      <div className="flex items-center justify-between px-4 py-3 bg-brand text-white">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Helpline"
              width={48}
              height={48}
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>
          <h3 className="font-semibold text-base">Helpline</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/20 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body - Login Required */}
      <div className="p-6 flex flex-col items-center border-b-2 border-r-2 border-l-2 border-brand/30 rounded-b-xl">
        <div className="relative w-16 h-16 rounded-lg bg-brand flex items-center justify-center text-white mb-3">
          <User className="w-7 h-7" strokeWidth={2} />
          <Lock className="absolute bottom-1 right-1 w-5 h-5" strokeWidth={2} />
        </div>
        <p className="text-brand font-bold text-lg mb-1">Login Required</p>
        <p className="text-gray-700 text-sm text-center mb-4">
          Log in to start live chat with our support team.
        </p>
        <Link
          href="/login?callbackUrl=/"
          className="w-full py-2.5 bg-brand text-white font-semibold text-center rounded-lg hover:bg-brand-dark transition"
          onClick={onClose}
        >
          Login to Account
        </Link>

        <div className="w-full flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-brand/50" />
          <span className="text-sm text-gray-600 font-medium">or</span>
          <div className="flex-1 h-px bg-brand/50" />
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white font-semibold rounded-lg hover:opacity-90 transition"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat With WhatsApp
        </a>
      </div>
    </div>
  );
}

/**
 * ChatWindowLoggedIn - Live chat UI for logged-in users.
 */
function ChatWindowLoggedIn({ onClose }) {
  return (
    <div
      className="fixed bottom-24 right-6 z-[9999] w-[340px] sm:w-[380px] max-h-[480px] flex flex-col bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
      role="dialog"
      aria-label="Live chat"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-brand text-white">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Helpline"
              width={48}
              height={48}
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Helpline</h3>
            <p className="text-xs text-white/90">Live chat with our support team</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/20 transition"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-[280px] bg-gray-50">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-brand" strokeWidth={2} />
          </div>
          <div className="bg-white px-3 py-2 rounded-lg rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
            <p className="text-sm text-gray-700">Hi! How can we help you today?</p>
            <p className="text-xs text-gray-400 mt-1">Just now</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Chat functionality coming soon.
        </p>
      </div>

      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            disabled
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="p-2 rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
