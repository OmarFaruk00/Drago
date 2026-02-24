/**
 * Seed Products - MongoDB এ প্রোডাক্ট ঢুকাতে
 * Run: npm run seed
 * .env.local এ MONGODB_URI থাকতে হবে
 *
 * নিচের sampleProducts দিয়ে কয়েকটা প্রোডাক্ট ঢুকবে। নিজের প্রোডাক্ট চাইলে এই অ্যারে এডিট করুন অথবা অ্যাডমিন প্যানেল থেকে যোগ করুন।
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import { products } from "../src/lib/data/products.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/drago-store";

// সিড স্ক্রিপ্টের নিজস্ব স্টার্টার ডেটা (ডাটা ফাইল খালি থাকলেও এগুলো ঢুকবে)
const sampleProducts = [
  { name: "Sample Product 1", price: 299, originalPrice: 399, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", category: "Electronics", rating: 4.5, reviewCount: 0, inStock: true, description: "First sample product." },
  { name: "Sample Product 2", price: 499, originalPrice: 599, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", category: "Electronics", rating: 4, reviewCount: 0, inStock: true, description: "Second sample product." },
];

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

    const data = products.length > 0 ? products.map(({ id, ...p }) => p) : sampleProducts;
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
