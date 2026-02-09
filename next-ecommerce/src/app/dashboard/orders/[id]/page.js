"use client";

/**
 * Order Details - Timeline, items, address, total
 */

import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { orderDetails } from "@/lib/data/dashboard";

const steps = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrderDetailsPage() {
  const params = useParams();
  const order = orderDetails;

  const statusIndex = steps.findIndex((s) => s.toLowerCase() === order.status);

  return (
    <div>
      <Link href="/dashboard/orders" className="text-sm text-red-600 hover:underline mb-4 inline-block">
        ← Back to Orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  i <= statusIndex ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <p className="text-xs mt-1 text-gray-600">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <h2 className="px-4 py-3 font-semibold border-b">Order Items</h2>
        <div className="divide-y">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 p-4">
              <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`} className="font-medium text-gray-900 hover:text-red-600">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-red-600">৳{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Total */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-sm text-gray-600">{order.shipping}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold mb-2">Total</h3>
          <p className="text-xl font-bold text-red-600">৳{order.total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
