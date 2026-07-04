"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X, Leaf, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { itemCount, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on dashboard routes
  const isDashboard = ["/admin", "/supplier", "/delivery", "/customer"].some(
    (p) => pathname?.startsWith(p)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isDashboard) return null;

  const role = (session?.user as any)?.role;
  const dashboardLink =
    role === "ADMIN" ? "/admin" :
    role === "SUPPLIER" ? "/supplier" :
    role === "DELIVERY_AGENT" ? "/delivery" :
    "/customer";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-30 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 glass-nav shadow-sm border-b border-stone-100"
          : "bg-cream/80 glass-nav"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-28 lg:h-32">
          <Link href="/" className="flex items-center group">
            <img src="/logo.png" alt="GreenCure Logo" className="h-24 lg:h-28 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-forest-700 bg-forest-700/5"
                    : "text-stone-600 hover:text-forest-700 hover:bg-stone-100/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-lg hover:bg-stone-100/60 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} className="text-forest-700" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] bg-forest-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {session ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  href={dashboardLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-forest-700 hover:bg-forest-700/5 transition-colors"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100/60 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-forest-700 hover:bg-forest-700/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-forest-700 text-white hover:bg-forest-900 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-stone-100/60 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 space-y-1 animate-slide-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-forest-700 bg-forest-700/5"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-stone-100 pt-3 mt-3 space-y-1">
            {session ? (
              <>
                <Link
                  href={dashboardLink}
                  className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-forest-700 hover:bg-forest-700/5"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-stone-500 hover:bg-stone-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-forest-700 hover:bg-forest-700/5"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-center bg-forest-700 text-white hover:bg-forest-900 mt-1"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
