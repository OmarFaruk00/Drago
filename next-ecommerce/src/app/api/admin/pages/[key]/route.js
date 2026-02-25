/**
 * Admin API: GET/PUT page content (about | contact). Requires admin auth.
 * GET returns merged content (defaults + saved) so admin form is complete.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import PageContent from "@/lib/models/PageContent";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";
import { DEFAULT_ABOUT, DEFAULT_CONTACT } from "@/lib/data/pageDefaults";

const ALLOWED_KEYS = ["about", "contact"];
const DEFAULTS = { about: DEFAULT_ABOUT, contact: DEFAULT_CONTACT };

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const key = params?.key;
  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "Invalid page key" }, { status: 400 });
  }
  try {
    if (USE_MONGODB) {
      await connectDB();
      const doc = await PageContent.findOne({ key });
      const base = DEFAULTS[key] || {};
      const content = doc?.content ? { ...base, ...doc.content } : base;
      return NextResponse.json(content);
    }
    return NextResponse.json(DEFAULTS[key] || {});
  } catch (err) {
    console.error("Admin pages GET:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const key = params?.key;
  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "Invalid page key" }, { status: 400 });
  }
  try {
    const content = await request.json();
    if (USE_MONGODB) {
      await connectDB();
      let doc = await PageContent.findOne({ key });
      if (!doc) doc = await PageContent.create({ key, content });
      else {
        doc.content = content;
        await doc.save();
      }
      return NextResponse.json(doc.content);
    }
    return NextResponse.json(content);
  } catch (err) {
    console.error("Admin pages PUT:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
