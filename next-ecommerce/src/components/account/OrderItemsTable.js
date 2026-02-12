"use client";

/**
 * OrderItemsTable - Ordered products with image, price, quantity, subtotal
 */

import Image from "next/image";
import Link from "next/link";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";

export default function OrderItemsTable({ items = [] }) {
  const formatCurrency = useFormatCurrency();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <h3 className="text-base font-semibold text-gray-900 px-6 py-4 border-b border-gray-100">
        Order Items
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/products/${item.id}`}
                      className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                    >
                      <Image
                        src={item.image || "https://via.placeholder.com/56"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </Link>
                    <Link
                      href={`/products/${item.id}`}
                      className="font-medium text-gray-900 hover:text-red-600"
                    >
                      {item.name}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">{formatCurrency(item.price || 0)}</td>
                <td className="px-6 py-4 text-gray-900">×{item.quantity || 1}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {formatCurrency((item.price || 0) * (item.quantity || 1))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
