"use client";

/**
 * Admin Inbox - Chat UI (matches Figma design)
 * Left: conversation list with avatar, username, last message
 * Right: chat messages, admin (red) / customer (grey) bubbles, timestamps
 * Bottom: message input with paperclip, emoji, send button
 * UI only - no backend logic
 */

import { useState } from "react";
import { Search, Paperclip, Smile, Send } from "lucide-react";

const MOCK_CONVERSATIONS = [
  { id: "1", name: "Nick Robinson", lastMessage: "When will my order arrive?", lastTime: "3 min ago", hasUnread: false },
  { id: "2", name: "Ananna", lastMessage: "I need help with a return", lastTime: "12 min ago", hasUnread: true },
  { id: "3", name: "Mahmud", lastMessage: "Thanks for the quick delivery!", lastTime: "1 hour ago", hasUnread: false },
];

const MOCK_MESSAGES = [
  { id: "m1", sender: "customer", content: "Hi, I have a question about my order", time: "2 hours ago" },
  { id: "m2", sender: "admin", content: "Hello! How can I help you today?", time: "2 hours ago" },
  { id: "m3", sender: "customer", content: "When will my order #12345 be delivered?", time: "1 hour ago" },
  { id: "m4", sender: "admin", content: "Your order is out for delivery and should arrive by tomorrow.", time: "45 min ago" },
  { id: "m5", sender: "customer", content: "Great, thank you!", time: "30 min ago" },
  { id: "m6", sender: "admin", content: "You're welcome! Let us know if you need anything else.", time: "3 min ago" },
];

export default function AdminInboxPage() {
  const [selected, setSelected] = useState(MOCK_CONVERSATIONS[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      { id: `m${Date.now()}`, sender: "admin", content: input.trim(), time: "Just now" },
    ]);
    setInput("");
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex">
      {/* Left - Conversation list (red-tinted panel) */}
      <div className="w-full md:w-80 flex-shrink-0 bg-red-50 border-r border-red-100 flex flex-col">
        <div className="p-4 border-b border-red-100">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full flex items-center gap-3 p-4 text-left transition ${
                selected?.id === c.id ? "bg-red-100 border-l-4 border-brand" : "hover:bg-red-50"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-brand-dark font-semibold shrink-0">
                {(c.name || "?")[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{c.name}</p>
                <p className="text-sm text-gray-600 truncate">{c.lastMessage}</p>
              </div>
              <div className="shrink-0 text-right">
                {c.hasUnread && (
                  <span className="block w-2 h-2 rounded-full bg-brand mb-1 ml-auto" />
                )}
                <span className="text-xs text-gray-500">{c.lastTime}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right - Chat panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selected && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-900">{selected.name}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      m.sender === "admin"
                        ? "bg-brand text-white rounded-br-md"
                        : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{m.content}</p>
                    <p className={`text-xs mt-1 ${m.sender === "admin" ? "text-red-100" : "text-gray-500"}`}>
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex items-center gap-2">
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Paperclip className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Smile className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
