"use client";

/**
 * My Profile - 4 stat cards + Recent Order History (real-time from API)
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { accountOrdersList } from "@/lib/data/accountOrders";

const statusColors = {
  delivered: "bg-green-100 text-green-800",
  Delivered: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  Pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
  Canceled: "bg-red-100 text-red-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
};

const fetchStats = () =>
  fetch("/api/dashboard/stats", { credentials: "include" }).then((r) => r.json());

const fetchOrders = () =>
  fetch("/api/dashboard/orders", { credentials: "include" }).then((r) => r.json());

export default function ProfilePage() {
  const cart = useStore((s) => s.cart);
  const [stats, setStats] = useState({ orders: 0, pendingCount: 0, cancelledCount: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    Promise.all([fetchStats(), fetchOrders()])
      .then(([statsData, ordersData]) => {
        setStats({
          orders: statsData.orders ?? 0,
          pendingCount: statsData.pendingCount ?? 0,
          cancelledCount: statsData.cancelledCount ?? 0,
        });
        const list = Array.isArray(ordersData) && ordersData.length > 0 ? ordersData : accountOrdersList;
        setRecentOrders(list.slice(0, 6));
      })
      .catch(() => {
        setRecentOrders(accountOrdersList.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    const onFocus = () => loadData();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadData]);

  const statCards = [
    { label: "Total Orders", value: stats.orders, icon: "cart-check", bg: "bg-green-100", iconColor: "text-green-600" },
    { label: "Shopping", value: cart.length, icon: "bag", bg: "bg-pink-100", iconColor: "text-pink-600" },
    { label: "Pending", value: stats.pendingCount, icon: "refresh", bg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Cancel", value: stats.cancelledCount, icon: "x", bg: "bg-red-100", iconColor: "text-brand" },
  ];

  const getStatusLabel = (s) => {
    if (!s) return "Pending";
    const v = String(s).toLowerCase();
    if (v === "delivered") return "Delivered";
    if (v === "cancelled") return "Canceled";
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-2 right-2 z-10">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand border-t-transparent" title="Refreshing..." />
        </div>
      )}
      {/* Stat cards - equal width, aligned with sidebar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 min-w-0"
          >
            <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center ${card.iconColor}`}>
              {card.icon === "cart-check" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
              {card.icon === "bag" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              )}
              {card.icon === "refresh" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {card.icon === "x" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Order History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Order History</h2>
          <Link href="/account/orders" className="text-black text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-gray-900">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || statusColors[order.status?.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/account/orders/${order.fullId || order.id}`} className="text-brand text-sm hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing 1-{recentOrders.length} of 99</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded bg-brand text-white text-sm font-medium">1</button>
            <button className="w-8 h-8 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">2</button>
            <button className="w-8 h-8 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
