"use client";

/**
 * Navbar - Red top bar with white logo, search, cart/user
 * Design: Solid red background, white text, central search
 */

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store/useStore";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, user, logout } = useStore();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50">
      {/* Top bar - Red background, white elements */}
      <div className="bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - fixed navbar 64px, logo h-10 (40px) */}
            <Link href="/" className="flex-shrink-0 flex items-center h-10">
              <Image
                src="/logo.png"
                alt="Drago"
                width={120}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>

            {/* Search - Central, white bg */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-12 py-2 bg-white border-0 rounded focus:ring-2 focus:ring-white/30 text-gray-900 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-gray-800 text-white rounded-r hover:bg-gray-900"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right: User & Cart icons - White */}
            <div className="flex items-center gap-3">
              <Link
                href={user ? "/dashboard" : "/login"}
                className="p-2 text-white hover:bg-red-700 rounded transition"
                title={user ? "Dashboard" : "Account"}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link
                href="/cart"
                className="relative p-2 text-white hover:bg-red-700 rounded transition"
                title="Cart"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-red-600 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-white hover:bg-red-700 rounded"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500"
            />
          </form>
        </div>
      </div>

      {/* Secondary nav - White bg, dark text */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 py-3">
            <Link href="/" className="text-gray-700 hover:text-red-600 text-sm font-medium transition">
              Home
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-700 hover:text-red-600 text-sm font-medium transition">
                Dashboard
              </Link>
            )}
            <Link href="/products" className="text-gray-700 hover:text-red-600 text-sm font-medium transition">
              All Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-red-600 text-sm font-medium transition">
              About Us
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-red-600 text-sm font-medium transition">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-red-600 text-sm font-medium transition">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Home</Link>
            {user && <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Dashboard</Link>}
            <Link href="/products" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">All Products</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">About Us</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Blog</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Contact Us</Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Cart ({cartCount})</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
