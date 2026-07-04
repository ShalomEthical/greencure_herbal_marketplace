"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Loader2, Truck, MapPin } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function AvailableOrdersPage() {
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

  const handleClaim = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryAgentId: (session?.user as any)?.id,
          status: "SHIPPED",
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      }
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  const available = orders.filter((o) => !o.deliveryAgentId && ["PENDING", "PROCESSING"].includes(o.status));

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-forest-700" size={24} /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline text-forest-900">Available Orders</h2>
        <p className="text-sm text-stone-500 mt-1">{available.length} orders awaiting delivery</p>
      </div>

      {available.length === 0 ? (
        <div className="bg-earth-50 rounded-2xl p-12 text-center">
          <Truck className="mx-auto text-stone-200 mb-3" size={40} />
          <p className="text-sm text-stone-400">No available orders right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {available.map((order: any) => (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-100 shadow-card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-semibold text-earth-900">{order.user?.name || "Customer"}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-400">
                    <MapPin size={12} /> {order.address}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="space-y-1 mb-3">
                {order.items?.map((item: any) => (
                  <p key={item.id} className="text-xs text-stone-500">
                    {item.product?.name} × {item.quantity}
                  </p>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-forest-700">{formatFCFA(order.total)}</span>
                <button
                  onClick={() => handleClaim(order.id)}
                  className="px-4 py-2 bg-forest-700 text-white rounded-lg text-xs font-semibold hover:bg-forest-900 transition-colors flex items-center gap-1"
                >
                  <Truck size={13} /> Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
