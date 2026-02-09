/**
 * Admin Inbox - Get messages for a conversation, send new message
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Message from "@/lib/models/Message";
import Conversation from "@/lib/models/Conversation";
import { requireAdmin } from "@/lib/adminAuth";
import { mockMessages } from "@/lib/data/inbox";
import { USE_MONGODB } from "@/lib/config";

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const convId = params.id;
  try {
    if (USE_MONGODB) {
      await connectDB();
      const messages = await Message.find({ conversationId: convId })
        .sort({ createdAt: 1 })
        .lean();
      return NextResponse.json(
        messages.map((m) => ({
          id: m._id?.toString(),
          content: m.content,
          sender: m.senderModel === "Admin" ? "admin" : "user",
          attachment: m.attachment,
          createdAt: m.createdAt,
        }))
      );
    }
    const msgs = mockMessages[convId] || [];
    return NextResponse.json(msgs);
  } catch (err) {
    console.error("Inbox messages GET:", err);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const convId = params.id;
  try {
    const body = await request.json();
    const { content, attachment } = body;

    if (USE_MONGODB) {
      await connectDB();
      const msg = await Message.create({
        conversationId: convId,
        senderId: auth.admin.id,
        senderModel: "Admin",
        content: content || "",
        attachment: attachment || null,
      });
      await Conversation.findByIdAndUpdate(convId, {
        lastMessageContent: content || "(attachment)",
        lastMessageAt: new Date(),
      });
      return NextResponse.json({
        id: msg._id?.toString(),
        content: msg.content,
        sender: "admin",
        attachment: msg.attachment,
        createdAt: msg.createdAt,
      });
    }

    const msgs = mockMessages[convId] || [];
    const newMsg = {
      id: `m${Date.now()}`,
      content: content || "",
      sender: "admin",
      attachment: attachment || null,
      createdAt: new Date().toISOString(),
    };
    msgs.push(newMsg);
    return NextResponse.json(newMsg);
  } catch (err) {
    console.error("Inbox messages POST:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
