"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Leaf, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setStatus("error");
      setError("Invalid email or password. Please try again.");
    } else {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      const role = session?.user?.role;

      const redirect =
        role === "ADMIN" ? "/admin" :
        role === "SUPPLIER" ? "/supplier" :
        role === "DELIVERY_AGENT" ? "/delivery" :
        "/customer";

      router.push(redirect);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel — image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-forest-900">
        <img
          src="/hero-bg1.jpeg"
          alt="Herbal remedies"
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
              Botanical wellness from the highlands of Cameroon. Traditional medicine for the modern soul.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center">
                <Leaf size={15} className="text-white" />
              </div>
              <span className="text-lg font-extrabold text-forest-900 font-headline">GreenCure</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-forest-900 font-headline mb-1">Welcome back</h1>
          <p className="text-sm text-stone-500 mb-8">Sign in to continue your wellness journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="text-[10px] text-stone-400 font-bold mb-3 uppercase tracking-wider">
              Demo Accounts (password: password123)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Admin", email: "admin@greencure.com" },
                { label: "Supplier", email: "supplier@greencure.com" },
                { label: "Delivery", email: "delivery@greencure.com" },
                { label: "Customer", email: "customer@greencure.com" },
              ].map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => { setEmail(demo.email); setPassword("password123"); }}
                  className="text-xs bg-earth-50 text-stone-600 py-2 px-3 rounded-lg hover:bg-earth-100 transition-colors font-medium text-left"
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-stone-500 mt-6">
            New to GreenCure?{" "}
            <Link href="/register" className="text-forest-700 font-semibold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
