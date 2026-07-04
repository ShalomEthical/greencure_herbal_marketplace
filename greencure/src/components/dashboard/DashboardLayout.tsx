"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Leaf,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleLabel: string;
}

export default function DashboardLayout({
  children,
  navItems,
  roleLabel,
}: DashboardLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName = session?.user?.name || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (href: string) => {
    if (href.endsWith("/admin") || href.endsWith("/supplier") || href.endsWith("/delivery") || href.endsWith("/customer")) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-60 bg-stone-50 border-r border-stone-200/60 flex flex-col py-5 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-5 mb-8 mt-2">
          <Link href="/" className="flex flex-col items-start gap-1">
            <img src="/logo.png" alt="GreenCure" className="h-16 w-auto object-contain" />
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mt-1">
              {roleLabel}
            </p>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-forest-700 text-white font-semibold"
                  : "text-stone-600 hover:bg-stone-200/50 font-medium"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 space-y-0.5 border-t border-stone-200/60 pt-4 mt-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-stone-600 hover:bg-stone-200/50 font-medium"
          >
            <ChevronRight size={16} className="rotate-180" />
            <span>Back to Store</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-stone-600 hover:bg-stone-200/50 font-medium"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:ml-60 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-100 h-14">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <Menu size={18} />
              </button>
              <div className="hidden sm:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-earth-50 border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-forest-700/20 placeholder:text-stone-400"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors relative">
                <Bell size={16} className="text-stone-500" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <div className="h-6 w-px bg-stone-200" />
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-earth-900 leading-none">{userName}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{roleLabel}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center text-xs font-bold text-forest-700">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  );
}
