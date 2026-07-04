"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  DollarSign,
  Users,
  Package,
  ShieldCheck,
  ArrowRight,
  MoreVertical,
  Check,
  X,
  Loader2,
} from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function AdminDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/admin/users"),
          fetch("/api/products?all=true"),
        ]);
        const [ordersData, usersData, productsData] = await Promise.all([
          ordersRes.json(),
          usersRes.json(),
          productsRes.json(),
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    if (authStatus === "authenticated") fetchData();
  }, [authStatus]);

  const handleApproval = async (userId: string, approved: boolean) => {
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, approved }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, approved } : u))
      );
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-forest-700" size={24} />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const pendingSuppliers = users.filter(
    (u: any) => u.role === "SUPPLIER" && !u.approved
  );
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">


      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={formatFCFA(totalRevenue)}
          icon={<DollarSign size={18} className="text-forest-700" />}
          trend={{ value: "12.4%", positive: true }}
        />
        <StatCard
          label="Active Suppliers"
          value={users.filter((u: any) => u.role === "SUPPLIER" && u.approved).length}
          icon={<Users size={18} className="text-forest-700" />}
          subtitle={`${pendingSuppliers.length} pending approval`}
        />
        <StatCard
          label="Total Products"
          value={products.length}
          icon={<Package size={18} className="text-forest-700" />}
          subtitle="Across all categories"
        />
        <StatCard
          label="Pending Approvals"
          value={pendingSuppliers.length}
          icon={<ShieldCheck size={18} className="text-white" />}
          accent
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier approvals */}
        <div className="bg-earth-50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold font-headline text-forest-900">
              Supplier Approvals
            </h3>
            <Link
              href="/admin/suppliers"
              className="text-xs font-semibold text-forest-700 hover:underline"
            >
              View All
            </Link>
          </div>
          {pendingSuppliers.length === 0 ? (
            <p className="text-sm text-stone-400 py-8 text-center">
              No pending approvals
            </p>
          ) : (
            <div className="space-y-3">
              {pendingSuppliers.slice(0, 4).map((supplier: any) => (
                <div
                  key={supplier.id}
                  className="bg-white p-3.5 rounded-xl border border-stone-100 space-y-3"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-lg bg-forest-50 flex items-center justify-center text-xs font-bold text-forest-700">
                      {supplier.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-earth-900 truncate">
                        {supplier.name}
                      </p>
                      <p className="text-xs text-stone-400 truncate">
                        {supplier.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval(supplier.id, true)}
                      className="flex-1 bg-forest-700 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-forest-900 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      onClick={() => handleApproval(supplier.id, false)}
                      className="flex-1 bg-stone-100 text-stone-600 py-1.5 rounded-lg text-xs font-semibold hover:bg-stone-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={12} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-5 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold font-headline text-forest-900">
                Recent Transactions
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Latest marketplace activity
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-forest-700 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-stone-400 py-8 text-center">
              No orders yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Customer</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id}>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-forest-50 flex items-center justify-center text-[10px] font-bold text-forest-700">
                            {order.user?.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() || "??"}
                          </div>
                          <span className="text-sm font-medium text-earth-900">
                            {order.user?.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell text-sm font-semibold text-forest-900">
                        {formatFCFA(order.total)}
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="table-cell text-xs text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
