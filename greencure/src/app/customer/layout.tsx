"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, ShoppingCart, Heart, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/customer", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/customer/orders", label: "My Orders", icon: <ShoppingCart size={16} /> },
  { href: "/customer/profile", label: "Profile", icon: <User size={16} /> },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={NAV_ITEMS} roleLabel="My Account">
      {children}
    </DashboardLayout>
  );
}
