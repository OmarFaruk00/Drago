"use server";

import { sendFacebookServerEvent } from "@/lib/tracking/server";

export async function recordAddToCartServerEvent({
  eventId,
  productId,
  value,
  currency = "USD",
}) {
  try {
    await sendFacebookServerEvent({
      eventName: "AddToCart",
      eventId,
      customData: {
        currency,
        value,
        content_ids: [productId],
        contents: [{ id: productId, quantity: 1, item_price: value }],
      },
    });
  } catch (err) {
    console.error("recordAddToCartServerEvent failed", err);
  }
}
