"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Leaf, Shield, Sprout, Star, Minus, Plus, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  supplier?: { name: string | null } | null;
}

interface Props {
  product: Product;
  related: Product[];
}

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM", { style: "decimal" }).format(amount) + " FCFA";
}

const BENEFITS = [
  "100% Organically Sourced",
  "Ethically Wild-Crafted",
  "Pharmacist Reviewed",
  "30-Day Satisfaction Guarantee",
];

export default function ProductDetailClient({ product, related }: Props) {
  const { addItem, setIsOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
    setAdded(true);
    setIsOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-8">
          <Link href="/" className="hover:text-forest-700 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-forest-700 transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-forest-700 transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-forest-700 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden sticky top-24 bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="inline-block text-[10px] font-semibold bg-forest-50 text-forest-700 px-2.5 py-1 rounded mb-3 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold text-forest-900 font-headline leading-tight mb-3">
                {product.name}
              </h1>
              {product.supplier && (
                <p className="text-sm text-stone-500">
                  Sourced by <span className="text-forest-700 font-semibold">{product.supplier.name || "Unknown Cooperative"}</span>
                </p>
              )}
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="text-xs text-stone-400 ml-1.5 font-medium">(24 reviews)</span>
              </div>
            </div>

            <div>
              <span className="text-3xl font-extrabold text-forest-700 font-headline">
                {formatFCFA(product.price)}
              </span>
              <span className="text-stone-400 text-sm ml-2 font-medium">per unit</span>
            </div>

            <p className="text-stone-600 text-sm leading-relaxed">{product.description}</p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                  <div className="w-5 h-5 rounded-full bg-forest-50 flex items-center justify-center flex-shrink-0">
                    <Leaf size={10} className="text-forest-700" />
                  </div>
                  {b}
                </div>
              ))}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
              <span className="text-xs font-semibold text-stone-500">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg border border-stone-200 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold text-earth-900 text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
                  added
                    ? "bg-forest-100 text-forest-700"
                    : product.stock === 0
                    ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                    : "bg-forest-700 text-white hover:bg-forest-900"
                }`}
              >
                <ShoppingBag size={15} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-5 pt-5 border-t border-stone-100">
              {[
                { icon: Shield, label: "Secure Checkout" },
                { icon: Sprout, label: "Carbon Neutral" },
                { icon: Leaf, label: "Certified Organic" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
                  <Icon size={13} className="text-forest-700" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-bold text-forest-900 font-headline mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/shop/product/${rel.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-card-hover hover:border-stone-200 transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-stone-100">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-earth-900 line-clamp-1 group-hover:text-forest-700 transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-sm font-bold text-forest-700 mt-1">{formatFCFA(rel.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
