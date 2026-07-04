"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Check, X, Loader2 } from "lucide-react";

export default function AdminSuppliersPage() {
  const { status: authStatus } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    }
    if (authStatus === "authenticated") fetchUsers();
  }, [authStatus]);

  const handleApproval = async (userId: string, approved: boolean) => {
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, approved }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, approved } : u))
      );
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const suppliers = users.filter((u) => u.role === "SUPPLIER");
  const filtered =
    filter === "pending"
      ? suppliers.filter((s) => !s.approved)
      : filter === "approved"
      ? suppliers.filter((s) => s.approved)
      : suppliers;

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
        <h2 className="text-2xl font-bold font-headline text-forest-900">Suppliers</h2>
        <p className="text-sm text-stone-500 mt-1">Manage supplier registrations and approvals.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              filter === f
                ? "bg-forest-700 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {f} ({f === "all" ? suppliers.length : f === "pending" ? suppliers.filter((s) => !s.approved).length : suppliers.filter((s) => s.approved).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-stone-400 py-12 text-center">No suppliers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-earth-50">
                  <th className="table-header px-5 pt-4">Supplier</th>
                  <th className="table-header px-5 pt-4">Email</th>
                  <th className="table-header px-5 pt-4">Status</th>
                  <th className="table-header px-5 pt-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-stone-50">
                    <td className="table-cell px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center text-[10px] font-bold text-forest-700">
                          {supplier.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-earth-900">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="table-cell px-5 text-sm text-stone-500">{supplier.email}</td>
                    <td className="table-cell px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        supplier.approved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                          : "bg-amber-50 text-amber-700 border border-amber-200/50"
                      }`}>
                        {supplier.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="table-cell px-5">
                      {!supplier.approved ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproval(supplier.id, true)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-forest-700 text-white hover:bg-forest-900 transition-colors"
                          >
                            <Check size={11} /> Approve
                          </button>
                          <button
                            onClick={() => handleApproval(supplier.id, false)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                          >
                            <X size={11} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">—</span>
                      )}
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
