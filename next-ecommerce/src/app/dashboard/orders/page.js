"use client";

/**
 * Order History - User's orders from database
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardTable from "@/components/dashboard/DashboardTable";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/orders", { credentials: "include" })
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "id", label: "Order ID", render: (v, row) => <Link href={`/dashboard/orders/${row.fullId}`} className="text-red-600 hover:underline">#{v}</Link> },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
    { key: "total", label: "Total" },
    { key: "status", label: "Status" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      {orders.length > 0 ? (
        <DashboardTable columns={columns} rows={orders} statusKey="status" />
      ) : (
        <p className="text-gray-500 py-8">No orders yet. <Link href="/products" className="text-red-600 hover:underline">Start shopping</Link></p>
      )}
    </div>
  );
}
