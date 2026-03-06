/**
 * Public API: GET /api/flash-sale
 * Returns { active, startTime, endTime, productIds, products }.
 * active = true when endTime is set, now <= endTime, and (no startTime or now >= startTime). Start time is optional.
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import FlashSaleSettings from "@/lib/models/FlashSaleSettings";
import { getProductsByIds } from "@/lib/services/productService";
import { USE_MONGODB } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (!USE_MONGODB) {
      return NextResponse.json({ active: false, startTime: null, endTime: null, productIds: [], products: [] });
    }
    await connectDB();
    const doc = await FlashSaleSettings.findOne().lean();
    if (!doc) {
      return NextResponse.json({ active: false, startTime: null, endTime: null, productIds: [], products: [] });
    }
    const startTime = doc.startTime ? new Date(doc.startTime).getTime() : null;
    const endTime = doc.endTime ? new Date(doc.endTime).getTime() : null;
    const now = Date.now();
    // End time required; start optional (if not set, sale is "already started")
    const active =
      endTime != null &&
      now <= endTime &&
      (startTime == null || now >= startTime);
    const productIds = (Array.isArray(doc.productIds) ? doc.productIds : [])
      .map((id) => (typeof id === "string" ? id : id?.toString?.()))
      .filter(Boolean);

    if (!active || productIds.length === 0) {
      return NextResponse.json({
        active: false,
        startTime: startTime,
        endTime: endTime,
        productIds: [],
        products: [],
      });
    }

    const products = await getProductsByIds(productIds);
    return NextResponse.json({
      active: true,
      startTime: startTime,
      endTime: endTime,
      productIds,
      products,
    });
  } catch (err) {
    console.error("Flash sale GET:", err);
    return NextResponse.json({ active: false, startTime: null, endTime: null, productIds: [], products: [] });
  }
}
