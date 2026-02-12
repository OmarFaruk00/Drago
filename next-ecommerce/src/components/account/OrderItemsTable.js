"use client";

/**
 * OrderItemsTable - Ordered products as card layout, each item in its own card
 */

import Image from "next/image";
import Link from "next/link";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";

export default function OrderItemsTable({ items = [] }) {
  const formatCurrency = useFormatCurrency();

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Order Items</h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <Link
              href={`/products/${item.id}`}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
            >
              <Image
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.id}`}
                className="font-medium text-gray-900 hover:text-brand"
              >
                {item.name}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500">Price: </span>
                <span className="text-gray-900 font-medium">{formatCurrency(item.price || 0)}</span>
              </div>
              <div>
                <span className="text-gray-500">Quantity: </span>
                <span className="text-gray-900 font-medium">×{item.quantity || 1}</span>
              </div>
              <div>
                <span className="text-gray-500">Subtotal: </span>
                <span className="text-gray-900 font-semibold">
                  {formatCurrency((item.price || 0) * (item.quantity || 1))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
