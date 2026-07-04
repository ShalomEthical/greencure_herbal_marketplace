"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Loader2, CheckCircle2, MapPin } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function CompletedDeliveriesPage() {
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

  const userId = (session?.user as any)?.id;
  const completed = orders.filter((o) => o.deliveryAgentId === userId && o.status === "DELIVERED");

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-forest-700" size={24} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline text-forest-900">Completed Deliveries</h2>
        <p className="text-sm text-stone-500 mt-1">{completed.length} deliveries completed</p>
      </div>

      {completed.length === 0 ? (
        <div className="bg-earth-50 rounded-2xl p-12 text-center">
          <CheckCircle2 className="mx-auto text-stone-200 mb-3" size={40} />
          <p className="text-sm text-stone-400">No completed deliveries yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-earth-50">
                  <th className="table-header px-5 pt-4">Customer</th>
                  <th className="table-header px-5 pt-4">Address</th>
                  <th className="table-header px-5 pt-4">Items</th>
                  <th className="table-header px-5 pt-4">Total</th>
                  <th className="table-header px-5 pt-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {completed.map((order: any) => (
                  <tr key={order.id} className="border-b border-stone-50">
                    <td className="table-cell px-5 text-sm font-medium text-earth-900">
                      {order.user?.name || "—"}
                    </td>
                    <td className="table-cell px-5 text-xs text-stone-500">
                      <div className="flex items-center gap-1"><MapPin size={11} /> {order.address}</div>
                    </td>
                    <td className="table-cell px-5 text-xs text-stone-500">{order.items?.length || 0} items</td>
                    <td className="table-cell px-5 text-sm font-semibold text-forest-700">{formatFCFA(order.total)}</td>
                    <td className="table-cell px-5"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
