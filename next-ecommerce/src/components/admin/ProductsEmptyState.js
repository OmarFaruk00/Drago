"use client";

import Link from "next/link";
import { Package, Plus } from "lucide-react";

/**
 * Empty state for Products page - matches admin dashboard theme
 */
export default function ProductsEmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-16 px-6">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-red-100 flex items-center justify-center">
          <Package className="w-12 h-12 text-red-600" strokeWidth={1.5} />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        You do not have any products created yet. Please create a new one to get started.
      </p>
      <Link
        href="/admin/products/add"
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
      >
        <Plus className="w-5 h-5" />
        Add New Product
      </Link>
    </div>
  );
}
