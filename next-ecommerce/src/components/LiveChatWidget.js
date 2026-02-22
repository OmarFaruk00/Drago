"use client";

/**
 * LiveChatWidget - Fixed floating chat button that opens a chat window placeholder.
 * Modular design: ChatWindow can be replaced with real chat logic later.
 */

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, X, Send } from "lucide-react";

const CHAT_ICON_SRC = "/Drago%20Live%20chat.png";

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      {/* Floating chat icon - fixed bottom-right, high z-index */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-brand/20 hover:scale-105 hover:shadow-xl hover:ring-brand/40 transition-all duration-200"
        aria-label="Open live chat"
      >
        {!imgError ? (
          <Image
            src={CHAT_ICON_SRC}
            alt="Drago Live Chat"
            width={48}
            height={48}
            className="h-10 w-10 object-contain rounded-full"
            onError={() => setImgError(true)}
          />
        ) : (
          <MessageCircle className="w-7 h-7 text-brand" strokeWidth={2} />
        )}
      </button>

      {/* Chat window - placeholder UI */}
      {isOpen && (
        <ChatWindow onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

/**
 * ChatWindow - Placeholder chat UI. Replace contents with real chat logic later.
 */
function ChatWindow({ onClose }) {
  return (
    <div
      className="fixed bottom-24 right-6 z-[9999] w-[340px] sm:w-[380px] max-h-[480px] flex flex-col bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
      role="dialog"
      aria-label="Live chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-brand text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Drago Live Chat</h3>
            <p className="text-xs text-white/90">We typically reply within minutes</p>
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

      {/* Placeholder body */}
      <div className="flex-1 overflow-y-auto p-4 min-h-[280px] bg-gray-50">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-brand" strokeWidth={2} />
          </div>
          <div className="bg-white px-3 py-2 rounded-lg rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
            <p className="text-sm text-gray-700">
              Hi! Welcome to Drago Store. How can we help you today?
            </p>
            <p className="text-xs text-gray-400 mt-1">Just now</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Chat functionality coming soon. Reach us at support@dragonestore.com
        </p>
      </div>

      {/* Input area - non-functional placeholder */}
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
