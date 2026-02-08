"use client";

/**
 * Admin Dashboard - Basic UI
 * Shows overview stats, recent products (mock)
 * Protected by login - check user role
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/useStore";
import { products } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export default function AdminPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/login");
      return;
    }
    if (mounted && user && user.role !== "admin") {
      router.push("/");
    }
  }, [mounted, user, router]);

  if (!mounted || !user || user.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const totalProducts = products.length;
  const inStock = products.filter((p) => p.inStock).length;
  const categories = [...new Set(products.map((p) => p.category))].length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <span className="text-sm text-gray-600">Welcome, {user.name}</span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">In Stock</p>
          <p className="text-2xl font-bold text-green-600">{inStock}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Categories</p>
          <p className="text-2xl font-bold text-gray-900">{categories}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
            Add Product (coming soon)
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
            View Orders (coming soon)
          </span>
          <Link
            href="/products"
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
          >
            View Products
          </Link>
        </div>
      </div>

      {/* Recent products table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <h2 className="font-semibold text-gray-900 p-4 border-b border-gray-200">
          Products Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Price</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.slice(0, 10).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        p.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="p-4 text-sm text-gray-500 border-t border-gray-200">
          Showing 10 of {products.length} products. MongoDB integration coming later.
        </p>
      </div>
    </div>
  );
}
