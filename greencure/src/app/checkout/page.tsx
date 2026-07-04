"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM", { style: "decimal" }).format(amount) + " FCFA";
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MTN_MOMO");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    } else if (session?.user) {
      setFullName(session.user.name || "");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const fullAddress = city ? `${address}, ${city}` : address;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: fullAddress,
          phone,
          paymentMethod,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order. Please try again.");
      } else {
        setSuccess(true);
        clearCart();
        setTimeout(() => router.push("/customer"), 2500);
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="animate-spin text-forest-700" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-forest-700 font-medium mb-6"
        >
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        <h1 className="text-2xl font-bold text-forest-900 font-headline mb-8">
          Checkout
        </h1>

        {success ? (
          <div className="max-w-lg mx-auto py-16 text-center">
            <div className="w-14 h-14 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-4 text-forest-700">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-xl font-bold font-headline text-forest-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Thank you for your order. We&apos;re preparing your botanical remedies. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl border border-stone-100 p-6">
                <h3 className="text-base font-bold font-headline text-forest-900 mb-5">
                  Delivery Details
                </h3>

                {error && (
                  <div className="flex gap-2 items-start p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 mb-5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+237 6XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Street, Quarter"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                      City / Town
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Buea, Douala, Yaoundé"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 block">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'MTN_MOMO' ? 'border-yellow-400 bg-yellow-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                        <input type="radio" name="payment" value="MTN_MOMO" checked={paymentMethod === 'MTN_MOMO'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'MTN_MOMO' ? 'border-yellow-500' : 'border-stone-300'}`}>
                          {paymentMethod === 'MTN_MOMO' && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
                        </div>
                        <span className="font-bold text-sm text-stone-800">MTN MoMo</span>
                      </label>
                      <label className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors ${paymentMethod === 'ORANGE_MONEY' ? 'border-orange-400 bg-orange-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                        <input type="radio" name="payment" value="ORANGE_MONEY" checked={paymentMethod === 'ORANGE_MONEY'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'ORANGE_MONEY' ? 'border-orange-500' : 'border-stone-300'}`}>
                          {paymentMethod === 'ORANGE_MONEY' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                        </div>
                        <span className="font-bold text-sm text-stone-800">Orange Money</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className="w-full btn-primary py-3 mt-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={16} /> Processing...
                      </span>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-5">
              <div className="bg-earth-50 rounded-xl p-6">
                <h3 className="text-base font-bold font-headline text-forest-900 mb-4">
                  Order Summary
                </h3>

                {items.length === 0 ? (
                  <p className="text-sm text-stone-400">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin pr-1">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center justify-between">
                          <div className="flex gap-3 items-center min-w-0">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                            <div className="min-w-0">
                              <p className="font-medium text-earth-900 text-sm truncate">{item.name}</p>
                              <p className="text-stone-400 text-xs">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-stone-700 text-sm whitespace-nowrap">
                            {formatFCFA(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm text-stone-500">
                        <span>Subtotal</span>
                        <span>{formatFCFA(total)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-stone-500">
                        <span>Delivery</span>
                        <span className="text-forest-700 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-forest-900 pt-2 border-t border-stone-200/50">
                        <span>Total</span>
                        <span>{formatFCFA(total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
