/**
 * Seed script - Populate MongoDB with dummy products
 * Run: npm run seed
 * Loads MONGODB_URI from .env.local
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import { products } from "../src/lib/data/products.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/drago-store";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: null },
    image: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Product = mongoose.models?.Product || mongoose.model("Product", productSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const data = products.map(({ id, ...p }) => p);
    await Product.deleteMany({});
    await Product.insertMany(data);
    console.log(`Seeded ${data.length} products`);
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
