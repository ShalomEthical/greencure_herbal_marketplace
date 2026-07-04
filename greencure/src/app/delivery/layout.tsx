"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutDashboard, Truck, CheckCircle2 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/delivery", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { href: "/delivery/available", label: "Available", icon: <Truck size={16} /> },
  { href: "/delivery/completed", label: "Completed", icon: <CheckCircle2 size={16} /> },
];

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navItems={NAV_ITEMS} roleLabel="Delivery Portal">
      {children}
    </DashboardLayout>
  );
}
