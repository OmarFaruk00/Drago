/**
 * User Service - Real data only (MongoDB).
 * When MONGODB_URI is not set, login/register return null.
 */

import { USE_MONGODB } from "@/lib/config";
import connectDB from "@/lib/db/mongodb";

function normalizePhone(phone) {
  if (!phone || typeof phone !== "string") return phone;
  return phone.replace(/\D/g, "").replace(/^(\+88|88)?0?/, "0") || phone;
}

function toSafeUser(user) {
  const { password, __v, _id, ...rest } = user;
  return {
    id: user._id?.toString() || user.id,
    ...rest,
  };
}

export async function loginUser(identifier, password) {
  if (!USE_MONGODB) return null;
  const conn = await connectDB();
  if (!conn) return null;

  const User = (await import("@/lib/models/User")).default;
  const isEmail = identifier && identifier.includes("@");
  const query = isEmail ? { email: identifier } : { phone: normalizePhone(identifier) };
  const user = await User.findOne(query).select("+password").lean();
  if (!user || !user.password) return null;
  const bcrypt = (await import("bcryptjs")).default;
  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;
  return toSafeUser(user);
}

export async function registerUser(data) {
  if (!USE_MONGODB) return null;
  const conn = await connectDB();
  if (!conn) return null;

  const User = (await import("@/lib/models/User")).default;
  const bcrypt = (await import("bcryptjs")).default;
  const { email, phone, password, name } = data;
  const hasEmail = email && email.trim();
  const hasPhone = phone && normalizePhone(phone);
  if (!hasEmail && !hasPhone) return null;
  if (hasEmail) {
    const exists = await User.findOne({ email: email.trim().toLowerCase() }).lean();
    if (exists) return null;
  }
  if (hasPhone) {
    const p = normalizePhone(phone);
    const exists = await User.findOne({ phone: p }).lean();
    if (exists) return null;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: hasEmail ? email.trim().toLowerCase() : null,
    phone: hasPhone ? normalizePhone(phone) : null,
    password: hashedPassword,
    name: (name || "User").trim() || "User",
    role: "user",
    provider: "credentials",
  });
  return toSafeUser(user.toObject());
}

export async function findOrCreateOAuthUser(profile) {
  if (!USE_MONGODB) return null;
  const conn = await connectDB();
  if (!conn) return null;

  const User = (await import("@/lib/models/User")).default;
  let user = await User.findOne({
    $or: [{ email: profile.email }, { providerId: profile.providerId }],
  }).lean();
  if (user) {
    if (!user.providerId && profile.providerId) {
      await User.updateOne(
        { _id: user._id },
        { $set: { provider: profile.provider, providerId: profile.providerId, avatar: profile.image || user.avatar } }
      );
      user = { ...user, provider: profile.provider, providerId: profile.providerId, avatar: profile.image || user.avatar };
    }
    return toSafeUser(user);
  }
  const newUser = await User.create({
    email: profile.email,
    name: profile.name || profile.email?.split("@")[0] || "User",
    avatar: profile.image || null,
    provider: profile.provider,
    providerId: profile.providerId,
    role: "user",
  });
  return toSafeUser(newUser.toObject());
}

export async function requestPasswordReset(email) {
  if (!USE_MONGODB) return { ok: true };
  const conn = await connectDB();
  if (!conn) return { ok: true };
  const User = (await import("@/lib/models/User")).default;
  const user = await User.findOne({ email }).select("+password").lean();
  if (!user || !user.password) return { ok: true };
  const crypto = await import("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000);
  await User.updateOne(
    { _id: user._id },
    { $set: { resetToken: token, resetTokenExpiry: expiry } }
  );
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  return { ok: true, resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined };
}

export async function resetPassword(token, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters" };
  }
  if (!USE_MONGODB) {
    return { ok: false, error: "Password reset requires database." };
  }
  const conn = await connectDB();
  if (!conn) return { ok: false, error: "Database unavailable" };
  const User = (await import("@/lib/models/User")).default;
  const bcrypt = (await import("bcryptjs")).default;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  }).lean();
  if (!user) return { ok: false, error: "Invalid or expired reset link" };
  const hashed = await bcrypt.hash(newPassword, 10);
  await User.updateOne(
    { _id: user._id },
    { $set: { password: hashed }, $unset: { resetToken: 1, resetTokenExpiry: 1 } }
  );
  return { ok: true };
}
