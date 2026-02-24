/**
 * Cart Service - Abstraction layer for cart data
 * Currently: client-side cart via Zustand (no server cart for dummy mode)
 * When MongoDB is connected: can sync cart per userId or sessionId
 *
 * API structure is ready for:
 * - GET /api/cart?userId=xxx or ?sessionId=xxx
 * - POST /api/cart - add/update items
 * - DELETE /api/cart/:itemId - remove item
 */

import { USE_MONGODB } from "@/lib/config";
import connectDB from "@/lib/db/mongodb";

/**
 * Get cart for user or session
 * @param {Object} options - { userId, sessionId }
 * @returns {Promise<Object>} { items, subtotal }
 */
export async function getCart(options = {}) {
  if (!USE_MONGODB) return { items: [], subtotal: 0 };
  return getCartFromMongo(options);
}

/**
 * Add or update item in cart
 * @param {Object} options - { userId, sessionId }
 * @param {Object} item - { productId, name, price, image, quantity }
 */
export async function addToCart(options, item) {
  if (!USE_MONGODB) return { success: true, items: [], subtotal: 0 };
  return addToCartFromMongo(options, item);
}

/**
 * Remove item from cart
 */
export async function removeFromCart(options, productId) {
  if (!USE_MONGODB) return { success: true };
  return removeFromCartFromMongo(options, productId);
}

/**
 * Clear cart
 */
export async function clearCart(options) {
  if (!USE_MONGODB) {
    return { success: true };
  }
  return clearCartFromMongo(options);
}

// --- MongoDB implementation ---
async function getCartFromMongo(options) {
  const conn = await connectDB();
  if (!conn) return { items: [], subtotal: 0 };

  const Cart = (await import("@/lib/models/Cart")).default;
  const mongoose = await import("mongoose");

  const query = {};
  if (options.userId) query.userId = new mongoose.Types.ObjectId(options.userId);
  else if (options.sessionId) query.sessionId = options.sessionId;
  else return { items: [], subtotal: 0 };

  let cart = await Cart.findOne(query).populate("items.product", "name price image").lean();
  if (!cart) {
    cart = await Cart.create({ ...query, items: [] });
  }

  const items = (cart.items || []).map((i) => ({
    id: i.product?._id?.toString() || i.product,
    name: i.name || i.product?.name,
    price: i.price || i.product?.price,
    image: i.image || i.product?.image,
    quantity: i.quantity,
  }));
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return { items, subtotal };
}

async function addToCartFromMongo(options, item) {
  const conn = await connectDB();
  if (!conn) return { success: true, items: [], subtotal: 0 };

  const Cart = (await import("@/lib/models/Cart")).default;
  const mongoose = await import("mongoose");

  const query = {};
  if (options.userId) query.userId = new mongoose.Types.ObjectId(options.userId);
  else if (options.sessionId) query.sessionId = options.sessionId;
  else return { success: false };

  let cart = await Cart.findOne(query);
  if (!cart) cart = await Cart.create(query);

  const productIdObj = mongoose.Types.ObjectId.isValid(item.productId)
    ? new mongoose.Types.ObjectId(item.productId)
    : item.productId;
  const existing = cart.items.find(
    (i) => i.product?.toString() === String(item.productId)
  );
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.items.push({
      product: productIdObj,
      name: item.name,
      price: item.price,
      image: item.image || "",
      quantity: item.quantity || 1,
    });
  }
  await cart.save();
  return { success: true };
}

async function removeFromCartFromMongo(options, productId) {
  const conn = await connectDB();
  if (!conn) return { success: true };

  const Cart = (await import("@/lib/models/Cart")).default;
  const query = {};
  if (options.userId) query.userId = options.userId;
  else if (options.sessionId) query.sessionId = options.sessionId;
  else return { success: true };

  await Cart.updateOne(query, { $pull: { items: { product: productId } } });
  return { success: true };
}

async function clearCartFromMongo(options) {
  const conn = await connectDB();
  if (!conn) return { success: true };

  const Cart = (await import("@/lib/models/Cart")).default;
  const query = {};
  if (options.userId) query.userId = options.userId;
  else if (options.sessionId) query.sessionId = options.sessionId;
  else return { success: true };

  await Cart.updateOne(query, { $set: { items: [] } });
  return { success: true };
}
