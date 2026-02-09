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
      return NextResponse.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      });
    }

    return NextResponse.json({
      totalUsers: mockUsers.length,
      totalProducts: products.length,
      totalOrders: mockOrders.length,
      totalRevenue: mockOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    });
  } catch (err) {
    console.error("Admin stats GET:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
