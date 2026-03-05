"use client";

/**
 * About Page - Content from API (admin-editable)
 */

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages/about")
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
  const team = Array.isArray(d.team) ? d.team : [];
  const whyChooseItems = Array.isArray(d.whyChooseItems) ? d.whyChooseItems : [];

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{d.missionTitle || "Our Mission & Vision"}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">{d.missionText || ""}</p>
              <p className="text-gray-600">{d.visionText || ""}</p>
            </div>
            {d.missionImage && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image src={d.missionImage} alt="Mission" fill className="object-cover" />
              </div>
            )}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{d.whyChooseTitle || "Why Choose Us"}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {d.whyChooseImage && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 order-2 lg:order-1">
                <Image src={d.whyChooseImage} alt="Why Choose Us" fill className="object-cover" />
              </div>
            )}
            <div className="order-1 lg:order-2">
              <ul className="space-y-4 text-gray-600">
                {whyChooseItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="terms" className="space-y-8 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{d.termsTitle || "Terms & Conditions"}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 whitespace-pre-wrap">{d.termsText || ""}</p>
            </div>
            {d.termsImage && (
              <div className="relative aspect-square max-w-xs rounded-xl overflow-hidden bg-gray-100">
                <Image src={d.termsImage} alt="Terms" fill className="object-cover" />
              </div>
            )}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{d.contactTitle || "Contact Information"}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">{d.contactAddress}</p>
              <p className="text-gray-600 mb-4">Phone: {d.contactPhone}</p>
              <p className="text-gray-600 mb-4">Email: {d.contactEmail}</p>
            </div>
            {d.contactImage && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image src={d.contactImage} alt="Contact" fill className="object-cover" />
              </div>
            )}
          </div>
        </section>

        {team.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">{d.teamTitle || "Our Team"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <div key={i} className="text-center">
                  {member.image && (
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4">
                      <Image src={member.image} alt={member.name || ""} width={128} height={128} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
