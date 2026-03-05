/**
 * Public API: GET page content by key (about | contact)
 * Returns default content when no DB or no doc
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import PageContent from "@/lib/models/PageContent";
import { USE_MONGODB } from "@/lib/config";
import { DEFAULT_ABOUT, DEFAULT_CONTACT, DEFAULT_POLICY } from "@/lib/data/pageDefaults";

const DEFAULTS = { about: DEFAULT_ABOUT, contact: DEFAULT_CONTACT, policy: DEFAULT_POLICY };

export async function GET(request, { params }) {
  const key = params?.key;
  if (!DEFAULTS[key]) {
    return NextResponse.json({ error: "Invalid page key" }, { status: 400 });
  }
  try {
    if (USE_MONGODB) {
      await connectDB();
      const doc = await PageContent.findOne({ key });
      const content = doc?.content ? { ...DEFAULTS[key], ...doc.content } : DEFAULTS[key];
      return NextResponse.json(content);
    }
    return NextResponse.json(DEFAULTS[key]);
  } catch (err) {
    console.error("Pages GET:", err);
    return NextResponse.json(DEFAULTS[key] || {});
  }
}
