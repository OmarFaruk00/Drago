"use client";

/**
 * Dashboard Overview - Stats + recent activities table
 */

import DashboardTable from "@/components/dashboard/DashboardTable";
import { dashboardStats, recentActivities } from "@/lib/data/dashboard";

export default function DashboardPage() {
  const columns = [
    { key: "desc", label: "Description" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-xl font-bold text-gray-900">{dashboardStats.totalSales}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-xl font-bold text-gray-900">{dashboardStats.orders}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-xl font-bold text-gray-900">{dashboardStats.products}</p>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <DashboardTable columns={columns} rows={recentActivities} statusKey="status" />
      </div>
    </div>
  );
}
