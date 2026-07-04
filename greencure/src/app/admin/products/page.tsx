"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Search, X } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

export default function AdminProductsPage() {
  const { status: authStatus } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?all=true");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    if (authStatus === "authenticated") fetchProducts();
  }, [authStatus]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-forest-700" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline text-forest-900">Products</h2>
        <p className="text-sm text-stone-500 mt-1">
          {products.length} products across {categories.length - 1} categories
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-field text-sm w-auto"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-stone-400 py-12 text-center">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-earth-50">
                  <th className="table-header px-5 pt-4">Product</th>
                  <th className="table-header px-5 pt-4">Category</th>
                  <th className="table-header px-5 pt-4">Price</th>
                  <th className="table-header px-5 pt-4">Stock</th>
                  <th className="table-header px-5 pt-4">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-stone-50">
                    <td className="table-cell px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-9 h-9 rounded-lg object-cover bg-stone-100"
                        />
                        <span className="text-sm font-medium text-earth-900 line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell px-5 text-xs text-stone-500">{product.category}</td>
                    <td className="table-cell px-5 text-sm font-semibold text-forest-700">
                      {formatFCFA(product.price)}
                    </td>
                    <td className="table-cell px-5">
                      <span className={`text-xs font-semibold ${
                        product.stock <= 5 ? "text-red-600" : product.stock <= 15 ? "text-amber-600" : "text-stone-600"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="table-cell px-5 text-xs text-stone-400">
                      {product.supplier?.name || "—"}
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
