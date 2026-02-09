"use client";

/**
 * My Shop - Product management with Add New
 */

import Image from "next/image";
import Link from "next/link";
import DashboardTable from "@/components/dashboard/DashboardTable";
import { shopProducts } from "@/lib/data/dashboard";

export default function ShopPage() {
  const columns = [
    { key: "image", label: "Product", render: (_, row) => (
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
          <Image src={row.image} alt={row.name} fill className="object-cover" sizes="40px" />
        </div>
        <span className="text-sm font-medium">{row.name}</span>
      </div>
    )},
    { key: "stock", label: "Stock" },
    { key: "price", label: "Price", render: (v) => `৳${Number(v).toLocaleString()}` },
    { key: "actions", label: "Actions", render: (_, row) => (
      <div className="flex gap-2">
        <button className="text-red-600 text-sm hover:underline">Edit</button>
        <button className="text-gray-500 text-sm hover:underline">Delete</button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>
        <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
          Add New
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DashboardTable columns={columns} rows={shopProducts} />
      </div>
    </div>
  );
}
