"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard routes
  const isDashboard = ["/admin", "/supplier", "/delivery", "/customer"].some(
    (p) => pathname?.startsWith(p)
  );
  if (isDashboard) return null;

  return (
    <footer className="bg-forest-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 w-fit hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="GreenCure Logo" className="h-24 lg:h-32 w-auto rounded object-contain bg-white/10 p-2" />
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Ethically sourced botanical products from the heart of
              Cameroon&apos;s highland rainforests. Traditional wellness for the
              modern soul.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center hover:bg-sage-dark transition-colors text-stone-400 hover:text-white"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center hover:bg-sage-dark transition-colors text-stone-400 hover:text-white"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="mailto:hello@greencure.com"
                className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center hover:bg-sage-dark transition-colors text-stone-400 hover:text-white"
                aria-label="Email"
              >
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-forest-200 mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Shop Remedies", href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-forest-200 mb-5">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                "Our Heritage",
                "Ethical Sourcing",
                "Shipping & Returns",
                "Privacy Policy",
                "Terms of Service",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-forest-200 mb-5">
              Stay Connected
            </h4>
            <p className="text-stone-400 text-sm mb-4">
              Get botanical insights and early access to seasonal harvests.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/8 border border-white/10 rounded-lg px-4 py-2.5 text-sm placeholder:text-stone-500 focus:outline-none focus:border-forest-200 transition-colors"
              />
              <button className="bg-sage-dark hover:bg-sage text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Subscribe
              </button>
            </div>
            <div className="mt-6 space-y-2 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-forest-200" />
                <span>+237 674 448 795</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-forest-200" />
                <span>Buea, Southwest Region, Cameroon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-xs">
            © 2026 GreenCure Cameroon. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-stone-500">
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
