"use client";

/**
 * Contact Page - Content from API (admin-editable)
 */

import { useEffect, useState } from "react";
import { trackContact } from "@/lib/tracking/client";

export default function ContactPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackContact({
      content_category: "Contact",
      event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
    });
  }, []);

  useEffect(() => {
    fetch("/api/pages/contact")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-8 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand" />
      </div>
    );
  }

  const d = data || {};
  const mapLinkUrl = "https://www.google.com/maps/place/Drago/@24.6900031,90.6046415,17z/data=!3m1!4b1!4m6!3m5!1s0x3756f772706f6a6f:0xe0fedd5b2092abca!8m2!3d24.6900031!4d90.6072164!16s%2Fg%2F11vbxzpwf_?entry=ttu";

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <section className="space-y-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Us</h1>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">{d.address || ""}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">{d.phone || ""}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">{d.email || ""}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Working Days</h3>
              <p className="text-gray-600">{d.workingDays || ""}</p>
              <p className="text-gray-600">{d.workingDaysFri || ""}</p>
            </div>
            <a
              href={mapLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[120px] px-4 py-2.5 bg-brand text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
            >
              Find Us on Google Maps
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
