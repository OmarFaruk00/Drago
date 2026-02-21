"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  CalendarDays,
  UserPlus,
  Percent,
  Banknote,
  UserCheck,
  Truck,
  RotateCcw,
  PauseCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-blue-100 text-blue-800",
  shipping: "bg-cyan-100 text-cyan-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  return: "bg-orange-100 text-orange-800",
  hold: "bg-gray-100 text-gray-800",
};

export default function AdminDashboardPage() {
  const formatCurrency = useFormatCurrency();
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/trends", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/orders", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([s, t, o]) => {
        setStats(s);
        setTrends(t.trends || []);
        setOrders(Array.isArray(o) ? o : o.orders || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Customers",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: DollarSign,
      color: "text-brand",
      bg: "bg-red-50",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      pctChange: stats?.pctPending ?? 0,
    },
    {
      label: "Confirm Order",
      value: stats?.confirmedOrders ?? 0,
      icon: CheckCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Shipping Order",
      value: stats?.shippingOrders ?? 0,
      icon: Truck,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      label: "Cancel Order",
      value: stats?.cancelledOrders ?? 0,
      icon: XCircle,
      color: "text-brand",
      bg: "bg-red-50",
      pctChange: stats?.pctCancelled ?? 0,
    },
    {
      label: "Return Order",
      value: stats?.returnOrders ?? 0,
      icon: RotateCcw,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Hold Order",
      value: stats?.holdOrders ?? 0,
      icon: PauseCircle,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      label: "Delivery Order",
      value: stats?.completedOrders ?? 0,
      icon: Truck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      pctChange: stats?.pctCompleted ?? 0,
    },
    {
      label: "Today Sales",
      value: formatCurrency(stats?.todaySales ?? 0),
      icon: Calendar,
      color: "text-sky-600",
      bg: "bg-sky-50",
      pctChange: stats?.pctTodaySales ?? 0,
    },
    {
      label: "Monthly Sales",
      value: formatCurrency(stats?.monthlySales ?? 0),
      icon: CalendarDays,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      pctChange: stats?.pctMonthlySales ?? 0,
    },
    {
      label: "Total Visitors",
      value: (stats?.totalVisitors ?? 0).toLocaleString(),
      icon: Eye,
      color: "text-violet-600",
      bg: "bg-violet-50",
      pctChange: stats?.pctTotalVisitors ?? 0,
    },
    {
      label: "New Visitors Today",
      value: stats?.newVisitorsToday ?? 0,
      icon: UserPlus,
      color: "text-pink-600",
      bg: "bg-pink-50",
      pctChange: stats?.pctNewVisitors ?? 0,
    },
    {
      label: "Conversion Rate",
      value: `${stats?.conversionRate ?? 0}%`,
      icon: Percent,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      pctChange: stats?.pctConversion ?? 0,
    },
    {
      label: "Average Order Value",
      value: formatCurrency(stats?.averageOrderValue ?? 0),
      icon: Banknote,
      color: "text-teal-600",
      bg: "bg-teal-50",
      pctChange: stats?.pctAOV ?? 0,
    },
    {
      label: "Active Users",
      value: stats?.activeUsers ?? 0,
      icon: UserCheck,
      color: "text-orange-600",
      bg: "bg-orange-50",
      pctChange: stats?.pctActiveUsers ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const hasPct = card.pctChange != null;
          const pctUp = hasPct && card.pctChange >= 0;
          return (
            <div
              key={card.label}
              className="rounded-lg border border-gray-200 p-3 shadow-sm backdrop-blur-sm bg-white/80 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg hover:bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 truncate">{card.label}</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">{card.value}</p>
                  {hasPct && (
                    <p className={`text-[10px] font-medium mt-0.5 ${pctUp ? "text-green-600" : "text-brand"}`}>
                      {pctUp ? "↑" : "↓"} {Math.abs(card.pctChange)}%
                    </p>
                  )}
                </div>
                <div className={`p-2 rounded-md shrink-0 ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Sales Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ fill: "#dc2626" }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Orders Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#dc2626" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-brand hover:text-brand-dark"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(orders.slice(0, 8) || []).map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    #{String(o.id).slice(-6)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{o.customerName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        statusColors[o.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(o.createdAt || o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="p-1.5 text-gray-500 hover:text-brand hover:bg-red-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="p-1.5 text-gray-500 hover:text-brand hover:bg-red-50 rounded"
                        title="Update Status"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!orders || orders.length === 0) && (
          <p className="p-8 text-center text-gray-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
