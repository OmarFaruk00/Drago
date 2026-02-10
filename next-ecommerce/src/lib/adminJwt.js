/**
 * Admin JWT - lightweight, no NextAuth/userService dependencies
 * Used by admin login, adminAuth, and admin API routes
 */

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "drago-store-secret-key-change-in-production";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
