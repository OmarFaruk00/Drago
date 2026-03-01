/**
 * Seed testimonials into MongoDB
 * Run: node scripts/seed-testimonials.mjs
 * Requires MONGODB_URI in .env.local
 */

import "dotenv/config";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const testimonials = [
  { name: "Sarah Ahmed", role: "Customer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", text: "Amazing quality products and fast delivery. Will definitely order again!", rating: 5, order: 0 },
  { name: "Rahim Khan", role: "Customer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", text: "Best e-commerce experience in Bangladesh. Highly recommended for electronics.", rating: 5, order: 1 },
  { name: "Fatima Rahman", role: "Customer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", text: "Great customer service and competitive prices. Love shopping here!", rating: 5, order: 2 },
];

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "Customer" },
  avatar: { type: String, default: "" },
  text: { type: String, required: true },
  rating: { type: Number, default: 5 },
  order: { type: Number, default: 0 },
  status: { type: String, default: "active" },
}, { timestamps: true });

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", schema);

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set. Add it to .env.local");
    process.exit(1);
  }
  await mongoose.connect(uri);
  await Testimonial.deleteMany({});
  await Testimonial.insertMany(testimonials);
  console.log(`Seeded ${testimonials.length} testimonials.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
