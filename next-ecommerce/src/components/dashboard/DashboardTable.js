"use client";

/**
 * DashboardTable - Reusable table for dashboard pages
 */

import StatusBadge from "./StatusBadge";

export default function DashboardTable({ columns, rows, statusKey }) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.key === statusKey && row[col.key] ? (
                    <StatusBadge status={row[col.key]} />
                  ) : col.render ? (
                    col.render(row[col.key], row)
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
