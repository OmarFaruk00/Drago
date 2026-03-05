"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

const statusColors = {
  pending: "bg-gray-100 text-gray-700",
  confirmed: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipping: "bg-cyan-100 text-cyan-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-brand/10 text-brand",
  cancelled: "bg-gray-200 text-gray-700",
  return: "bg-purple-100 text-purple-800",
  hold: "bg-amber-100 text-amber-800",
};

const paymentColors = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-gray-100 text-gray-600",
};

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipping", "delivered", "cancelled", "return", "hold"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const dateFilterRef = useRef(null);
  const perPage = 10;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dateFilterRef.current && !dateFilterRef.current.contains(e.target)) {
        setShowDateFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("/api/admin/orders", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(orderId, status) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  }

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (o.customerName || "").toLowerCase().includes(q) ||
      (o.customerEmail || "").toLowerCase().includes(q) ||
      String(o.id || "").toLowerCase().includes(q);
    const matchFilter =
      orderFilter === "all" || (o.status || "").toLowerCase() === orderFilter.toLowerCase();
    const orderDate = new Date(o.createdAt || o.created_at).getTime();
    let matchDate = true;
    if (dateFrom) {
      const fromStart = new Date(dateFrom).setHours(0, 0, 0, 0);
      if (orderDate < fromStart) matchDate = false;
    }
    if (dateTo) {
      const toEnd = new Date(dateTo).setHours(23, 59, 59, 999);
      if (orderDate > toEnd) matchDate = false;
    }
    return matchSearch && matchFilter && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map((o) => o.id)));
  };

  const getPaymentStatus = (o) => (o.status === "delivered" || o.status === "shipped" ? "Paid" : "Pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50/50 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <button className="px-3 py-1.5 text-sm font-medium text-brand border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
          Export
        </button>
      </div>

      {/* Filters + Table Card - single container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filters Row - inside card, single line */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 py-3 border-b border-gray-100">
          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            className="shrink-0 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-brand/20 w-36"
          >
            <option value="all">All Order</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          <div ref={dateFilterRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowDateFilter((s) => !s)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition ${
                dateFrom || dateTo
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Filter By Date
              <ChevronDown className={`w-4 h-4 transition-transform ${showDateFilter ? "rotate-180" : ""}`} />
            </button>
            {showDateFilter && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg border border-gray-200 shadow-lg p-4 w-72">
                <p className="text-xs font-medium text-gray-500 mb-3">Filter orders by date range</p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">From</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">To</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      setShowDateFilter(false);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDateFilter(false)}
                    className="flex-1 px-3 py-1.5 text-sm bg-brand text-white rounded-lg hover:bg-brand-dark"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <button className="p-2 text-gray-500 hover:text-brand hover:bg-red-50 rounded-lg">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-brand hover:bg-red-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selected.size === paginated.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-brand focus:ring-brand"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Customer Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Payment Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Order Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                  Total Price
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((o) => (
                <tr
                  key={o.id}
                  className={`hover:bg-red-50/30 transition-colors ${
                    selected.has(o.id) ? "bg-red-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(o.id)}
                      onChange={() => toggleSelect(o.id)}
                      className="rounded border-gray-300 text-brand focus:ring-brand"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    #{String(o.id).slice(-6)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(o.createdAt || o.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{o.customerName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        paymentColors[getPaymentStatus(o)] || paymentColors.Pending
                      }`}
                    >
                      {getPaymentStatus(o)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      disabled={updating === o.id}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-1 focus:ring-brand ${
                        statusColors[o.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(o.total)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex p-1.5 text-gray-500 hover:text-brand hover:bg-gray-100 rounded"
                      title="Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginated.length === 0 && (
          <p className="p-12 text-center text-gray-500">No orders found.</p>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {(() => {
              const pages = [];
              const show = 5;
              let start = Math.max(1, page - Math.floor(show / 2));
              let end = Math.min(totalPages, start + show - 1);
              if (end - start + 1 < show) start = Math.max(1, end - show + 1);
              for (let i = start; i <= end; i++) pages.push(i);
              return (
                <>
                  {pages.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[32px] h-8 px-2 text-sm font-medium rounded ${
                        page === p
                          ? "bg-brand/10 text-brand"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  {totalPages > show && end < totalPages && (
                    <span className="px-2 text-sm text-gray-500">...</span>
                  )}
                </>
              );
            })()}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {filtered.length} Result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
