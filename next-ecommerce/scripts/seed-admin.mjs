/**
 * Seed Admin user for MongoDB
 * Run: npm run seed:admin
 * Loads MONGODB_URI from .env.local
 * Default: admin@store.com / password123
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/drago-store";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Admin = mongoose.models?.Admin || mongoose.model("Admin", adminSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "admin@store.com";
    const password = "password123";
    const hash = await bcrypt.hash(password, 10);

    const existing = await Admin.findOne({ email }).select("+password");
    if (existing) {
      await Admin.updateOne(
        { email },
        { $set: { password: hash, name: "Admin User" } }
      );
      console.log("Updated existing admin:", email);
    } else {
      await Admin.create({
        email,
        password, // plain - pre-save will hash it
        name: "Admin User",
      });
      console.log("Created admin:", email);
    }
    console.log("Password: password123");
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
