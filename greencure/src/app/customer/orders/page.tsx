"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function CustomerOrdersPage() {
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
        <h2 className="text-2xl font-bold font-headline text-forest-900">My Orders</h2>
        <p className="text-sm text-stone-500 mt-1">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-card p-12 text-center">
          <ShoppingCart className="mx-auto text-stone-200 mb-3" size={40} />
          <p className="text-sm text-stone-400 mb-4">No orders yet</p>
          <Link href="/shop" className="btn-primary text-sm">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-100 shadow-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="text-xs text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    ID: {order.id.slice(0, 8)} · {order.address}
                  </p>
                </div>
                <span className="text-lg font-bold text-forest-700">{formatFCFA(order.total)}</span>
              </div>
              <div className="border-t border-stone-50 pt-3 space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.product?.image} alt="" className="w-8 h-8 rounded-lg object-cover bg-stone-100" />
                      <div>
                        <p className="text-sm font-medium text-earth-900">{item.product?.name || "Product"}</p>
                        <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-stone-600">{formatFCFA(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              {order.deliveryAgent && (
                <div className="mt-3 pt-3 border-t border-stone-50 text-xs text-stone-400">
                  Delivery Agent: <span className="font-medium text-stone-600">{order.deliveryAgent.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
