/**
 * Seed Coupons - MongoDB এ কুপন ঢুকাতে
 * Run: npm run seed:coupons
 * .env.local এ MONGODB_URI থাকতে হবে
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../.env.local") });

import mongoose from "mongoose";
import { mockCoupons } from "../src/lib/data/coupons.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/drago-store";

const now = new Date();
const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
const sampleCoupons = [
  { name: "WELCOME10", code: "WELCOME10", type: "fixed", discountValue: 10, discountUnit: "amount", description: "New customer 10 tk off", totalUsageLimit: 100, usagePerCustomer: 1, usageCount: 0, startDate: now, endDate: nextYear },
  { name: "FREESHIP", code: "FREESHIP", type: "free_shipping", discountValue: 0, discountUnit: "amount", description: "Free delivery", totalUsageLimit: 500, usagePerCustomer: 5, usageCount: 0, startDate: now, endDate: nextYear },
];

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["fixed", "percentage", "free_shipping", "price_discount"], default: "fixed" },
    discountValue: { type: Number, required: true },
    discountUnit: { type: String, enum: ["percent", "amount"], default: "amount" },
    description: { type: String, default: "" },
    totalUsageLimit: { type: Number, default: null },
    usagePerCustomer: { type: Number, default: null },
    usageCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.models?.Coupon || mongoose.model("Coupon", couponSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const raw = mockCoupons.length > 0 ? mockCoupons : sampleCoupons;
    const data = raw.map(({ id, status, ...c }) => ({
      ...c,
      startDate: c.startDate instanceof Date ? c.startDate : new Date(c.startDate),
      endDate: c.endDate instanceof Date ? c.endDate : new Date(c.endDate),
    }));
    await Coupon.deleteMany({});
    await Coupon.insertMany(data);
    console.log(`Seeded ${data.length} coupons`);
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
