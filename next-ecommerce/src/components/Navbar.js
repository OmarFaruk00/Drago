"use client";

/**
 * Navbar - Red top bar with white logo, search, cart/user
 */

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Heart } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFormatCurrency } from "@/lib/utils/useFormatCurrency";

const SUGGESTIONS_LIMIT = 6;

export default function Navbar() {
  const { t, locale, setLocale } = useLanguage();
  const formatCurrency = useFormatCurrency();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchDesktopRef = useRef(null);
  const searchMobileRef = useRef(null);
  const { cart, wishlist, user, logout } = useStore();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = wishlist?.length ?? 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Debounced product search for suggestions
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(q)}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data.slice(0, SUGGESTIONS_LIMIT) : [];
        setSuggestions(list);
        setShowSuggestions(list.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop = searchDesktopRef.current?.contains(e.target);
      const inMobile = searchMobileRef.current?.contains(e.target);
      if (!inDesktop && !inMobile) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hideSuggestions = () => {
    setShowSuggestions(false);
  };

  return (
    <nav className="sticky top-0 z-50 overflow-visible">
      {/* Top bar - Red background, white elements */}
      <div className="bg-brand overflow-visible">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
          <div className="flex items-center justify-between h-14 gap-4 overflow-visible">
            {/* Logo - max size, overflow-visible so it stands out; on mobile, shifted right */}
            <Link href="/" className="flex-shrink-0 flex items-center h-full p-0 m-0 overflow-visible md:ml-0 ml-4">
              <Image
                src="/logo.png"
                alt="Drago"
                width={280}
                height={280}
                className="h-full w-auto object-contain brightness-0 invert block m-0 scale-[2] sm:scale-[2.75] origin-center"
                style={{ padding: "0" }}
                priority
              />
            </Link>

            {/* Search - Input + dark button, with product suggestions */}
            <form ref={searchDesktopRef} onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-1 lg:mx-3 relative">
              <div className="relative w-full flex rounded-md overflow-visible border border-gray-200 bg-white">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder={t("nav.searchProducts")}
                  className="flex-1 pl-10 pr-4 py-2 bg-white border-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none text-sm rounded-l-md"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-black transition shrink-0"
                >
                  {t("nav.search")}
                </button>
              </div>
              {/* Suggestions dropdown */}
              {showSuggestions && (searchQuery.trim().length >= 2) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  {suggestionsLoading ? (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">Searching...</div>
                  ) : suggestions.length > 0 ? (
                    <ul className="max-h-72 overflow-y-auto">
                      {suggestions.map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/products/${p.id}`}
                            onClick={hideSuggestions}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                          >
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={p.image || "/logo.png"}
                                alt={p.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                              <p className="text-xs text-brand font-semibold">{formatCurrency(p.price)}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-4 text-sm text-gray-500">No products found</p>
                  )}
                </div>
              )}
            </form>

            {/* Right: Lang switcher, User & Cart */}
            <div className="flex items-center gap-2">
              <div className="flex rounded overflow-hidden border border-white/30">
                <button
                  onClick={() => setLocale("en")}
                  className={`px-2 py-1 text-xs font-medium ${locale === "en" ? "bg-white text-brand" : "text-white hover:bg-brand-dark"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLocale("bn")}
                  className={`px-2 py-1 text-xs font-medium ${locale === "bn" ? "bg-white text-brand" : "text-white hover:bg-brand-dark"}`}
                >
                  BN
                </button>
              </div>
              <Link
                href={user ? "/account/profile" : "/login"}
                className="flex items-center gap-1.5 p-2 text-white hover:bg-brand-dark rounded transition"
                title={user ? t("footer.profile") : t("nav.account")}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline text-xs sm:text-sm font-medium whitespace-nowrap">{user ? t("footer.profile") : t("nav.account")}</span>
              </Link>
              <Link
                href="/account/wishlist"
                className="relative flex items-center gap-1.5 p-2 text-white hover:bg-brand-dark rounded transition"
                title="Favorite / Wishlist"
              >
                <Heart className="w-5 h-5 shrink-0" strokeWidth={2} />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium whitespace-nowrap">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-brand text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center min-w-[16px]">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 p-2 text-white hover:bg-brand-dark rounded transition"
                title={t("nav.cart")}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline text-xs sm:text-sm font-medium whitespace-nowrap">{t("nav.cart")}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-brand text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center gap-1.5 p-2 text-white hover:bg-brand-dark rounded"
              >
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Menu</span>
              </button>
            </div>
          </div>

          {/* Mobile search - with suggestions */}
          <div ref={searchMobileRef} className="md:hidden pb-3 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder={t("nav.searchProducts")}
                  className="w-full pl-10 pr-4 py-2 bg-white rounded text-gray-900 placeholder-gray-500"
                />
              </div>
            </form>
            {showSuggestions && (searchQuery.trim().length >= 2) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                {suggestionsLoading ? (
                  <div className="px-4 py-6 text-center text-gray-500 text-sm">Searching...</div>
                ) : suggestions.length > 0 ? (
                  <ul className="max-h-56 overflow-y-auto">
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/products/${p.id}`}
                          onClick={() => { hideSuggestions(); setMobileOpen(false); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={p.image || "/logo.png"}
                              alt={p.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                            <p className="text-xs text-brand font-semibold">{formatCurrency(p.price)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm text-gray-500">No products found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary nav - White bg, dark text */}
      <div className="hidden md:block bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-2 items-center">
            <Link href="/" className="text-gray-700 hover:text-brand text-sm font-medium transition">{t("nav.home")}</Link>
            <Link href="/products" className="text-gray-700 hover:text-brand text-sm font-medium transition">{t("nav.products")}</Link>
            <Link href="/about" className="text-gray-700 hover:text-brand text-sm font-medium transition">{t("nav.about")}</Link>
            <Link href="/blog" className="text-gray-700 hover:text-brand text-sm font-medium transition">{t("nav.blog")}</Link>
            <Link href="/contact" className="text-gray-700 hover:text-brand text-sm font-medium transition">{t("nav.contact")}</Link>
            {!user && (
              <>
                <Link href="/login" className="text-gray-700 hover:text-brand text-sm font-medium transition">{t("nav.login")}</Link>
                <Link href="/register" className="px-3 py-1.5 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition">{t("nav.signUp")}</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">{t("nav.home")}</Link>
            <Link href="/products" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">{t("nav.products")}</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">{t("nav.about")}</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">{t("nav.blog")}</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">{t("nav.contact")}</Link>
            {!user && (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">{t("nav.login")}</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="py-2 text-brand font-medium">{t("nav.signUp")}</Link>
              </>
            )}
            <Link href="/account/wishlist" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">Favorite ({wishlistCount})</Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)} className="py-2 text-gray-700">{t("nav.cart")} ({cartCount})</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
