"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Tag, MoreVertical } from "lucide-react";

const FILTER_TABS = [
  { id: "active", label: "Active" },
  { id: "scheduled", label: "Scheduled" },
  { id: "expired", label: "Expired" },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    fetch("/api/admin/coupons", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setCoupons(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = coupons.filter((c) => {
    const matchesSearch = !search || (c.name || c.code || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = c.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <Link
          href="/admin/coupons/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand-dark transition"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                filter === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Coupon Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Validity Period</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 text-brand" />
                      </div>
                      <span className="font-medium text-gray-900">{c.name || c.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {c.usageCount ?? 0} {c.totalUsageLimit ? `/ ${c.totalUsageLimit}` : ""} times
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        c.status === "active"
                          ? "bg-green-100 text-green-800"
                          : c.status === "scheduled"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {menuOpen === c.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-4 top-full mt-1 py-1 bg-white border rounded-lg shadow-lg z-20 min-w-[120px]">
                          <Link
                            href={`/admin/coupons/${c.id}/edit`}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setMenuOpen(null)}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              fetch(`/api/admin/coupons/${c.id}`, { method: "DELETE", credentials: "include" })
                                .then((r) => r.ok && setCoupons((p) => p.filter((x) => x.id !== c.id)));
                              setMenuOpen(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-brand hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-gray-500">No {filter} coupons found.</p>
        )}
      </div>
    </div>
  );
}
