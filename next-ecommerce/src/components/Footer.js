"use client";

/**
 * Footer - Dark multi-column footer per design
 * Number, email, social links from admin (api/settings/footer)
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Instagram, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/lib/store/useStore";
import AuthLink from "./account/AuthLink";

const INSTAGRAM_GRID_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=60",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=60",
  "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=200&q=60",
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=200&q=60",
];

function TiktokIcon({ className, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const DEFAULT_PHONE = "+88 01923035628";
const DEFAULT_EMAIL = "drago.com.bd@gmail.com";
const DEFAULT_ADDRESS = "Kendua - Ishwargonj Road, Mymensingh, 2280";

export default function Footer() {
  const { t } = useLanguage();
  const user = useStore((s) => s.user);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    fetch("/api/settings/footer")
      .then((r) => r.json())
      .then((d) => d && !d.error && setFooter(d))
      .catch(() => {});
  }, []);

  const phone = footer?.phone || DEFAULT_PHONE;
  const email = footer?.email || DEFAULT_EMAIL;
  const address = footer?.address || DEFAULT_ADDRESS;
  const aboutTitle = footer?.aboutTitle || "About Drago";
  const aboutText = footer?.aboutText || "Drago is a trusted online shop in Bangladesh. Where you will find all the products of fashion, electronics, and other daily life only at Drago.";
  const socialLinks = Array.isArray(footer?.socialLinks) ? footer.socialLinks : [];

  return (
    <footer className="bg-black text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-8">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="block mb-3 p-0 m-0">
              <Image
                src="/logo.png"
                alt="Drago"
                width={180}
                height={180}
                className="h-24 md:h-28 w-auto brightness-0 invert object-contain p-0 m-0"
              />
            </Link>
            <div className="text-sm text-gray-200 mb-4 space-y-1">
              <p className="font-semibold text-white text-base">{aboutTitle}</p>
              <p className="leading-relaxed">{aboutText}</p>
            </div>
            <div className="space-y-2 text-sm text-white">
              {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold block hover:text-red-400 transition">{phone}</a>}
              {email && <a href={`mailto:${email}`} className="font-semibold block hover:text-red-400 transition">{email}</a>}
            </div>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-white font-semibold mb-4">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-red-400 transition">Our Mission &amp; Vision</Link></li>
              <li><Link href="/about" className="hover:text-red-400 transition">Why Choose Us</Link></li>
              <li><Link href="/terms" className="hover:text-red-400 transition">Terms &amp; Condition</Link></li>
              <li><Link href="/blog" className="hover:text-red-400 transition">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-red-400 transition">Faqs</Link></li>
            </ul>
          </div>

          {/* Account - Cart, Shop, Product, Wishlist: logged in → page, else → register */}
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:text-red-400 transition">My Account</Link></li>
              {!user && (
                <li><Link href="/login" className="hover:text-red-400 transition">Login/Register</Link></li>
              )}
              <li><AuthLink href="/account/cart" className="hover:text-red-400 transition">Cart</AuthLink></li>
              <li><AuthLink href="/products" className="hover:text-red-400 transition">Shop</AuthLink></li>
              <li><AuthLink href="/products" className="hover:text-red-400 transition">Product</AuthLink></li>
              <li><AuthLink href="/account/wishlist" className="hover:text-red-400 transition">Wishlist</AuthLink></li>
            </ul>
          </div>

          {/* Privacy & Policy */}
          <div>
            <h4 className="text-white font-semibold mb-4">Privacy &amp; Policy</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/policy/delivery" className="hover:text-red-400 transition">Delivery Policy</Link></li>
              <li><Link href="/policy/return" className="hover:text-red-400 transition">Return Policy</Link></li>
              <li><Link href="/policy/refund" className="hover:text-red-400 transition">Refund Policy</Link></li>
              <li><Link href="/policy/cancellation" className="hover:text-red-400 transition">Cancellation Policy</Link></li>
              <li><Link href="/policy/privacy" className="hover:text-red-400 transition">Privacy Policy</Link></li>
              <li><Link href="/policy/warranty" className="hover:text-red-400 transition">Warranty Policy</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Help &amp; Support</h4>
            <ul className="space-y-2 text-sm">
              {address && <li>{address}</li>}
              {phone && <li><a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold hover:text-red-400 transition">{phone}</a></li>}
              {email && <li><a href={`mailto:${email}`} className="font-semibold hover:text-red-400 transition">{email}</a></li>}
            </ul>
          </div>

          {/* Instagram - 2x2 grid, right of Help & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Instagram</h4>
            <div className="grid grid-cols-2 gap-2 w-full max-w-[180px]">
              {INSTAGRAM_GRID_IMAGES.map((url, i) => (
                <div key={i} className="aspect-square relative rounded overflow-hidden">
                  <Image
                    src={url}
                    alt={`Instagram ${i + 1}`}
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social icons - from admin or default */}
        <div className="border-t border-gray-800 mt-4 pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
          {socialLinks.length > 0 ? (
            socialLinks.map((s, i) => {
              const url = s.url || "#";
              const platform = (s.platform || "").toLowerCase();
              const renderIcon = () => {
                if (platform === "facebook") return <Facebook className="w-5 h-5" strokeWidth={2} />;
                if (platform === "youtube") return <Youtube className="w-5 h-5" strokeWidth={2} />;
                if (platform === "instagram") return <Instagram className="w-5 h-5" strokeWidth={2} />;
                if (platform === "tiktok") return <TiktokIcon size={20} />;
                if (platform === "twitter") return <Twitter className="w-5 h-5" strokeWidth={2} />;
                if (platform === "linkedin") return <Linkedin className="w-5 h-5" strokeWidth={2} />;
                return null;
              };
              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                  aria-label={platform}
                >
                  {renderIcon()}
                </a>
              );
            })
          ) : (
            <>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110" aria-label="Facebook">
                <Facebook className="w-5 h-5" strokeWidth={2} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110" aria-label="YouTube">
                <Youtube className="w-5 h-5" strokeWidth={2} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110" aria-label="Instagram">
                <Instagram className="w-5 h-5" strokeWidth={2} />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110" aria-label="TikTok">
                <TiktokIcon size={20} />
              </a>
            </>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-4 pt-4 text-center text-sm text-gray-500">
          drago © {new Date().getFullYear()}. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
