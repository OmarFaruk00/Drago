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
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              href={`/products/${item.id}`}
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0"
            >
              <Image
                src={item.image || "https://via.placeholder.com/56"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.id}`}
                className="text-sm font-medium text-gray-900 hover:text-brand line-clamp-1"
              >
                {item.name}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-gray-500">Price: </span>
                <span className="text-gray-900 font-medium">{formatCurrency(item.price || 0)}</span>
              </div>
              <div>
                <span className="text-gray-500">Qty: </span>
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
