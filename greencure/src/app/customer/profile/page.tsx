"use client";

import { useSession } from "next-auth/react";
import { User, Mail } from "lucide-react";

export default function CustomerProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline text-forest-900">Profile</h2>
        <p className="text-sm text-stone-500 mt-1">Your account information</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-card p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-forest-50 flex items-center justify-center text-lg font-bold text-forest-700">
            {session?.user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-lg font-bold text-forest-900 font-headline">
              {session?.user?.name || "User"}
            </p>
            <p className="text-sm text-stone-500">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
              Full Name
            </label>
            <div className="flex items-center gap-2 bg-earth-50 rounded-lg px-4 py-2.5">
              <User size={15} className="text-stone-400" />
              <span className="text-sm text-earth-900">{session?.user?.name || "—"}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
              Email Address
            </label>
            <div className="flex items-center gap-2 bg-earth-50 rounded-lg px-4 py-2.5">
              <Mail size={15} className="text-stone-400" />
              <span className="text-sm text-earth-900">{session?.user?.email || "—"}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
              Role
            </label>
            <div className="bg-earth-50 rounded-lg px-4 py-2.5">
              <span className="text-sm text-earth-900">
                {(session?.user as any)?.role || "Customer"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
