/**
 * Admin Settings - GET profile/prefs, PUT update
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/lib/models/Admin";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      const admin = await Admin.findById(auth.admin.id).select("-password").lean();
      if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({
        ...admin,
        id: admin._id?.toString(),
        _id: undefined,
        __v: undefined,
      });
    }
    return NextResponse.json({
      id: auth.admin.id,
      name: auth.admin.name,
      email: auth.admin.email,
      phone: "",
      avatar: "",
      timezone: "GMT+06:00",
      language: "en",
      notificationPreferences: {
        newOrder: true,
        customerSignup: true,
        stockAlert: true,
        productUpdates: false,
        newMessages: true,
        promotionOffers: false,
        securityBilling: true,
      },
    });
  } catch (err) {
    console.error("Settings GET:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, phone, avatar, timezone, language, notificationPreferences } = body;

    if (USE_MONGODB) {
      await connectDB();
      const update = {};
      if (name != null) update.name = name;
      if (phone != null) update.phone = phone;
      if (avatar != null) update.avatar = avatar;
      if (timezone != null) update.timezone = timezone;
      if (language != null) update.language = language;
      if (notificationPreferences != null) update.notificationPreferences = notificationPreferences;
      const admin = await Admin.findByIdAndUpdate(auth.admin.id, update, { new: true })
        .select("-password")
        .lean();
      return NextResponse.json({
        ...admin,
        id: admin._id?.toString(),
        _id: undefined,
        __v: undefined,
      });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings PUT:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
