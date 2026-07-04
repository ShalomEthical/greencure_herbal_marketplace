"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/suppliers", label: "Suppliers", icon: <Users size={16} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={16} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={16} /> },
  { href: "/admin/consultations", label: "Consultations", icon: <MessageSquare size={16} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={NAV_ITEMS} roleLabel="Admin Panel">
      {children}
    </DashboardLayout>
  );
}
