"use client";

/**
 * Order Details - Progress stepper, address cards, order summary, order items
 * Route: /account/orders/[orderId]
 */

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderTrackingStepper from "@/components/account/OrderTrackingStepper";
import OrderItemsTable from "@/components/account/OrderItemsTable";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";
import { getAccountOrderById } from "@/lib/data/accountOrders";

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatCurrency = useFormatCurrency();
  const orderId = params?.orderId;

  const loadOrder = useCallback((showLoading = true) => {
    if (!orderId) return;
    if (showLoading) setLoading(true);
    fetch(`/api/dashboard/orders/${orderId}`, { credentials: "include" })
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
            orderId: data.id || orderId,
            paymentMethod: data.paymentMethod || "Cash",
            subtotal: data.subtotal ?? (data.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
            discountPercent: data.discountPercent || 0,
            shipping: data.shippingCost ?? 0,
            total: data.total ?? 0,
          },
        };
      })
      .then(setOrder)
      .catch(() => setOrder(getAccountOrderById(orderId)))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    loadOrder(true);
    const interval = setInterval(() => loadOrder(false), 60000);
    return () => clearInterval(interval);
  }, [loadOrder]);

  useEffect(() => {
    const onFocus = () => loadOrder(false);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadOrder]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <Link href="/account/orders" className="text-brand text-sm font-medium hover:underline mb-4 inline-block">
          Back to list
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-6 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            • {order.date} • {items.length} Product{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/account/orders"
          className="text-brand text-sm font-medium hover:underline shrink-0"
        >
          Back to list
        </Link>
      </div>

      <div className="p-6 space-y-6">
        {/* Table 1: Billing + Shipping | Table 2: Order ID, Payment, Summary - side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Billing Address + Shipping Address - one table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Billing Address</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Shipping Address</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-700 align-top">{billing.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-700 align-top">{shipping.name || "—"}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-700 align-top whitespace-pre-line">{billing.address || "—"}</td>
                  <td className="px-4 py-3 text-gray-700 align-top whitespace-pre-line">{shipping.address || "—"}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-700">Email: {billing.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-700">Email: {shipping.email || "—"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Phone: {billing.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-700">Phone: {shipping.phone || "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Order ID, Payment Method, Summary - another table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 w-1/2">Order ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-900">#{summary.orderId}</td>
                  <td className="px-4 py-3 text-gray-900">{summary.paymentMethod}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-600">Subtotal</td>
                  <td className="px-4 py-3 text-gray-900">{formatCurrency(summary.subtotal || 0)}</td>
                </tr>
                {summary.discountPercent > 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 text-gray-600">Discount</td>
                    <td className="px-4 py-3 text-gray-900">{summary.discountPercent}%</td>
                  </tr>
                )}
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-600">Shipping</td>
                  <td className="px-4 py-3 text-gray-900">
                    {(summary.shipping || 0) === 0 ? "Free" : formatCurrency(summary.shipping)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-gray-900">Total</td>
                  <td className="px-4 py-3 font-bold text-brand">{formatCurrency(summary.total || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Tracking */}
        <OrderTrackingStepper status={order.status} />

        {/* Product List */}
        <OrderItemsTable items={items} />
      </div>
    </div>
  );
}
