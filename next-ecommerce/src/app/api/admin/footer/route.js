/**
 * Admin Footer Settings API - GET, PUT (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import FooterSettings from "@/lib/models/FooterSettings";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";
import { readFooterSettings, writeFooterSettings } from "@/lib/store/footerFileStore";

function toJson(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return { id: o._id?.toString(), ...o, _id: undefined, __v: undefined };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const defaults = {
    logoUrl: "",
    logoSize: "medium",
    logoScale: 100,
    copyrightText: "",
    aboutTitle: "",
    aboutText: "",
    phone: "",
    email: "",
    address: "",
    aboutLinks: [],
    accountLinks: [],
    policyLinks: [],
    socialLinks: [],
    helpSupportItems: [],
    instagramItems: [],
  };
  try {
    if (USE_MONGODB) {
      const conn = await connectDB();
      if (conn) {
        let doc = await FooterSettings.findOne();
        if (!doc) doc = await FooterSettings.create({});
        return NextResponse.json(toJson(doc));
      }
    }
    const fileData = readFooterSettings();
    return NextResponse.json(fileData || defaults);
  } catch (err) {
    console.error("Admin footer GET:", err);
    const fileData = readFooterSettings();
    return NextResponse.json(fileData || defaults);
  }
}

export async function PUT(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const allowed = [
      "logoUrl", "logoSize", "logoScale", "copyrightText", "aboutTitle", "aboutText", "phone", "email", "address",
      "aboutLinks", "accountLinks", "policyLinks", "socialLinks",
      "helpSupportItems", "instagramItems",
    ];
    const data = {};
    for (const k of allowed) {
      if (body[k] === undefined) continue;
      if (k === "aboutLinks" || k === "accountLinks" || k === "policyLinks") {
        data[k] = Array.isArray(body[k])
          ? body[k].filter((x) => x && String(x.label || "").trim() && String(x.href || "").trim())
          : [];
      } else if (k === "socialLinks") {
        data[k] = Array.isArray(body[k])
          ? body[k].filter((x) => x && String(x.platform || "").trim() && String(x.url || "").trim())
          : [];
      } else if (k === "helpSupportItems") {
        data[k] = Array.isArray(body[k])
          ? body[k].filter((x) => x && (String(x.label || "").trim() || String(x.value || "").trim()))
          : [];
      } else if (k === "instagramItems") {
        data[k] = Array.isArray(body[k])
          ? body[k].filter((x) => x && String(x.image || "").trim())
          : [];
      } else if (k === "logoSize") {
        const v = String(body[k] || "medium").toLowerCase();
        data[k] = ["small", "medium", "large"].includes(v) ? v : "medium";
      } else if (k === "logoScale") {
        const n = Number(body[k]);
        data[k] = isNaN(n) ? 100 : Math.min(150, Math.max(50, n));
      } else {
        data[k] = body[k];
      }
    }

    if (USE_MONGODB) {
      const conn = await connectDB();
      if (!conn) {
        const ok = writeFooterSettings(data);
        if (ok) return NextResponse.json({ ...data, id: "file" });
        return NextResponse.json(
          { error: "MongoDB not connected. Set MONGODB_URI in .env.local and ensure MongoDB is running." },
          { status: 503 }
        );
      }
      try {
        let doc = await FooterSettings.findOne();
        if (!doc) {
          doc = await FooterSettings.create(data);
        } else {
          Object.assign(doc, data);
          await doc.save();
        }
        return NextResponse.json(toJson(doc));
      } catch (dbErr) {
        const ok = writeFooterSettings(data);
        if (ok) return NextResponse.json({ ...data, id: "file" });
        throw dbErr;
      }
    }
    writeFooterSettings(data);
    return NextResponse.json({ ...data, id: "1" });
  } catch (err) {
    console.error("Admin footer PUT:", err);
    const msg = err.message || "Failed to update footer settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
