/**
 * User's Orders - For dashboard order history
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
    return NextResponse.json([]);
  }

  try {
    if (USE_MONGODB) {
      await connectDB();
      const query = session.user.id
        ? { $or: [{ userId: session.user.id }, { customerEmail: session.user.email }] }
        : { customerEmail: session.user.email };
      const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

      return NextResponse.json(
        orders.map((o) => {
          const itemCount = o.items?.reduce((s, i) => s + (i.quantity || 0), 0) || 0;
          return {
            id: String(o._id).slice(-6),
            fullId: o._id?.toString(),
            customer: o.customerName,
            date: new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            total: `${formatCurrency(o.total)} (${itemCount} Product${itemCount !== 1 ? "s" : ""})`,
            status: o.status,
          };
        })
      );
    }
  } catch (err) {
    console.error("Dashboard orders:", err);
  }

  return NextResponse.json([]);
}
