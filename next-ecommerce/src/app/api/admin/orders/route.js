/**
 * Admin Orders API - CRUD (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/adminAuth";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!USE_MONGODB) return NextResponse.json([]);

  try {
    await connectDB();
    const list = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      list.map((o) => ({
        id: o._id?.toString(),
        ...o,
        _id: undefined,
        __v: undefined,
      }))
    );
  } catch (err) {
    console.error("Admin orders GET:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { customerName, customerEmail, items, total, status } = body;
    if (!customerName || !customerEmail || !items?.length || total == null) {
      return NextResponse.json(
        { error: "Customer name, email, items, and total are required" },
        { status: 400 }
      );
    }

    if (!USE_MONGODB) {
      return NextResponse.json(
        { error: "Database required to create orders." },
        { status: 503 }
      );
    }
    await connectDB();
    const order = await Order.create({
      customerName,
      customerEmail,
      items,
      total,
      status: status || "pending",
    });
    const o = order.toObject();
    return NextResponse.json({
      id: o._id?.toString(),
      ...o,
      _id: undefined,
      __v: undefined,
    });
  } catch (err) {
    console.error("Admin orders POST:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
