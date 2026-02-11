"use client";

/**
 * About Page - Our Mission, Why Choose Us, Terms, Contact Info, Team
 * Design: Sections with heading, text, image alternation
 */

import Image from "next/image";

export default function AboutPage() {
  const team = [
    { name: "Jenny Wilson", role: "CEO", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
    { name: "David Cooper", role: "CTO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
    { name: "Jessica Miller", role: "Head of Sales", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  ];

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Mission & Vision</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                At Drago, our mission is to provide high-quality electronics and products to customers across Bangladesh
                at competitive prices. We believe in making premium products accessible to everyone.
              </p>
              <p className="text-gray-600">
                Our vision is to become the most trusted e-commerce platform in the region, known for exceptional
                customer service, genuine products, and seamless shopping experience.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=450&fit=crop"
                alt="Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Choose Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=450&fit=crop"
                alt="Why Choose Us"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <ul className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>100% genuine products with warranty</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Fast delivery across Bangladesh</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Easy returns and refunds</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Secure payment options</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Terms & Conditions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                By using our website, you agree to our terms of service. All products are subject to availability.
                We reserve the right to modify prices and policies without prior notice.
              </p>
              <p className="text-gray-600">
                Please read our full terms and conditions, privacy policy, and refund policy before making a purchase.
              </p>
            </div>
            <div className="relative aspect-square max-w-xs rounded-xl overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"
                alt="Terms"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">123 Main Street, Dhaka, Bangladesh</p>
              <p className="text-gray-600 mb-4">Phone: +880 1XXX-XXXXXX</p>
              <p className="text-gray-600 mb-4">Email: support@drago.com</p>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop"
                alt="Contact"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Our Awesome Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
