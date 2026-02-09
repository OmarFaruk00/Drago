"use client";

/**
 * StatusBadge - Order status with color (pending, shipped, delivered, etc.)
 */

const styles = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-cyan-100 text-cyan-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }) {
  const style = styles[status?.toLowerCase()] || styles.pending;
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded capitalize ${style}`}>
      {status}
    </span>
  );
}
