"use client";

/**
 * Order History - Orders table with status badges and pagination (real-time)
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import OrderHistoryTable from "@/components/account/OrderHistoryTable";
import { accountOrdersList } from "@/lib/data/accountOrders";

const PAGE_SIZE = 9;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadOrders = useCallback(() => {
    fetch("/api/dashboard/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0 ? data : accountOrdersList;
        setOrders(list);
      })
      .catch(() => setOrders(accountOrdersList))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  useEffect(() => {
    const onFocus = () => loadOrders();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadOrders]);

  const totalCount = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const paginatedOrders = orders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div>
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">No orders yet.</p>
          <Link href="/products" className="text-brand font-medium hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <OrderHistoryTable
          orders={paginatedOrders}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
