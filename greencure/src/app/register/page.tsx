"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const ROLES = [
  { value: "CUSTOMER", label: "Customer", desc: "Buy botanical remedies" },
  { value: "SUPPLIER", label: "Supplier", desc: "List and sell products" },
  { value: "DELIVERY_AGENT", label: "Delivery Agent", desc: "Manage deliveries" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Registration failed. Please try again.");
      } else {
        setStatus("success");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel — image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-forest-900">
        <img
          src="/hero-bg1.jpeg"
          alt="Natural ingredients"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-end p-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Leaf size={15} className="text-forest-200" />
              </div>
              <span className="text-lg font-extrabold text-white font-headline">GreenCure</span>
            </div>
            <p className="text-stone-300 text-sm max-w-sm leading-relaxed">
              Join our community of herbal wellness enthusiasts. Start your natural health journey today.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center">
                <Leaf size={15} className="text-white" />
              </div>
              <span className="text-lg font-extrabold text-forest-900 font-headline">GreenCure</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-forest-900 font-headline mb-1">Create Account</h1>
          <p className="text-sm text-stone-500 mb-8">Join our botanical wellness community</p>

          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-4 text-forest-700">
                <Leaf size={24} />
              </div>
              <h3 className="text-lg font-bold text-forest-900 font-headline mb-2">Account Created!</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {form.role === "SUPPLIER"
                  ? "Your supplier account is pending admin approval."
                  : "Redirecting you to login..."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 block">
                  I am a...
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, role: role.value }))}
                      className={`p-3 rounded-lg text-left transition-all border ${
                        form.role === role.value
                          ? "border-forest-700 bg-forest-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <p className={`text-xs font-bold ${
                        form.role === role.value ? "text-forest-700" : "text-stone-700"
                      }`}>
                        {role.label}
                      </p>
                      <p className="text-[9px] text-stone-400 mt-0.5">{role.desc}</p>
                    </button>
                  ))}
                </div>
                {form.role === "SUPPLIER" && (
                  <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 mt-2">
                    Supplier accounts require admin approval.
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {status === "error" && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2.5 font-medium border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>Create Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-forest-700 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
