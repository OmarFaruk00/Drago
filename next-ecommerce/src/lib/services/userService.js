/**
 * User Service - Abstraction layer for user/auth data
 * Uses mock JSON when MONGODB_URI is not set
 * Uses Mongoose User model when MongoDB is connected
 *
 * Note: For production, use bcrypt for passwords and JWT/sessions for auth
 */

import { USE_MONGODB } from "@/lib/config";
import connectDB from "@/lib/db/mongodb";
import { mockUsers } from "@/lib/data/users";

/**
 * Login user by email or mobile and password
 * @param {string} identifier - email or mobile number
 * @param {string} password (plain - in production compare with bcrypt hash)
 * @returns {Promise<Object|null>} User without password, or null
 */
export async function loginUser(identifier, password) {
  if (!USE_MONGODB) {
    return loginUserFromDummy(identifier, password);
  }
  return loginUserFromMongo(identifier, password);
}

/**
 * Register new user
 * @param {Object} data - { email, password, name }
 * @returns {Promise<Object|null>} New user without password, or null if email exists
 */
export async function registerUser(data) {
  if (!USE_MONGODB) {
    return registerUserFromDummy(data);
  }
  return registerUserFromMongo(data);
}

// --- Dummy implementation ---
function loginUserFromDummy(identifier, password) {
  const isEmail = identifier && identifier.includes("@");
  const user = mockUsers.find((u) => {
    let matchId = false;
    if (isEmail) {
      matchId = u.email === identifier;
    } else {
      const norm = normalizePhone(identifier);
      matchId = (u.phone && normalizePhone(u.phone) === norm) || u.email === identifier;
    }
    return matchId && u.password === password;
  });
  return user ? toSafeUser(user) : null;
}

function normalizePhone(phone) {
  if (!phone || typeof phone !== "string") return phone;
  return phone.replace(/\D/g, "").replace(/^(\+88|88)?0?/, "0") || phone;
}

function registerUserFromDummy(data) {
  const { email, phone, password, name } = data;
  const hasEmail = email && email.trim();
  const hasPhone = phone && normalizePhone(phone);
  if (!hasEmail && !hasPhone) return null;
  if (hasEmail && mockUsers.find((u) => u.email === email.trim().toLowerCase())) return null;
  if (hasPhone) {
    const p = normalizePhone(phone);
    if (mockUsers.find((u) => (u.phone && normalizePhone(u.phone)) === p)) return null;
  }
  const newUser = {
    id: `u${mockUsers.length + 1}`,
    email: hasEmail ? email.trim().toLowerCase() : null,
    phone: hasPhone ? normalizePhone(phone) : null,
    name: name || "User",
    role: "user",
    password,
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockUsers.push(newUser);
  return toSafeUser(newUser);
}

// --- MongoDB implementation ---
async function loginUserFromMongo(identifier, password) {
  const conn = await connectDB();
  if (!conn) return loginUserFromDummy(identifier, password);

  const User = (await import("@/lib/models/User")).default;
  const bcrypt = (await import("bcryptjs")).default;
  const isEmail = identifier && identifier.includes("@");
  const query = isEmail ? { email: identifier } : { phone: normalizePhone(identifier) };
  const user = await User.findOne(query).select("+password").lean();
  if (!user || !user.password) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return toSafeUser(user);
}

async function registerUserFromMongo(data) {
  const conn = await connectDB();
  if (!conn) return registerUserFromDummy(data);

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

function toSafeUser(user) {
  const { password, __v, _id, ...rest } = user;
  return {
    id: user._id?.toString() || user.id,
    ...rest,
  };
}

/**
 * Find or create user from OAuth (Google, Facebook)
 * @param {Object} profile - { email, name, image, provider, providerId }
 * @returns {Promise<Object>} User without password
 */
export async function findOrCreateOAuthUser(profile) {
  if (!USE_MONGODB) {
    const existing = mockUsers.find((u) => u.email === profile.email);
    if (existing) return toSafeUser(existing);
    const newUser = {
      id: `u${mockUsers.length + 1}`,
      email: profile.email,
      name: profile.name || "User",
      role: "user",
      avatar: profile.image || null,
      provider: profile.provider,
      providerId: profile.providerId,
    };
    return toSafeUser(newUser);
  }
  return findOrCreateOAuthUserMongo(profile);
}

/**
 * Request password reset - generates token and saves to user
 * @param {string} email
 * @returns {Promise<{ok: boolean, resetUrl?: string}>}
 */
export async function requestPasswordReset(email) {
  if (!USE_MONGODB) {
    return { ok: true };
  }
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

/**
 * Reset password with token
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function resetPassword(token, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters" };
  }
  if (!USE_MONGODB) {
    return { ok: false, error: "Password reset is not available. Please use MongoDB." };
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

async function findOrCreateOAuthUserMongo(profile) {
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
