"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Paperclip, Send, Video, Phone, MoreVertical } from "lucide-react";
import Image from "next/image";

export default function AdminInboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inbox/conversations", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setConversations(Array.isArray(data) ? data : []);
        if (data?.length && !selected) setSelected(data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected?.id) return;
    fetch(`/api/admin/inbox/conversations/${selected.id}/messages`, { credentials: "include" })
      .then((r) => r.json())
      .then(setMessages)
      .catch(console.error);
  }, [selected?.id]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || !selected) return;
    try {
      const res = await fetch(`/api/admin/inbox/conversations/${selected.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: input.trim() }),
      });
      const msg = await res.json();
      if (res.ok) setMessages((m) => [...m, msg]);
      setInput("");
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="flex flex-1 min-h-0">
        {/* Left - Conversations */}
        <div className="w-full md:w-80 flex-shrink-0 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-3">Inbox</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <button className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-full border-2 border-dashed border-red-500 text-red-600 hover:bg-red-50 text-sm font-medium">
              <Plus className="w-4 h-4" />
              New Message
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition ${
                  selected?.id === c.id ? "bg-red-50 border-l-4 border-red-600" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium shrink-0">
                  {(c.participant?.name || "?")[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{c.participant?.name || "Unknown"}</p>
                  <p className="text-sm text-gray-500 truncate">{c.lastMessage || "No messages"}</p>
                </div>
                <p className="text-xs text-gray-400 shrink-0">
                  {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </p>
              </button>
            ))}
            {conversations.length === 0 && (
              <p className="p-8 text-center text-gray-500 text-sm">No conversations yet</p>
            )}
          </div>
        </div>

        {/* Right - Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {selected ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium">
                    {(selected.participant?.name || "?")[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selected.participant?.name}</p>
                    <p className="text-xs text-gray-500">Last seen 7 minutes ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        m.sender === "admin"
                          ? "bg-red-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      {m.attachment && (
                        <img
                          src={m.attachment}
                          alt=""
                          className="rounded-lg max-h-40 object-cover mb-1"
                        />
                      )}
                      <p className="text-sm">{m.content || ""}</p>
                      <p className={`text-xs mt-1 ${m.sender === "admin" ? "text-red-100" : "text-gray-500"}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex gap-2">
                <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
