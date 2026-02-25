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
  const mapUrl = d.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.00977777832!2d90.3492856!3d23.810332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1234567890";

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <section className="space-y-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Us</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            </div>
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Drago Store Location"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
