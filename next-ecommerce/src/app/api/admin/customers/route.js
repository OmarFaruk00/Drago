/**
 * Admin Customers API - List with order stats (requires admin JWT)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/adminAuth";
import { mockUsers } from "@/lib/data/users";
import { mockOrders } from "@/lib/data/orders";
import { USE_MONGODB } from "@/lib/config";

function enrichWithOrderStats(users, orders) {
  const byEmail = {};
  orders.forEach((o) => {
    const email = (o.customerEmail || "").toLowerCase();
    if (!byEmail[email]) byEmail[email] = { count: 0, total: 0 };
    byEmail[email].count += 1;
    byEmail[email].total += o.total || 0;
  });
  return users.map((u) => {
    const email = (u.email || "").toLowerCase();
    const stats = byEmail[email] || { count: 0, total: 0 };
    return {
      ...u,
      ordersCount: stats.count,
      totalSpent: stats.total,
      status: u.isActive !== false ? "active" : "blocked",
      phone: u.phone || "",
    };
  });
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      const [users, orders] = await Promise.all([
        User.find().select("-password").lean(),
        Order.find().lean(),
      ]);
      const list = users
        .filter((u) => u.role !== "admin")
        .map((u) => ({ ...u, id: u._id?.toString(), _id: undefined, __v: undefined }));
      const enriched = enrichWithOrderStats(list, orders);
      return NextResponse.json(enriched);
    }

    const list = mockUsers
      .filter((u) => u.role !== "admin")
      .map(({ password, ...u }) => ({ ...u, password: undefined }));
    const enriched = enrichWithOrderStats(list, mockOrders);
    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Admin customers GET:", err);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
