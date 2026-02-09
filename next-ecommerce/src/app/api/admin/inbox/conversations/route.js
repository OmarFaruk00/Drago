/**
 * Admin Inbox - List conversations
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Conversation from "@/lib/models/Conversation";
import User from "@/lib/models/User";
import { requireAdmin } from "@/lib/adminAuth";
import { mockConversations } from "@/lib/data/inbox";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      const convos = await Conversation.find()
        .populate("participants", "name email")
        .sort({ lastMessageAt: -1 })
        .lean();
      const list = convos.map((c) => ({
        id: c._id?.toString(),
        participant: c.participants?.[0]
          ? {
              id: c.participants[0]._id?.toString(),
              name: c.participants[0].name,
              email: c.participants[0].email,
            }
          : null,
        lastMessage: c.lastMessageContent || "",
        lastMessageAt: c.lastMessageAt,
      }));
      return NextResponse.json(list);
    }
    return NextResponse.json(mockConversations);
  } catch (err) {
    console.error("Inbox conversations GET:", err);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
