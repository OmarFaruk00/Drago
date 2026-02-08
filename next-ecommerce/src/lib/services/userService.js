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
 * Login user by email and password
 * @param {string} email
 * @param {string} password (plain - in production compare with bcrypt hash)
 * @returns {Promise<Object|null>} User without password, or null
 */
export async function loginUser(email, password) {
  if (!USE_MONGODB) {
    return loginUserFromDummy(email, password);
  }
  return loginUserFromMongo(email, password);
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
function loginUserFromDummy(email, password) {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  return user ? toSafeUser(user) : null;
}

function registerUserFromDummy(data) {
  const { email, password, name } = data;
  if (mockUsers.find((u) => u.email === email)) return null;
  const newUser = {
    id: `u${mockUsers.length + 1}`,
    email,
    name: name || "User",
    role: "user",
    createdAt: new Date().toISOString().split("T")[0],
  };
  return toSafeUser({ ...newUser, password });
}

// --- MongoDB implementation ---
async function loginUserFromMongo(email, password) {
  const conn = await connectDB();
  if (!conn) return loginUserFromDummy(email, password);

  const User = (await import("@/lib/models/User")).default;
  const user = await User.findOne({ email }).select("+password").lean();
  if (!user) return null;

  // TODO: When bcrypt is added, use: user.comparePassword(password)
  if (user.password !== password) return null;

  return toSafeUser(user);
}

async function registerUserFromMongo(data) {
  const conn = await connectDB();
  if (!conn) return registerUserFromDummy(data);

  const User = (await import("@/lib/models/User")).default;
  const exists = await User.findOne({ email: data.email }).lean();
  if (exists) return null;

  const user = await User.create({
    email: data.email,
    password: data.password,
    name: data.name || "User",
    role: "user",
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
