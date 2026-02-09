/**
 * Seed Coupons for MongoDB
 * Run: MONGODB_URI=mongodb://localhost:27017/drago-store node scripts/seed-coupons.mjs
 */

import mongoose from "mongoose";
import { mockCoupons } from "../src/lib/data/coupons.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/drago-store";

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

    const data = mockCoupons.map(({ id, status, ...c }) => ({
      ...c,
      startDate: new Date(c.startDate),
      endDate: new Date(c.endDate),
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
