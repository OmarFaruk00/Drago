"use client";

/**
 * OrderDetailsCard - Billing/Shipping address or summary card
 */

export default function OrderDetailsCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${className}`}>
      <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="text-sm text-gray-700 space-y-1">{children}</div>
    </div>
  );
}
