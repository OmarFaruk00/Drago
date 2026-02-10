/**
 * Admin Stats API - Total users, products, orders, revenue
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/adminAuth";
import { mockUsers } from "@/lib/data/users";
import { products } from "@/lib/data/products";
import { mockOrders } from "@/lib/data/orders";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    if (USE_MONGODB) {
      await connectDB();
      const [totalUsers, totalProducts, orders] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.find().lean(),
      ]);
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const completedOrders = orders.filter((o) => o.status === "delivered").length;
      const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
      const todaySales = orders
        .filter((o) => new Date(o.createdAt) >= todayStart)
        .reduce((sum, o) => sum + (o.total || 0), 0);
      const monthlySales = orders
        .filter((o) => new Date(o.createdAt) >= monthStart)
        .reduce((sum, o) => sum + (o.total || 0), 0);
      const totalVisitors = Math.max(totalUsers * 4, totalOrders * 5, 100);
      const newVisitorsToday = Math.floor(totalUsers * 0.02) + 5;
      const conversionRate = totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(1) : 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      return NextResponse.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        todaySales,
        monthlySales,
        totalVisitors,
        newVisitorsToday,
        conversionRate: parseFloat(conversionRate),
        averageOrderValue,
        activeUsers: totalUsers,
        pctPending: 15.34,
        pctCompleted: 12.5,
        pctCancelled: -5.2,
        pctTodaySales: 22.1,
        pctMonthlySales: 18.7,
        pctTotalVisitors: 8.3,
        pctNewVisitors: 25.4,
        pctConversion: 3.1,
        pctAOV: 10.2,
        pctActiveUsers: 14.6,
      });
    }

    const orders = mockOrders;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalUsers = mockUsers.length;
    const totalProducts = products.length;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter((o) => o.status === "delivered").length;
    const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
    const todaySales = orders
      .filter((o) => new Date(o.createdAt || o.created_at) >= todayStart)
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const monthlySales = orders
      .filter((o) => new Date(o.createdAt || o.created_at) >= monthStart)
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const totalVisitors = Math.max(totalUsers * 4, totalOrders * 5, 100);
    const newVisitorsToday = Math.floor(totalUsers * 0.02) + 5;
    const conversionRate = totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(1) : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      todaySales,
      monthlySales,
      totalVisitors,
      newVisitorsToday,
      conversionRate: parseFloat(conversionRate),
      averageOrderValue,
      activeUsers: totalUsers,
      pctPending: 15.34,
      pctCompleted: 12.5,
      pctCancelled: -5.2,
      pctTodaySales: 22.1,
      pctMonthlySales: 18.7,
      pctTotalVisitors: 8.3,
      pctNewVisitors: 25.4,
      pctConversion: 3.1,
      pctAOV: 10.2,
      pctActiveUsers: 14.6,
    });
  } catch (err) {
    console.error("Admin stats GET:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
