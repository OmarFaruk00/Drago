/**
 * Public API: GET /api/testimonials
 * Returns testimonials for "What Our Customers Say" section.
 * Uses MongoDB when available, otherwise dummy fallback.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import { USE_MONGODB } from "@/lib/config";

const DUMMY_TESTIMONIALS = [
  { id: "1", name: "Sarah Ahmed", role: "Customer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", text: "Amazing quality products and fast delivery. Will definitely order again!", rating: 5 },
  { id: "2", name: "Rahim Khan", role: "Customer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", text: "Best e-commerce experience in Bangladesh. Highly recommended for electronics.", rating: 5 },
  { id: "3", name: "Fatima Rahman", role: "Customer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", text: "Great customer service and competitive prices. Love shopping here!", rating: 5 },
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (USE_MONGODB) {
      await connectDB();
      const list = await Testimonial.find({ status: "active" })
        .sort({ order: 1, createdAt: -1 })
        .limit(12)
        .lean();
      if (list.length > 0) {
        const items = list.map((t) => ({
          id: t._id?.toString(),
          name: t.name,
          role: t.role || "Customer",
          avatar: t.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          text: t.text,
          rating: Math.min(5, Math.max(1, t.rating || 5)),
        }));
        const res = NextResponse.json(items);
        res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
        return res;
      }
    }
    return NextResponse.json(DUMMY_TESTIMONIALS);
  } catch (err) {
    console.error("Testimonials GET:", err);
    return NextResponse.json(DUMMY_TESTIMONIALS);
  }
}
