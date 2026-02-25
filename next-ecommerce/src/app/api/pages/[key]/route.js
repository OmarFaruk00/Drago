/**
 * Public API: GET page content by key (about | contact)
 * Returns default content when no DB or no doc
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import PageContent from "@/lib/models/PageContent";
import { USE_MONGODB } from "@/lib/config";
import { DEFAULT_ABOUT, DEFAULT_CONTACT } from "@/lib/data/pageDefaults";

export async function GET(request, { params }) {
  const key = params?.key;
  if (key !== "about" && key !== "contact") {
    return NextResponse.json({ error: "Invalid page key" }, { status: 400 });
  }
  try {
    if (USE_MONGODB) {
      await connectDB();
      const doc = await PageContent.findOne({ key });
      const content = doc?.content ? { ...(key === "about" ? DEFAULT_ABOUT : DEFAULT_CONTACT), ...doc.content } : (key === "about" ? DEFAULT_ABOUT : DEFAULT_CONTACT);
      return NextResponse.json(content);
    }
    return NextResponse.json(key === "about" ? DEFAULT_ABOUT : DEFAULT_CONTACT);
  } catch (err) {
    console.error("Pages GET:", err);
    return NextResponse.json(key === "about" ? DEFAULT_ABOUT : DEFAULT_CONTACT);
  }
}
