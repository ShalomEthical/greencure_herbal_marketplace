"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Loader2 } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function SupplierOrdersPage() {
  const { status: authStatus } = useSession();
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline text-forest-900">Orders</h2>
        <p className="text-sm text-stone-500 mt-1">Orders containing your products</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-sm text-stone-400 py-12 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-earth-50">
                  <th className="table-header px-5 pt-4">Customer</th>
                  <th className="table-header px-5 pt-4">Products</th>
                  <th className="table-header px-5 pt-4">Total</th>
                  <th className="table-header px-5 pt-4">Status</th>
                  <th className="table-header px-5 pt-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-stone-50">
                    <td className="table-cell px-5">
                      <p className="text-sm font-medium text-earth-900">{order.user?.name || "—"}</p>
                      <p className="text-xs text-stone-400">{order.address}</p>
                    </td>
                    <td className="table-cell px-5">
                      <div className="space-y-1">
                        {order.items?.slice(0, 2).map((item: any) => (
                          <p key={item.id} className="text-xs text-stone-500">
                            {item.product?.name || "Product"} × {item.quantity}
                          </p>
                        ))}
                        {(order.items?.length || 0) > 2 && (
                          <p className="text-xs text-stone-400">+{order.items.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="table-cell px-5 text-sm font-semibold text-forest-700">
                      {formatFCFA(order.total)}
                    </td>
                    <td className="table-cell px-5"><StatusBadge status={order.status} /></td>
                    <td className="table-cell px-5 text-xs text-stone-400">
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
