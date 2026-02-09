"use client";

/**
 * Order History - Table with status badges
 */

import Link from "next/link";
import DashboardTable from "@/components/dashboard/DashboardTable";
import { orders } from "@/lib/data/dashboard";

export default function OrdersPage() {
  const columns = [
    { key: "id", label: "Order ID", render: (v) => <Link href={`/dashboard/orders/${v}`} className="text-red-600 hover:underline">#{v}</Link> },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
    { key: "total", label: "Total" },
    { key: "status", label: "Status" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      <DashboardTable columns={columns} rows={orders} statusKey="status" />
    </div>
  );
}
