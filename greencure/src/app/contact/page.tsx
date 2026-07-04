"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", date: "", time: "", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <section className="bg-forest-900 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-200 mb-3 block">
            Get in Touch
          </span>
          <h1 className="text-3xl font-bold font-headline text-white mb-3">
            Contact & Consultations
          </h1>
          <p className="text-stone-300 text-sm max-w-lg">
            Book a free consultation with our herbal medicine specialists or reach out
            with any questions about our products.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sage mb-4">
                Contact Information
              </p>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: "+237 674 448 795", sub: "Mon – Sat, 8am – 6pm" },
                  { icon: Mail, label: "hello@greencure.com", sub: "Response within 24 hours" },
                  { icon: MapPin, label: "Buea, Southwest Region", sub: "Cameroon" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-forest-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-forest-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-earth-900">{label}</p>
                      <p className="text-xs text-stone-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {success ? (
              <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-4 text-forest-700">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-forest-900 font-headline mb-2">
                  Request Submitted!
                </h3>
                <p className="text-sm text-stone-500">
                  We&apos;ll get back to you within 24 hours. Thank you!
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-100 p-6">
                <h3 className="text-base font-bold font-headline text-forest-900 mb-5">
                  Book a Consultation
                </h3>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2.5 font-medium border border-red-100 mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className="input-field"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className="input-field"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Phone</label>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        className="input-field"
                        placeholder="+237 6XX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Preferred Time</label>
                    <select
                      required
                      value={form.time}
                      onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select a time</option>
                      <option>8:00 AM</option>
                      <option>10:00 AM</option>
                      <option>12:00 PM</option>
                      <option>2:00 PM</option>
                      <option>4:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      className="input-field resize-none"
                      placeholder="Tell us about your wellness goals..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <><Send size={15} /> Submit Request</>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
