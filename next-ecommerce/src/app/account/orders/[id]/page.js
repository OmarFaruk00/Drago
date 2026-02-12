"use client";

/**
 * Order Details - Progress stepper, address cards, order items
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderStatusStepper from "@/components/account/OrderStatusStepper";
import OrderDetailsCard from "@/components/account/OrderDetailsCard";
import OrderItemsTable from "@/components/account/OrderItemsTable";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { getAccountOrderById } from "@/lib/data/accountOrders";

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatCurrency = useFormatCurrency();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/dashboard/orders/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error("Not found");
        return {
          ...data,
          billingAddress: data.billingAddress || {
            name: data.customerName || "Customer",
            address: data.shipping || "",
            email: data.customerEmail || "",
            phone: data.customerPhone || "",
          },
          shippingAddress: data.shippingAddress || {
            name: data.customerName || "Customer",
            address: data.shipping || "",
            email: data.customerEmail || "",
            phone: data.customerPhone || "",
          },
          orderSummary: {
            orderId: data.id || id,
            paymentMethod: data.paymentMethod || "Cash",
            subtotal: data.subtotal ?? (data.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
            discountPercent: data.discountPercent || 0,
            shipping: data.shippingCost ?? 0,
            total: data.total ?? 0,
          },
        };
      })
      .then(setOrder)
      .catch(() => setOrder(getAccountOrderById(id)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Link href="/account/orders" className="text-red-600 text-sm hover:underline mb-4 inline-block">
          ← Back to Order History
        </Link>
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  const billing = order.billingAddress || {};
  const shipping = order.shippingAddress || order.billingAddress || {};
  const summary = order.orderSummary || {};
  const items = order.items || [];

  return (
    <div>
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-600">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/account/orders" className="hover:text-red-600">Order History</Link>
        <span className="mx-1">/</span>
        <span className="text-red-600 font-medium">Order Details</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1">{order.date}</p>
          <p className="text-sm text-gray-500">{items.length} Product{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/account/cart"
          className="text-red-600 text-sm font-medium hover:underline shrink-0"
        >
          Back to cart
        </Link>
      </div>

      {/* Progress stepper */}
      <div className="mb-6">
        <OrderStatusStepper status={order.status} />
      </div>

      {/* Address cards + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderDetailsCard title="Billing Address">
            <p className="font-medium text-gray-900">{billing.name || "—"}</p>
            <p className="whitespace-pre-line">{billing.address || "—"}</p>
            <p>Email: {billing.email || "—"}</p>
            <p>Phone: {billing.phone || "—"}</p>
          </OrderDetailsCard>
          <OrderDetailsCard title="Shipping Address">
            <p className="font-medium text-gray-900">{shipping.name || "—"}</p>
            <p className="whitespace-pre-line">{shipping.address || "—"}</p>
            <p>Email: {shipping.email || "—"}</p>
            <p>Phone: {shipping.phone || "—"}</p>
          </OrderDetailsCard>
        </div>
        <div>
          <OrderDetailsCard title="Order Summary">
            <div className="space-y-2">
              <p><span className="text-gray-500">Order ID:</span> {summary.orderId}</p>
              <p><span className="text-gray-500">Payment Method:</span> {summary.paymentMethod}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(summary.subtotal || 0)}</span>
              </div>
              {summary.discountPercent > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span>{summary.discountPercent}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{(summary.shipping || 0) === 0 ? "Free" : formatCurrency(summary.shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2">
                <span>Total</span>
                <span className="text-red-600">{formatCurrency(summary.total || 0)}</span>
              </div>
            </div>
          </OrderDetailsCard>
        </div>
      </div>

      {/* Order items table */}
      <OrderItemsTable items={items} />
    </div>
  );
}
