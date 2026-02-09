/**
 * Seed Categories for MongoDB
 * Run: npm run seed:categories
 * Loads MONGODB_URI from .env.local
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import { mockCategories } from "../src/lib/data/adminCategories.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/drago-store";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, trim: true },
    image: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const Category = mongoose.models?.Category || mongoose.model("Category", categorySchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const data = mockCategories.map(({ id, ...c }) => c);
    await Category.deleteMany({});
    await Category.insertMany(data);
    console.log(`Seeded ${data.length} categories`);
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
