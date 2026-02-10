"use client";

/**
 * Footer - Dark multi-column footer per design
 * Company, Customer Service, My Account, Social
 */

import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function TiktokIcon({ className, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();
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
            <p className="text-sm mb-4">{t("footer.tagline")}</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">{t("footer.address")}:</span> 123 Main St, Dhaka, Bangladesh</p>
              <p><span className="text-gray-400">{t("footer.phone")}:</span> +880 1XXX-XXXXXX</p>
              <p><span className="text-gray-400">{t("footer.email")}:</span> support@drago.com</p>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-red-400 transition">{t("footer.about")}</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition">{t("footer.contact")}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">{t("footer.services")}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">{t("footer.privacy")}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">{t("footer.terms")}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.customerService")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-red-400 transition">{t("footer.shipping")}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">{t("footer.faq")}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">{t("footer.paymentOptions")}</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.myAccount")}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-red-400 transition">{t("footer.profile")}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">{t("footer.wishlist")}</Link></li>
              <li><Link href="/cart" className="hover:text-red-400 transition">{t("footer.myCart")}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition">{t("footer.orderTracking")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Social icons - white circles, white icons, hover: white bg + black icon */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-wrap gap-4 justify-center md:justify-start">
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" strokeWidth={2} />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
            aria-label="YouTube"
          >
            <Youtube className="w-5 h-5" strokeWidth={2} />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" strokeWidth={2} />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
            aria-label="TikTok"
          >
            <TiktokIcon size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Drago. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
