/**
 * Seed Categories - MongoDB এ ক্যাটাগরি ঢুকাতে
 * Run: npm run seed:categories
 * .env.local এ MONGODB_URI থাকতে হবে
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import { mockCategories } from "../src/lib/data/adminCategories.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/drago-store";

const sampleCategories = [
  { name: "Electronics", slug: "electronics", image: "", status: "active" },
  { name: "Fashion", slug: "fashion", image: "", status: "active" },
  { name: "Home", slug: "home", image: "", status: "active" },
];

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

    const data = mockCategories.length > 0 ? mockCategories.map(({ id, ...c }) => c) : sampleCategories;
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
