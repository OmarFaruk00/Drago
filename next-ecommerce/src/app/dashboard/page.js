"use client";

/**
 * Dashboard Overview - Real stats from user's orders
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardTable from "@/components/dashboard/DashboardTable";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSales: "0 tk",
    orders: 0,
    products: 0,
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "desc", label: "Description", render: (v, row) => row.fullId ? <Link href={`/dashboard/orders/${row.fullId}`} className="text-red-600 hover:underline">{v}</Link> : v },
    { key: "amount", label: "Amount" },
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-xl font-bold text-gray-900">{stats.totalSales}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-xl font-bold text-gray-900">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Items Ordered</p>
          <p className="text-xl font-bold text-gray-900">{stats.products}</p>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {stats.recentActivities?.length > 0 ? (
          <DashboardTable columns={columns} rows={stats.recentActivities} statusKey="status" />
        ) : (
          <p className="text-gray-500 py-8">No orders yet. <Link href="/products" className="text-red-600 hover:underline">Start shopping</Link></p>
        )}
      </div>
    </div>
  );
}
