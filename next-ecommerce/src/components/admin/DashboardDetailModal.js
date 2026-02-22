"use client";

/**
 * DashboardDetailModal - Shows detailed data when clicking a dashboard stat card
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipping: "bg-cyan-100 text-cyan-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  return: "bg-orange-100 text-orange-800",
  hold: "bg-gray-100 text-gray-800",
};

export default function DashboardDetailModal({ cardKey, onClose }) {
  const formatCurrency = useFormatCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cardKey) return;
    setLoading(true);
    const orderFilters = {
      totalOrders: null,
      pendingOrders: "pending",
      confirmedOrders: "confirmed",
      shippingOrders: "shipping",
      cancelledOrders: "cancelled",
      returnOrders: "return",
      holdOrders: "hold",
      completedOrders: "delivered",
    };
    const status = orderFilters[cardKey];

    if (["totalOrders", "pendingOrders", "confirmedOrders", "shippingOrders", "cancelledOrders", "returnOrders", "holdOrders", "completedOrders", "todaySales", "monthlySales", "totalRevenue", "averageOrderValue"].includes(cardKey)) {
      fetch("/api/admin/orders", { credentials: "include" })
        .then((r) => r.json())
        .then((orders) => {
          let list = Array.isArray(orders) ? orders : [];
          const now = new Date();
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          if (status) list = list.filter((o) => (o.status || "").toLowerCase() === status);
          if (cardKey === "todaySales") list = list.filter((o) => new Date(o.createdAt || o.created_at) >= todayStart);
          if (cardKey === "monthlySales") list = list.filter((o) => new Date(o.createdAt || o.created_at) >= monthStart);
          setData({ type: "orders", list });
        })
        .catch(() => setData({ type: "orders", list: [] }))
        .finally(() => setLoading(false));
    } else if (["totalProducts"].includes(cardKey)) {
      fetch("/api/admin/products", { credentials: "include" })
        .then((r) => r.json())
        .then((products) => setData({ type: "products", list: Array.isArray(products) ? products : [] }))
        .catch(() => setData({ type: "products", list: [] }))
        .finally(() => setLoading(false));
    } else if (["totalCustomers", "activeUsers"].includes(cardKey)) {
      fetch("/api/admin/customers", { credentials: "include" })
        .then((r) => r.json())
        .then((customers) => setData({ type: "customers", list: Array.isArray(customers) ? customers : [] }))
        .catch(() => setData({ type: "customers", list: [] }))
        .finally(() => setLoading(false));
    } else {
      setData({ type: "info" });
      setLoading(false);
    }
  }, [cardKey]);

  if (!cardKey) return null;

  const labels = {
    totalOrders: "All Orders",
    totalProducts: "All Products",
    totalCustomers: "All Customers",
    totalRevenue: "Revenue - All Orders",
    pendingOrders: "Pending Orders",
    confirmedOrders: "Confirmed Orders",
    shippingOrders: "Shipping Orders",
    cancelledOrders: "Cancelled Orders",
    returnOrders: "Return Orders",
    holdOrders: "Hold Orders",
    completedOrders: "Delivered Orders",
    todaySales: "Today's Sales",
    monthlySales: "Monthly Sales",
    totalVisitors: "Visitor Analytics",
    newVisitorsToday: "New Visitors Today",
    conversionRate: "Conversion Rate",
    averageOrderValue: "Average Order Value - All Orders",
    activeUsers: "Active Users",
  };

  const title = labels[cardKey] || cardKey;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
            </div>
          )}
          {!loading && data?.type === "orders" && (
            <>
              <p className="text-sm text-gray-600 mb-4">{data.list.length} record(s)</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Order ID</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Customer</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Status</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Total</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Date</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.list.slice(0, 50).map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">#{String(o.id).slice(-6)}</td>
                        <td className="px-4 py-2">{o.customerName}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColors[o.status] || "bg-gray-100 text-gray-800"}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{formatCurrency(o.total)}</td>
                        <td className="px-4 py-2">{new Date(o.createdAt || o.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          <Link href={`/admin/orders/${o.id}`} className="text-brand hover:underline text-xs">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.list.length > 50 && <p className="text-xs text-gray-500 mt-2">Showing first 50. <Link href="/admin/orders" className="text-brand hover:underline">View all</Link></p>}
              {data.list.length === 0 && <p className="text-gray-500 py-8 text-center">No records found.</p>}
            </>
          )}
          {!loading && data?.type === "products" && (
            <>
              <p className="text-sm text-gray-600 mb-4">{data.list.length} product(s)</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Product</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Price</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Category</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.list.slice(0, 50).map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{p.name}</td>
                        <td className="px-4 py-2">{formatCurrency(p.price)}</td>
                        <td className="px-4 py-2">{p.category}</td>
                        <td className="px-4 py-2">
                          <Link href={`/admin/products/${p.id}/edit`} className="text-brand hover:underline text-xs">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.list.length > 50 && <p className="text-xs text-gray-500 mt-2">Showing first 50. <Link href="/admin/products" className="text-brand hover:underline">View all</Link></p>}
              {data.list.length === 0 && <p className="text-gray-500 py-8 text-center">No products.</p>}
            </>
          )}
          {!loading && data?.type === "customers" && (
            <>
              <p className="text-sm text-gray-600 mb-4">{data.list.length} customer(s)</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Name</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Email</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Orders</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Total Spent</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.list.slice(0, 50).map((c) => (
                      <tr key={c.id || c.email} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{c.name}</td>
                        <td className="px-4 py-2">{c.email}</td>
                        <td className="px-4 py-2">{c.ordersCount ?? 0}</td>
                        <td className="px-4 py-2">{formatCurrency(c.totalSpent ?? 0)}</td>
                        <td className="px-4 py-2">
                          <Link href={`/admin/customers/${c.id}`} className="text-brand hover:underline text-xs">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.list.length > 50 && <p className="text-xs text-gray-500 mt-2">Showing first 50. <Link href="/admin/customers" className="text-brand hover:underline">View all</Link></p>}
              {data.list.length === 0 && <p className="text-gray-500 py-8 text-center">No customers.</p>}
            </>
          )}
          {!loading && data?.type === "info" && (
            <div className="space-y-4 text-gray-700">
              <p>Analytics metrics (Total Visitors, New Visitors, Conversion Rate, Average Order Value) are calculated from order and user data.</p>
              <p>For detailed analytics, integrate with Google Analytics or a dedicated analytics service.</p>
              <Link href="/admin/orders" className="inline-block text-brand hover:underline font-medium">
                View Orders →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
