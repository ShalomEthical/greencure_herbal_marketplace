import Link from "next/link";
import { Leaf, Shield, Heart, Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-forest-900 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-200 mb-3 block">
            Our Story
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold font-headline text-white leading-tight mb-4">
            Bridging Traditional Medicine with Modern Wellness
          </h1>
          <p className="text-stone-300 leading-relaxed max-w-2xl">
            GreenCure is rooted in the rich botanical heritage of Cameroon&apos;s
            Southwest Region, connecting local herbal practitioners and organic
            farmers with people seeking natural health solutions.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Leaf, title: "100% Natural", desc: "Every product is organically sourced with no synthetic additives or chemicals." },
            { icon: Shield, title: "Quality Tested", desc: "Our remedies undergo rigorous quality checks to ensure safety and efficacy." },
            { icon: Heart, title: "Community First", desc: "We work directly with local farmers, ensuring fair prices and sustainable practices." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-4">
                <Icon size={20} className="text-forest-700" />
              </div>
              <h3 className="text-base font-bold text-forest-900 font-headline mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-earth-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-sage mb-2 block text-center">
            How It Works
          </span>
          <h2 className="text-2xl font-bold text-forest-900 font-headline text-center mb-10">
            From Farm to Doorstep
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Sourcing", desc: "Suppliers harvest herbs from local farms" },
              { step: "02", title: "Quality Check", desc: "Products verified for purity and potency" },
              { step: "03", title: "Listing", desc: "Products published on the marketplace" },
              { step: "04", title: "Delivery", desc: "Orders delivered by verified local agents" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-forest-700 text-white flex items-center justify-center mx-auto mb-3 text-xs font-bold">
                  {step}
                </div>
                <h4 className="text-sm font-bold text-forest-900 mb-1">{title}</h4>
                <p className="text-xs text-stone-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold font-headline text-forest-900 mb-4">
          Ready to Explore?
        </h2>
        <p className="text-sm text-stone-500 mb-6 max-w-md mx-auto">
          Browse our curated collection of authentic herbal remedies.
        </p>
        <Link href="/shop" className="btn-primary inline-flex items-center gap-2 text-sm">
          Shop Now <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
