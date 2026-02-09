/**
 * Admin Customer by ID - full profile with order history
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/adminAuth";
import { mockUsers } from "@/lib/data/users";
import { mockOrders } from "@/lib/data/orders";
import { USE_MONGODB } from "@/lib/config";

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const id = params.id;
  try {
    if (USE_MONGODB) {
      await connectDB();
      let user = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id).select("-password").lean();
      }
      if (!user) {
        const byEmail = await User.findOne({ email: id }).select("-password").lean();
        user = byEmail;
      }
      if (!user) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

      const orders = await Order.find({ customerEmail: user.email })
        .sort({ createdAt: -1 })
        .lean();
      const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

      return NextResponse.json({
        ...user,
        id: user._id?.toString(),
        _id: undefined,
        __v: undefined,
        ordersCount: orders.length,
        totalSpent,
        orders: orders.map((o) => ({
          id: o._id?.toString(),
          ...o,
          _id: undefined,
          __v: undefined,
        })),
      });
    }

    const user = mockUsers.find((u) => u.id === id || u.email === id);
    if (!user || user.role === "admin") {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    const customerOrders = mockOrders.filter(
      (o) => (o.customerEmail || "").toLowerCase() === (user.email || "").toLowerCase()
    );
    const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    return NextResponse.json({
      ...user,
      password: undefined,
      ordersCount: customerOrders.length,
      totalSpent,
      orders: customerOrders,
    });
  } catch (err) {
    console.error("Admin customer GET:", err);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}
