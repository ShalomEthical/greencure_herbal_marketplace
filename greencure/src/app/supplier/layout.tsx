"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

const NAV_ITEMS = [
  { href: "/supplier", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/supplier/products", label: "My Products", icon: <Package size={16} /> },
  { href: "/supplier/orders", label: "Orders", icon: <ShoppingCart size={16} /> },
];

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={NAV_ITEMS} roleLabel="Supplier Portal">
      {children}
    </DashboardLayout>
  );
}
