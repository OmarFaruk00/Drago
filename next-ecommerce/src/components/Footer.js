"use client";

/**
 * Footer - Dark multi-column footer per design
 * Company, Customer Service, My Account, Download App, Social
 */

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Drago"
                width={90}
                height={32}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm mb-4">
              Your trusted e-commerce platform for electronics and more. Quality products at great prices.
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Address:</span> 123 Main St, Dhaka, Bangladesh</p>
              <p><span className="text-gray-400">Phone:</span> +880 1XXX-XXXXXX</p>
              <p><span className="text-gray-400">Email:</span> support@drago.com</p>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-red-400 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Our Services</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-red-400 transition">Shipping & Return</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">FAQ</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Payment Options</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">My Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-red-400 transition">My Profile</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-red-400 transition">My Cart</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">Order Tracking</Link></li>
            </ul>
          </div>
        </div>

        {/* Download App */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <h4 className="text-white font-semibold mb-3">Download App</h4>
          <div className="flex gap-3">
            <a href="#" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
              <span className="text-2xl">📱</span>
              <span className="text-sm">Google Play</span>
            </a>
            <a href="#" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
              <span className="text-2xl">🍎</span>
              <span className="text-sm">App Store</span>
            </a>
          </div>
        </div>

        {/* Social icons */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-wrap gap-4 justify-center md:justify-start">
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition" aria-label="Facebook">📘</a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition" aria-label="Twitter">🐦</a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition" aria-label="Instagram">📷</a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition" aria-label="LinkedIn">💼</a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition" aria-label="YouTube">▶️</a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Drago. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
