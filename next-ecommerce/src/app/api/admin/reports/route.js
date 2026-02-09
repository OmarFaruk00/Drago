/**
 * Admin Reports API - Analytics data for charts
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { requireAdmin } from "@/lib/adminAuth";
import { mockOrders } from "@/lib/data/orders";
import { products } from "@/lib/data/products";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    let orders = [];
    let productList = [];

    if (USE_MONGODB) {
      await connectDB();
      orders = await Order.find().lean();
      productList = await Product.find().lean();
    } else {
      orders = [...mockOrders];
      productList = products.map((p) => ({ ...p, category: p.category }));
    }

    // Monthly sales (last 6 months)
    const monthly = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = { month: key, sales: 0, orders: 0 };
    }
    orders.forEach((o) => {
      const raw = o.createdAt || o.created_at;
      const d = raw ? new Date(raw) : new Date();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthly[key]) {
        monthly[key].sales += o.total || 0;
        monthly[key].orders += 1;
      }
    });
    const monthlySales = Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month));

    // Daily orders (last 7 days)
    const daily = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      daily[key] = { date: key, orders: 0, revenue: 0 };
    }
    orders.forEach((o) => {
      const raw = o.createdAt || o.created_at;
      const key = raw ? new Date(raw).toISOString().split("T")[0] : null;
      if (key && daily[key]) {
        daily[key].orders += 1;
        daily[key].revenue += o.total || 0;
      }
    });
    const dailyOrders = Object.values(daily).sort((a, b) => a.date.localeCompare(b.date));

    // Revenue by category (from order items - we'd need product category, simplify: use product list)
    const byCategory = {};
    productList.forEach((p) => {
      const cat = p.category || "Other";
      if (!byCategory[cat]) byCategory[cat] = { name: cat, value: 0, count: 0 };
      byCategory[cat].count += 1;
      byCategory[cat].value += (p.price || 0) * (p.stockQuantity ?? 1); // rough estimate
    });
    const revenueByCategory = Object.values(byCategory).map((c) => ({
      name: c.name,
      value: Math.round(c.value),
      count: c.count,
    }));

    // Order status distribution
    const byStatus = {};
    orders.forEach((o) => {
      const s = o.status || "pending";
      byStatus[s] = (byStatus[s] || 0) + 1;
    });
    const orderStatusDistribution = Object.entries(byStatus).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json({
      monthlySales,
      dailyOrders,
      revenueByCategory,
      orderStatusDistribution,
    });
  } catch (err) {
    console.error("Admin reports GET:", err);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
