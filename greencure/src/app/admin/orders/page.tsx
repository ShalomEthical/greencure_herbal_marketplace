"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Loader2 } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function AdminOrdersPage() {
  const { status: authStatus } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    if (authStatus === "authenticated") fetchOrders();
  }, [authStatus]);

  const statuses = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const filtered = statusFilter === "ALL" ? orders : orders.filter((o) => o.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-forest-700" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline text-forest-900">Orders</h2>
        <p className="text-sm text-stone-500 mt-1">{orders.length} total orders</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s
                ? "bg-forest-700 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-stone-400 py-12 text-center">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-earth-50">
                  <th className="table-header px-5 pt-4">Order ID</th>
                  <th className="table-header px-5 pt-4">Customer</th>
                  <th className="table-header px-5 pt-4">Items</th>
                  <th className="table-header px-5 pt-4">Total</th>
                  <th className="table-header px-5 pt-4">Status</th>
                  <th className="table-header px-5 pt-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-stone-50">
                    <td className="table-cell px-5 text-xs font-mono text-stone-500">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="table-cell px-5">
                      <p className="text-sm font-medium text-earth-900">{order.user?.name || "—"}</p>
                      <p className="text-xs text-stone-400">{order.phone}</p>
                    </td>
                    <td className="table-cell px-5 text-xs text-stone-500">
                      {order.items?.length || 0} items
                    </td>
                    <td className="table-cell px-5 text-sm font-semibold text-forest-700">
                      {formatFCFA(order.total)}
                    </td>
                    <td className="table-cell px-5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="table-cell px-5 text-xs text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
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
  );
}
