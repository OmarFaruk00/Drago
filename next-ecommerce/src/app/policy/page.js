"use client";

/**
 * Policy Page - Delivery, Return, Refund, Cancellation, Privacy, Warranty
 * Each section has id for hash linking. Admin can edit via /admin/policy.
 */

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "delivery", key: "delivery", titleKey: "deliveryTitle", textKey: "deliveryText" },
  { id: "return", key: "return", titleKey: "returnTitle", textKey: "returnText" },
  { id: "refund", key: "refund", titleKey: "refundTitle", textKey: "refundText" },
  { id: "cancellation", key: "cancellation", titleKey: "cancellationTitle", textKey: "cancellationText" },
  { id: "privacy", key: "privacy", titleKey: "privacyTitle", textKey: "privacyText" },
  { id: "warranty", key: "warranty", titleKey: "warrantyTitle", textKey: "warrantyText" },
];

export default function PolicyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages/policy")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  const d = data || {};

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy & Policy</h1>
        <div className="space-y-12">
          {SECTIONS.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="scroll-mt-24"
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                {d[sec.titleKey] || sec.key.charAt(0).toUpperCase() + sec.key.slice(1) + " Policy"}
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {d[sec.textKey] || ""}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
