"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AdminConsultationsPage() {
  const { status: authStatus } = useSession();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const res = await fetch("/api/consultations");
        const data = await res.json();
        setConsultations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch consultations:", err);
      } finally {
        setLoading(false);
      }
    }
    if (authStatus === "authenticated") fetchConsultations();
  }, [authStatus]);

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
        <h2 className="text-2xl font-bold font-headline text-forest-900">Consultations</h2>
        <p className="text-sm text-stone-500 mt-1">{consultations.length} consultation requests</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-card overflow-hidden">
        {consultations.length === 0 ? (
          <p className="text-sm text-stone-400 py-12 text-center">No consultations booked</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-earth-50">
                  <th className="table-header px-5 pt-4">Patient</th>
                  <th className="table-header px-5 pt-4">Contact</th>
                  <th className="table-header px-5 pt-4">Date</th>
                  <th className="table-header px-5 pt-4">Time</th>
                  <th className="table-header px-5 pt-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c.id} className="border-b border-stone-50">
                    <td className="table-cell px-5">
                      <p className="text-sm font-medium text-earth-900">{c.name}</p>
                    </td>
                    <td className="table-cell px-5">
                      <p className="text-xs text-stone-500">{c.email}</p>
                      <p className="text-xs text-stone-400">{c.phone}</p>
                    </td>
                    <td className="table-cell px-5 text-sm text-stone-600">{c.date}</td>
                    <td className="table-cell px-5 text-sm text-stone-600">{c.time}</td>
                    <td className="table-cell px-5 text-xs text-stone-500 max-w-xs truncate">
                      {c.message}
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
