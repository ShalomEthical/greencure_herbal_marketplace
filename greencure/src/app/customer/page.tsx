"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { ShoppingCart, DollarSign, Package, Loader2, ArrowRight } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function CustomerDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed:", err);
      } finally {
        setLoading(false);
      }
    }
    if (authStatus === "authenticated") fetchOrders();
  }, [authStatus]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-forest-700" size={24} /></div>;
  }

  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const totalItems = orders.reduce(
    (sum: number, o: any) => sum + (o.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0),
    0
  );

  return (
    <div className="space-y-8">


      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Orders"
          value={orders.length}
          icon={<ShoppingCart size={18} className="text-forest-700" />}
        />
        <StatCard
          label="Items Purchased"
          value={totalItems}
          icon={<Package size={18} className="text-forest-700" />}
        />
        <StatCard
          label="Total Spent"
          value={formatFCFA(totalSpent)}
          icon={<DollarSign size={18} className="text-white" />}
          accent
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold font-headline text-forest-900">Recent Orders</h3>
          <Link href="/customer/orders" className="text-xs font-semibold text-forest-700 hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto text-stone-200 mb-3" size={36} />
            <p className="text-sm text-stone-400 mb-3">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className="btn-primary text-sm">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 4).map((order: any) => (
              <div key={order.id} className="bg-earth-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex -space-x-2">
                    {order.items?.slice(0, 3).map((item: any) => (
                      <img
                        key={item.id}
                        src={item.product?.image}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover border-2 border-white"
                      />
                    ))}
                    {(order.items?.length || 0) > 3 && (
                      <div className="w-8 h-8 rounded-lg bg-stone-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-stone-500">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-earth-900 truncate">
                      {order.items?.map((i: any) => i.product?.name).join(", ")}
                    </p>
                    <p className="text-xs text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-bold text-forest-700">{formatFCFA(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
