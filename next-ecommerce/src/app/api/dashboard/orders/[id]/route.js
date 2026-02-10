/**
 * Get single order - only if it belongs to current user
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import { authOptions } from "@/lib/auth";
import { USE_MONGODB } from "@/lib/config";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

  try {
    if (USE_MONGODB) {
      await connectDB();
      const order = await Order.findById(id).lean();
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

      const isOwner =
        (order.userId && String(order.userId) === session.user.id) ||
        order.customerEmail === session.user.email;
      if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

      const items = (order.items || []).map((i) => ({
        id: i.productId,
        name: i.name,
        price: i.price,
        image: i.image || "/placeholder.png",
        quantity: i.quantity,
      }));

      return NextResponse.json({
        id: String(order._id).slice(-6),
        fullId: order._id?.toString(),
        date: new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
        status: order.status,
        items,
        shipping: order.shippingAddress || "",
        total: order.total,
      });
    }
  } catch (err) {
    console.error("Order GET:", err);
  }
  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}
