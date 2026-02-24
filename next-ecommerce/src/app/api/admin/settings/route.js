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
    const { name, phone, avatar, timezone, language, notificationPreferences, email, currentPassword, newPassword } = body;

    if (USE_MONGODB) {
      await connectDB();
      const update = {};
      if (name != null) update.name = name;
      if (phone != null) update.phone = phone;
      if (avatar != null) update.avatar = avatar;
      if (timezone != null) update.timezone = timezone;
      if (language != null) update.language = language;
      if (notificationPreferences != null) update.notificationPreferences = notificationPreferences;

      if (email != null && email.trim() !== "") {
        const newEmail = email.trim().toLowerCase();
        const existing = await Admin.findOne({ email: newEmail });
        if (existing && existing._id.toString() !== auth.admin.id) {
          return NextResponse.json({ error: "This email is already used by another admin" }, { status: 400 });
        }
        update.email = newEmail;
      }

      if (newPassword != null && String(newPassword).trim().length >= 6) {
        const adminWithPass = await Admin.findById(auth.admin.id).select("+password");
        if (!adminWithPass) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        if (!currentPassword) {
          return NextResponse.json({ error: "Current password is required to set a new password" }, { status: 400 });
        }
        const match = await adminWithPass.comparePassword(currentPassword);
        if (!match) {
          return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }
        update.password = String(newPassword).trim();
      }

      const admin = await Admin.findById(auth.admin.id).select("+password");
      if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });
      Object.assign(admin, update);
      await admin.save();
      const out = admin.toObject();
      delete out.password;
      out.id = out._id?.toString();
      delete out._id;
      delete out.__v;
      return NextResponse.json(out);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings PUT:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
