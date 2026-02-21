/**
 * Admin Order by ID - GET, PUT (update status)
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/adminAuth";
import { mockOrders } from "@/lib/data/orders";
import { USE_MONGODB } from "@/lib/config";

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    if (USE_MONGODB) {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
      const order = await Order.findById(id).lean();
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.json({
        id: order._id?.toString(),
        ...order,
        _id: undefined,
        __v: undefined,
      });
    }

    const order = mockOrders.find((o) => o.id === id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error("Admin order GET:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    const body = await request.json();
    const { status } = body;
    const valid = ["pending", "confirmed", "processing", "shipping", "shipped", "delivered", "cancelled", "return", "hold"];
    if (status && !valid.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (USE_MONGODB) {
      await connectDB();
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
      const update = {};
      if (status) update.status = status;
      const order = await Order.findByIdAndUpdate(id, update, { new: true }).lean();
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.json({
        id: order._id?.toString(),
        ...order,
        _id: undefined,
        __v: undefined,
      });
    }

    const order = mockOrders.find((o) => o.id === id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (status) order.status = status;
    return NextResponse.json(order);
  } catch (err) {
    console.error("Admin order PUT:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
