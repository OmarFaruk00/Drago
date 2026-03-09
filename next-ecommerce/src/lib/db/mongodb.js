/**
 * MongoDB connection utility for Next.js
 * Uses cached connection to avoid creating new connections on each API request
 * (Next.js serverless can spin up new instances - reusing connection is critical)
 *
 * Set MONGODB_URI in .env.local to enable:
 * MONGODB_URI=mongodb://localhost:27017/drago-store
 * or: mongodb+srv://user:pass@cluster.mongodb.net/drago-store
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Cache the connection in dev to prevent multiple connections during hot reload
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    return null;
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 20,
    });
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e.message);
    return null;
  }
}

export default connectDB;
