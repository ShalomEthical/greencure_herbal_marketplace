"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Truck, CheckCircle2, Clock, Loader2, ArrowRight, MapPin, Phone } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function DeliveryDashboardPage() {
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

  const handleDeliver = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DELIVERED" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      }
    } catch (err) {
      console.error("Deliver failed:", err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-forest-700" size={24} /></div>;
  }

  const userId = (session?.user as any)?.id;
  const myOrders = orders.filter((o) => o.deliveryAgentId === userId);
  const availableOrders = orders.filter((o) => !o.deliveryAgentId && ["PENDING", "PROCESSING"].includes(o.status));
  const activeDeliveries = myOrders.filter((o) => o.status === "SHIPPED");
  const completedDeliveries = myOrders.filter((o) => o.status === "DELIVERED");

  return (
    <div className="space-y-8">


      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Available Orders"
          value={availableOrders.length}
          icon={<Clock size={18} className="text-forest-700" />}
          subtitle="Ready to claim"
        />
        <StatCard
          label="Active Deliveries"
          value={activeDeliveries.length}
          icon={<Truck size={18} className="text-forest-700" />}
          subtitle="In transit"
        />
        <StatCard
          label="Completed"
          value={completedDeliveries.length}
          icon={<CheckCircle2 size={18} className="text-white" />}
          accent
        />
      </div>

      {/* Active deliveries */}
      {activeDeliveries.length > 0 && (
        <div>
          <h3 className="text-base font-bold font-headline text-forest-900 mb-4">Active Deliveries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDeliveries.map((order: any) => (
              <div key={order.id} className="bg-white rounded-2xl border border-forest-200/30 shadow-card p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-semibold text-earth-900">{order.user?.name || "Customer"}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-400">
                      <MapPin size={12} /> {order.address}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-400">
                      <Phone size={12} /> {order.phone}
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-sm font-bold text-forest-700 mb-3">
                  {formatFCFA(order.total)} · {order.items?.length || 0} items
                </div>
                <button
                  onClick={() => handleDeliver(order.id)}
                  className="w-full bg-forest-700 text-white py-2 rounded-lg text-xs font-semibold hover:bg-forest-900 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle2 size={13} /> Mark as Delivered
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-headline text-forest-900">Available Orders</h3>
          <Link href="/delivery/available" className="text-xs font-semibold text-forest-700 hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {availableOrders.length === 0 ? (
          <div className="bg-earth-50 rounded-2xl p-8 text-center">
            <p className="text-sm text-stone-400">No available orders right now. Check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableOrders.slice(0, 4).map((order: any) => (
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
                <div className="text-sm font-bold text-forest-700 mb-3">
                  {formatFCFA(order.total)} · {order.items?.length || 0} items
                </div>
                <button
                  onClick={() => handleClaim(order.id)}
                  className="w-full bg-forest-700 text-white py-2 rounded-lg text-xs font-semibold hover:bg-forest-900 transition-colors flex items-center justify-center gap-1"
                >
                  <Truck size={13} /> Claim Delivery
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
