"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM", { style: "decimal" }).format(amount) + " FCFA";
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="text-forest-700" size={18} />
            <h2 className="text-base font-bold text-forest-900 font-headline">
              Cart
              {itemCount > 0 && (
                <span className="ml-2 bg-forest-700 text-white text-[10px] rounded px-1.5 py-0.5 font-semibold">
                  {itemCount}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-stone-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-20">
              <ShoppingBag size={40} className="text-stone-200" />
              <p className="text-stone-400 font-medium text-sm">Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-forest-700 font-semibold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-earth-50 rounded-xl p-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-earth-900 text-sm truncate">{item.name}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">{item.category}</p>
                  <p className="text-forest-700 font-bold text-sm mt-1">{formatFCFA(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center hover:bg-stone-300 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center hover:bg-stone-300 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-1 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-stone-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-stone-500 font-medium text-sm">Subtotal</span>
              <span className="text-lg font-bold text-forest-900">{formatFCFA(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full bg-forest-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-forest-900 transition-colors text-sm"
            >
              Checkout
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-xs text-forest-700 font-semibold hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
