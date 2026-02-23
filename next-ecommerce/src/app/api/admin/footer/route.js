/**
 * Admin Footer Settings API - GET, PUT (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import FooterSettings from "@/lib/models/FooterSettings";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

function toJson(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return { id: o._id?.toString(), ...o, _id: undefined, __v: undefined };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      let doc = await FooterSettings.findOne();
      if (!doc) {
        doc = await FooterSettings.create({});
      }
      return NextResponse.json(toJson(doc));
    }
    return NextResponse.json({
      aboutTitle: "",
      aboutText: "",
      phone: "",
      email: "",
      address: "",
      aboutLinks: [],
      accountLinks: [],
      policyLinks: [],
      socialLinks: [],
    });
  } catch (err) {
    console.error("Admin footer GET:", err);
    return NextResponse.json({ error: "Failed to fetch footer settings" }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const allowed = [
      "aboutTitle", "aboutText", "phone", "email", "address",
      "aboutLinks", "accountLinks", "policyLinks", "socialLinks",
    ];
    const data = {};
    for (const k of allowed) {
      if (body[k] !== undefined) data[k] = body[k];
    }

    if (USE_MONGODB) {
      await connectDB();
      let doc = await FooterSettings.findOne();
      if (!doc) {
        doc = await FooterSettings.create(data);
      } else {
        Object.assign(doc, data);
        await doc.save();
      }
      return NextResponse.json(toJson(doc));
    }
    return NextResponse.json({ ...data, id: "1" });
  } catch (err) {
    console.error("Admin footer PUT:", err);
    return NextResponse.json({ error: "Failed to update footer settings" }, { status: 500 });
  }
}
