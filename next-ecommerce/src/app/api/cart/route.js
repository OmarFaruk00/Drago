/**
 * API Route: /api/cart
 * GET - Returns cart for userId or sessionId (MongoDB only)
 * POST - Add/update cart item (MongoDB only)
 * When MONGODB_URI is not set, cart is client-side (Zustand) only
 */

import { NextResponse } from "next/server";
import { getCart, addToCart } from "@/lib/services/cartService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const sessionId = searchParams.get("sessionId") || undefined;

    const result = await getCart({ userId, sessionId });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, sessionId, item } = body;

    if (!item?.productId && !item?.id) {
      return NextResponse.json(
        { error: "Item (productId, name, price) required" },
        { status: 400 }
      );
    }

    const result = await addToCart(
      { userId, sessionId },
      {
        productId: item.productId || item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity || 1,
      }
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
