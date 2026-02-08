"use client";

/**
 * CartItem - Single item in cart display
 * Shows image, name, price, quantity controls, remove
 */

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useStore();

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Image */}
      <Link href={`/products/${item.id}`} className="flex-shrink-0 w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </Link>
      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.id}`} className="font-medium text-gray-900 hover:text-red-600 line-clamp-2">
          {item.name}
        </Link>
        <p className="text-red-600 font-bold mt-1">{formatCurrency(item.price * item.quantity)}</p>
        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
          >
            +
          </button>
          <button
            onClick={() => removeFromCart(item.id)}
            className="ml-2 text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
