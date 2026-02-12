"use client";

/**
 * OrderDetailsCard - Billing/Shipping address or summary card
 */

export default function OrderDetailsCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="text-sm text-gray-700 space-y-1">{children}</div>
    </div>
  );
}
