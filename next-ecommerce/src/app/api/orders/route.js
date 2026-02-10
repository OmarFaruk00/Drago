/**
 * Customer Orders API - Create order (checkout) + Get user's orders
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import { authOptions } from "@/lib/auth";
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
        orders.map((o) => ({
          id: o._id?.toString(),
          ...o,
          _id: undefined,
          __v: undefined,
        }))
      );
    }
  } catch (err) {
    console.error("Orders GET:", err);
  }
  return NextResponse.json([]);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, items, total, shippingAddress } = body;

    if (!customerName || !customerEmail || !items?.length || total == null) {
      return NextResponse.json(
        { error: "Customer name, email, and items are required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    if (USE_MONGODB) {
      await connectDB();
      const orderItems = items.map((i) => ({
        productId: i.id || i.productId,
        name: i.name,
        price: i.price,
        image: i.image || "",
        quantity: i.quantity || 1,
      }));

      const order = await Order.create({
        customerName,
        customerEmail,
        userId: userId || undefined,
        items: orderItems,
        total: Number(total),
        status: "pending",
        shippingAddress: shippingAddress || "",
      });

      const o = order.toObject();
      return NextResponse.json({
        id: o._id?.toString(),
        ...o,
        _id: undefined,
        __v: undefined,
      });
    }

    return NextResponse.json({ id: "mock1", status: "pending" });
  } catch (err) {
    console.error("Orders POST:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
