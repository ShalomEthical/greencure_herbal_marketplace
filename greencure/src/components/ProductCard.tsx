"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatFCFA } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  supplier?: { name: string | null };
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-card-hover transition-all">
      <Link href={`/shop/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 right-3 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/50 px-2 py-0.5 rounded">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-xs font-semibold bg-white text-stone-700 px-3 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Quick View Button Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickView(true);
              }}
              className="bg-white/90 backdrop-blur-sm text-earth-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-forest-700 hover:text-white transition-all scale-75 group-hover:scale-100"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/shop/product/${product.id}`}>
          <p className="text-xs text-stone-400 font-medium mb-1">{product.category}</p>
          <h3 className="text-sm font-semibold text-earth-900 line-clamp-1 group-hover:text-forest-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-50">
          <span className="text-sm font-bold text-forest-700">
            {formatFCFA(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              added
                ? "bg-forest-50 text-forest-700"
                : product.stock === 0
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-forest-700 text-white hover:bg-forest-900"
            }`}
          >
            <ShoppingBag size={12} />
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickView(false);
            }}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-up flex flex-col md:flex-row max-h-[90vh]">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickView(false);
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-stone-500 hover:text-earth-900 hover:bg-white transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="md:w-1/2 bg-stone-50 p-6 flex items-center justify-center">
              <img src={product.image} alt={product.name} className="max-h-80 w-auto object-contain rounded-xl mix-blend-multiply" />
            </div>
            
            <div className="md:w-1/2 p-8 overflow-y-auto">
              <span className="text-xs font-bold text-forest-700 uppercase tracking-wider block mb-2">{product.category}</span>
              <h2 className="text-2xl font-bold font-headline text-earth-900 mb-2">{product.name}</h2>
              <p className="text-2xl font-bold text-forest-700 mb-6">{formatFCFA(product.price)}</p>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-bold text-sm text-earth-900 border-b border-stone-100 pb-2">Description</h4>
                <p className="text-stone-600 text-sm leading-relaxed">{product.description}</p>
              </div>
              
              <button
                onClick={(e) => {
                  handleAdd(e);
                  if (added) setShowQuickView(false);
                }}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${
                  added
                    ? "bg-forest-50 text-forest-700 border border-forest-200"
                    : product.stock === 0
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-forest-700 text-white hover:bg-forest-800 shadow-lg shadow-forest-900/20"
                }`}
              >
                <ShoppingBag size={18} />
                {product.stock === 0 ? "Out of Stock" : added ? "Added to Cart!" : "Add to Cart"}
              </button>
              
              <Link 
                href={`/shop/product/${product.id}`}
                className="block text-center mt-4 text-sm font-semibold text-stone-500 hover:text-forest-700 transition-colors"
              >
                View full product details →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
