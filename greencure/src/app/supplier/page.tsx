"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Package, ShoppingCart, DollarSign, Loader2, ArrowRight, Plus } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function SupplierDashboardPage() {
  const { status: authStatus } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/products?mine=true&all=true"),
          fetch("/api/orders"),
        ]);
        const [productsData, ordersData] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
        ]);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (authStatus === "authenticated") fetchData();
  }, [authStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-forest-700" size={24} />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-end">
        <Link
          href="/supplier/products"
          className="btn-primary text-sm flex items-center gap-1.5"
        >
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Products"
          value={products.length}
          icon={<Package size={18} className="text-forest-700" />}
          subtitle={`${products.filter((p) => p.stock <= 5).length} low stock`}
        />
        <StatCard
          label="Total Orders"
          value={orders.length}
          icon={<ShoppingCart size={18} className="text-forest-700" />}
          subtitle={`${orders.filter((o) => o.status === "PENDING").length} pending`}
        />
        <StatCard
          label="Revenue"
          value={formatFCFA(totalRevenue)}
          icon={<DollarSign size={18} className="text-white" />}
          accent
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold font-headline text-forest-900">Recent Orders</h3>
          <Link href="/supplier/orders" className="text-xs font-semibold text-forest-700 hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-stone-400 py-8 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Items</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="table-cell text-sm font-medium text-earth-900">
                      {order.user?.name || "—"}
                    </td>
                    <td className="table-cell text-xs text-stone-500">
                      {order.items?.length || 0} items
                    </td>
                    <td className="table-cell text-sm font-semibold text-forest-700">
                      {formatFCFA(order.total)}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="table-cell text-xs text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
