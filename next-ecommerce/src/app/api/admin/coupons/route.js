/**
 * Admin Coupons API - GET all, POST create
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Coupon from "@/lib/models/Coupon";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

function getStatus(coupon) {
  const now = new Date();
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);
  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

export async function GET(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) return NextResponse.json([]);

  try {
    await connectDB();
    const list = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      list.map((c) => {
        const doc = { ...c, id: c._id?.toString(), _id: undefined, __v: undefined };
        doc.status = getStatus(doc);
        return doc;
      })
    );
  } catch (err) {
    console.error("Coupons GET:", err);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const {
      name,
      code,
      type,
      discountValue,
      discountUnit,
      description,
      totalUsageLimit,
      usagePerCustomer,
      allowedForCustomerEmail,
      startDate,
      endDate,
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Coupon name and code are required" },
        { status: 400 }
      );
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    if (end <= start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      type: type || "fixed",
      discountValue: Number(discountValue) || 0,
      discountUnit: discountUnit || "amount",
      description: description?.trim() || "",
      totalUsageLimit: totalUsageLimit != null ? Number(totalUsageLimit) : null,
      usagePerCustomer: usagePerCustomer != null ? Number(usagePerCustomer) : null,
      allowedForCustomerEmail: allowedForCustomerEmail ? String(allowedForCustomerEmail).trim().toLowerCase() : null,
      startDate: start,
      endDate: end,
    };

    if (!USE_MONGODB) {
      return NextResponse.json(
        { error: "Database required to manage coupons." },
        { status: 503 }
      );
    }
    await connectDB();
    const exists = await Coupon.findOne({ code: payload.code });
    if (exists) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }
    const coupon = await Coupon.create(payload);
    const doc = coupon.toObject();
    return NextResponse.json({
      ...doc,
      id: doc._id?.toString(),
      _id: undefined,
      __v: undefined,
      status: getStatus(doc),
    });
  } catch (err) {
    console.error("Coupons POST:", err);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
