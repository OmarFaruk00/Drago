/**
 * Admin Trends API - Sales and Orders over time for charts
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/adminAuth";
import { mockOrders } from "@/lib/data/orders";
import { USE_MONGODB } from "@/lib/config";

function getTrendsFromOrders(orders) {
  const byDate = {};
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    last7.push(key);
    byDate[key] = { date: key, orders: 0, revenue: 0 };
  }
  orders.forEach((o) => {
    const raw = o.createdAt || o.created_at;
    const key = raw ? new Date(raw).toISOString().split("T")[0] : null;
    if (key && byDate[key] !== undefined) {
      byDate[key].orders += 1;
      byDate[key].revenue += o.total || 0;
    }
  });
  return last7.map((d) => ({
    date: d,
    orders: byDate[d]?.orders ?? 0,
    revenue: byDate[d]?.revenue ?? 0,
  }));
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const orders = await Order.find({ createdAt: { $gte: weekAgo } })
        .lean()
        .then((list) =>
          list.map((o) => ({
            ...o,
            createdAt: o.createdAt?.toISOString?.()?.split("T")[0],
          }))
        );
      const trends = getTrendsFromOrders(orders);
      return NextResponse.json({ trends });
    }

    const trends = getTrendsFromOrders(mockOrders);
    return NextResponse.json({ trends });
  } catch (err) {
    console.error("Admin trends GET:", err);
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}
