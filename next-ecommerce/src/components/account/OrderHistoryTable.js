"use client";

/**
 * OrderHistoryTable - Order History table with status badges and pagination
 */

import Link from "next/link";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function StatusBadge({ status }) {
  const key = (status || "").toLowerCase();
  const style = statusStyles[key] || statusStyles.pending;
  const label = key === "cancelled" ? "Cancelled" : (status || "Pending");
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

export default function OrderHistoryTable({
  orders = [],
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  pageSize = 9,
  onPageChange,
}) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
        <Link href="/account/orders" className="text-gray-900 text-sm font-medium hover:underline">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.fullId || order.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  #{order.id || order.fullId?.slice(-6)}
                </td>
                <td className="px-6 py-4 text-gray-700">{order.date}</td>
                <td className="px-6 py-4 text-gray-900">{order.total}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/account/orders/${order.fullId || order.id}`}
                    className="text-red-600 text-sm font-medium hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="px-6 py-12 text-center text-gray-500">
          <p>No orders yet.</p>
        </div>
      )}
      {orders.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing {start}-{end} of {totalCount} Result{totalCount !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              ‹
            </button>
            {totalPages > 1 && Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange?.(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    p === currentPage ? "bg-red-600 text-white" : "border border-red-600 text-red-600 hover:bg-red-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
