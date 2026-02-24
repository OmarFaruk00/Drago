/**
 * Validate coupon for checkout - public API
 * POST { code, customerEmail, subtotal }
 * Returns { valid, message, discount, freeShipping, couponId, type } or { valid: false, message }
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Coupon from "@/lib/models/Coupon";
import { USE_MONGODB } from "@/lib/config";

export async function POST(request) {
  try {
    const body = await request.json();
    const code = (body.code || "").trim().toUpperCase();
    const customerEmail = (body.customerEmail || "").trim().toLowerCase();
    const subtotal = Number(body.subtotal) || 0;

    if (!code) {
      return NextResponse.json({ valid: false, message: "Coupon code is required" }, { status: 400 });
    }

    if (USE_MONGODB) {
      await connectDB();
      const coupon = await Coupon.findOne({ code }).lean();
      if (!coupon) {
        return NextResponse.json({ valid: false, message: "Invalid or expired coupon code" });
      }

      const now = new Date();
      const start = new Date(coupon.startDate);
      const end = new Date(coupon.endDate);
      if (now < start) {
        return NextResponse.json({ valid: false, message: "This coupon is not yet active" });
      }
      if (now > end) {
        return NextResponse.json({ valid: false, message: "This coupon has expired" });
      }

      const totalLimit = coupon.totalUsageLimit != null ? Number(coupon.totalUsageLimit) : null;
      const usageCount = Number(coupon.usageCount) || 0;
      if (totalLimit != null && usageCount >= totalLimit) {
        return NextResponse.json({ valid: false, message: "This coupon has reached its usage limit" });
      }

      if (coupon.allowedForCustomerEmail) {
        const allowedEmail = (coupon.allowedForCustomerEmail || "").toLowerCase().trim();
        if (!customerEmail) {
          return NextResponse.json({
            valid: false,
            message: "Please enter your email to use this coupon",
          });
        }
        if (customerEmail !== allowedEmail) {
          return NextResponse.json({
            valid: false,
            message: "This coupon is not valid for your account",
          });
        }
      }

      let discount = 0;
      let freeShipping = false;
      if (coupon.type === "free_shipping") {
        freeShipping = true;
      } else if (coupon.type === "percentage") {
        const pct = Math.min(100, Math.max(0, Number(coupon.discountValue) || 0));
        discount = Math.round((subtotal * pct) / 100);
      } else {
        discount = Math.min(subtotal, Math.round(Number(coupon.discountValue) || 0));
      }

      return NextResponse.json({
        valid: true,
        message: freeShipping ? "Free delivery applied" : "Discount applied",
        discount,
        freeShipping,
        couponId: coupon._id?.toString(),
        type: coupon.type,
        discountValue: coupon.discountValue,
        name: coupon.name,
      });
    }

    return NextResponse.json({ valid: false, message: "Coupon service unavailable" });
  } catch (err) {
    console.error("Coupon validate:", err);
    return NextResponse.json({ valid: false, message: "Something went wrong" }, { status: 500 });
  }
}
