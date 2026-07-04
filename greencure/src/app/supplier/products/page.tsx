"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM").format(amount) + " FCFA";
}

const CATEGORIES = [
  "Herbal Teas", "Essential Oils", "Natural Supplements", "Skin Care",
  "Hair Care", "Superfoods", "Spices & Seasonings", "Detox & Cleanse",
];

export default function SupplierProductsPage() {
  const { status: authStatus } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", image: "", category: "Herbal Teas", stock: "10" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [authStatus]);

  async function fetchProducts() {
    if (authStatus !== "authenticated") return;
    try {
      const res = await fetch("/api/products?mine=true&all=true");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []));
    } catch (err) {
      console.error("Failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ name: "", description: "", price: "", image: "", category: "Herbal Teas", stock: "10" });
        await fetchProducts();
      }
    } catch (err) {
      console.error("Create failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-forest-700" size={24} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold font-headline text-forest-900">My Products</h2>
          <p className="text-sm text-stone-500 mt-1">{products.length} products listed</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm flex items-center gap-1.5">
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Product</>}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Product Name</label>
              <input required value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="input-field" placeholder="e.g. Moringa Leaf Tea" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Category</label>
              <select value={formData.category} onChange={(e) => setFormData(p => ({...p, category: e.target.value}))} className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Price (FCFA)</label>
              <input required type="number" value={formData.price} onChange={(e) => setFormData(p => ({...p, price: e.target.value}))} className="input-field" placeholder="3500" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Stock</label>
              <input required type="number" value={formData.stock} onChange={(e) => setFormData(p => ({...p, stock: e.target.value}))} className="input-field" placeholder="10" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Product Image</label>
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  const data = new FormData();
                  data.append("file", file);
                  
                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: data,
                    });
                    const json = await res.json();
                    if (json.url) {
                      setFormData(p => ({...p, image: json.url}));
                    }
                  } catch (err) {
                    console.error("Upload failed", err);
                  }
                }} 
                className="block w-full text-sm text-stone-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-xs file:font-semibold
                  file:bg-forest-50 file:text-forest-700
                  hover:file:bg-forest-100 transition-all cursor-pointer border border-stone-200 rounded-lg p-2 bg-white" 
              />
              {formData.image && (
                <div className="w-12 h-12 rounded-lg border border-stone-200 overflow-hidden flex-shrink-0 bg-stone-50">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Description</label>
            <textarea required rows={3} value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value}))} className="input-field resize-none" placeholder="Describe your product..." />
          </div>
          <button type="submit" disabled={saving || !formData.image} className="btn-primary text-sm disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin inline" size={14} /> : "Create Product"}
          </button>
        </form>
      )}

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        {products.length === 0 ? (
          <p className="text-sm text-stone-400 py-12 text-center">No products yet. Add your first product above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-earth-50">
                  <th className="table-header px-5 pt-4">Product</th>
                  <th className="table-header px-5 pt-4">Category</th>
                  <th className="table-header px-5 pt-4">Price</th>
                  <th className="table-header px-5 pt-4">Stock</th>
                  <th className="table-header px-5 pt-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-stone-50">
                    <td className="table-cell px-5">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-9 h-9 rounded-lg object-cover bg-stone-100" />
                        <span className="text-sm font-medium text-earth-900 line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="table-cell px-5 text-xs text-stone-500">{product.category}</td>
                    <td className="table-cell px-5 text-sm font-semibold text-forest-700">{formatFCFA(product.price)}</td>
                    <td className="table-cell px-5">
                      <span className={`text-xs font-semibold ${product.stock <= 5 ? "text-red-600" : "text-stone-600"}`}>{product.stock}</span>
                    </td>
                    <td className="table-cell px-5">
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                      </button>
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
