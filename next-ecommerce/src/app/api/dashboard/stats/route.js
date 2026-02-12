/**
 * User Dashboard Stats - Total sales, orders, items (from user's orders)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { USE_MONGODB } from "@/lib/config";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !session?.user?.email) {
    return NextResponse.json({
      totalSales: "0 tk",
      orders: 0,
      products: 0,
      pendingCount: 0,
      cancelledCount: 0,
      recentActivities: [],
    });
  }

  try {
    if (USE_MONGODB) {
      await connectDB();
      const query = session.user.id
        ? { $or: [{ userId: session.user.id }, { customerEmail: session.user.email }] }
        : { customerEmail: session.user.email };
      const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

      const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const totalItems = orders.reduce((sum, o) => {
        const qty = o.items?.reduce((s, i) => s + (i.quantity || 0), 0) || 0;
        return sum + qty;
      }, 0);

      const pendingCount = orders.filter((o) => (o.status || "").toLowerCase() === "pending").length;
      const cancelledCount = orders.filter((o) => (o.status || "").toLowerCase() === "cancelled").length;

      const recentActivities = orders.slice(0, 5).map((o) => ({
        id: o._id?.toString(),
        fullId: o._id?.toString(),
        desc: `Order #${String(o._id).slice(-6)} - ${o.status}`,
        amount: formatCurrency(o.total),
        status: o.status,
      }));

      return NextResponse.json({
        totalSales: formatCurrency(totalSales),
        orders: orders.length,
        products: totalItems,
        pendingCount,
        cancelledCount,
        recentActivities,
      });
    }
  } catch (err) {
    console.error("Dashboard stats:", err);
  }

  return NextResponse.json({
    totalSales: "0 tk",
    orders: 0,
    products: 0,
    pendingCount: 0,
    cancelledCount: 0,
    recentActivities: [],
  });
}
