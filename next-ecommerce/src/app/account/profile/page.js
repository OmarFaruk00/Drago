"use client";

/**
 * My Profile - 4 stat cards + Recent Order History
 */

import Link from "next/link";

const statCards = [
  { label: "Total Orders", value: 20, icon: "cart-check", bg: "bg-green-100", iconColor: "text-green-600" },
  { label: "Shopping", value: 3, icon: "bag", bg: "bg-pink-100", iconColor: "text-pink-600" },
  { label: "Pending", value: 12, icon: "refresh", bg: "bg-amber-100", iconColor: "text-amber-600" },
  { label: "Cancel", value: 2, icon: "x", bg: "bg-red-100", iconColor: "text-red-600" },
];

const recentOrders = [
  { id: "0210814", date: "March 13, 2014", total: "$135.00 (5 Products)", status: "Delivered" },
  { id: "0210815", date: "March 12, 2014", total: "$89.00 (2 Products)", status: "Pending" },
  { id: "0210816", date: "March 10, 2014", total: "$245.00 (8 Products)", status: "Canceled" },
];

const statusColors = {
  Delivered: "bg-green-100 text-green-800",
  Pending: "bg-amber-100 text-amber-800",
  Canceled: "bg-red-100 text-red-800",
  Incoming: "bg-orange-100 text-orange-800",
};

export default function ProfilePage() {

  return (
    <div>
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
          <Link href="/account/orders" className="text-red-600 text-sm font-medium hover:underline">
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
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href="/account/orders" className="text-red-600 text-sm hover:underline">
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
            <button className="w-8 h-8 rounded bg-red-600 text-white text-sm font-medium">1</button>
            <button className="w-8 h-8 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">2</button>
            <button className="w-8 h-8 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
