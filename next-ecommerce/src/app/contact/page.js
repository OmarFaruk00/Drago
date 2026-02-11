"use client";

/**
 * Contact Page - Contact details + embedded map
 * Design: Left contact info, right map
 */

import { useEffect } from "react";
import { trackContact } from "@/lib/tracking/client";

export default function ContactPage() {
  useEffect(() => {
    trackContact({
      content_category: "Contact",
      event_source_url:
        typeof window !== "undefined" ? window.location.href : undefined,
    });
  }, []);

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <section className="space-y-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Contact Us
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Main Street, Dhaka 1000, Bangladesh
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">+880 1XXX-XXXXXX</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">support@drago.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Working Days
                </h3>
                <p className="text-gray-600">
                  Saturday - Thursday: 9:00 AM - 8:00 PM
                </p>
                <p className="text-gray-600">Friday: Closed</p>
              </div>
            </div>

            {/* Map - placeholder using iframe (Google Maps embed) */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.00977777832!2d90.3492856!3d23.810332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1234567890"
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
