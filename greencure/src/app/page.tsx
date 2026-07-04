import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowRight, Leaf, ShieldCheck, Truck, Star, ShoppingBag, Eye, Search, Stethoscope } from "lucide-react";
import ProductCard from "@/components/ProductCard";

// Updated categories to use images instead of just emojis for a more premium look
const CATEGORIES = [
  { name: "Herbal Teas", image: "/category-tea.png", desc: "Healing infusions" },
  { name: "Essential Oils", image: "/category-oil.png", desc: "Therapeutic extracts" },
  { name: "Natural Supplements", image: "/category-supplements.png", desc: "Daily nutrition" },
  { name: "Skin Care", image: "/category-skincare.png", desc: "Natural beauty" },
];



export default async function HomePage() {
  const featuredProducts = await db.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { supplier: { select: { name: true } } },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section (Phlox Style Split) ── */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="space-y-8 z-10 relative">
              <div className="inline-flex items-center gap-2">
                <div className="w-8 h-[2px] bg-forest-600"></div>
                <span className="text-sm font-bold text-forest-700 uppercase tracking-widest">
                  Cameroon&apos;s #1 Herbal Marketplace
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-earth-900 leading-tight tracking-tight">
                100% Natural Herbal Remedies, <br />
                <span className="text-forest-700">Made in Cameroon.</span>
              </h1>
              
              <p className="text-stone-500 text-lg max-w-md leading-relaxed">
                Discover the healing power of nature with GreenCure. We offer high-quality, ready-to-use herbal supplements and botanical extracts designed to support your everyday health and wellness.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-forest-700 text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-forest-900 transition-colors shadow-lg shadow-forest-900/20"
                >
                  Shop Local Remedies
                  <ArrowRight size={16} />
                </Link>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex -space-x-3">
                    <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Customer" />
                    <img src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Customer" />
                    <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="Customer" />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-earth-900">4.9/5</p>
                    <p className="text-stone-400 text-xs">Trusted locally</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/hero-bg1.jpeg" 
                alt="Fresh herbs" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4">
                <div className="bg-forest-100 p-3 rounded-xl text-forest-700">
                  <Leaf size={24} />
                </div>
                <div>
                  <p className="font-bold text-earth-900 text-lg">100% Pure</p>
                  <p className="text-stone-500 text-sm">Sourced in Cameroon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-stone-100">
            {[
              { icon: Truck, title: "Fast Delivery in Cameroon", desc: "Douala, Yaoundé, Bamenda & beyond" },
              { icon: ShieldCheck, title: "Locally Verified", desc: "Trusted by traditional practitioners" },
              { icon: Leaf, title: "Community Sourced", desc: "Directly from Cameroonian farmers" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col md:flex-row items-center md:items-start gap-4 pt-6 md:pt-0 md:px-8 first:pl-0 last:pr-0">
                <div className="text-forest-600">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-earth-900 mb-1">{title}</h3>
                  <p className="text-stone-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── Categories (Image Cards) ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold font-headline text-earth-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Explore our wide range of natural products carefully categorized for your specific wellness needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-80 rounded-2xl overflow-hidden flex items-end p-6"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative z-10 w-full flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-white/80 text-sm">{cat.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white text-forest-900 flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products (New Styling) ── */}
      <section className="bg-stone-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <div className="w-8 h-[2px] bg-forest-600 mb-4"></div>
              <h2 className="text-3xl lg:text-4xl font-bold font-headline text-earth-900 mb-3">
                Trending Products
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900 uppercase tracking-wider"
            >
              View All Shop <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-stone-500">
              Discover the most sought-after natural remedies chosen by our community this week.
            </p>
          </div>
        </div>
      </section>

      {/* ── About GreenCure ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-8 h-[2px] bg-forest-600 mb-6"></div>
            <h2 className="text-3xl lg:text-4xl font-bold font-headline text-earth-900">
              About GreenCure
            </h2>
          </div>
          <div className="space-y-6 text-stone-600 text-lg leading-relaxed text-justify">
            <p>
              Our roots are firmly planted in the rich, volcanic soils of Buea, at the foot of Mount Cameroon. As a proudly Cameroonian digital marketplace, our goals and values begin with honoring humanity’s timeless practice of natural African healing, while marrying it with cutting-edge scientific research and modern convenience aimed for our modern way of life.
            </p>
            <p>
              While our operations are proudly based in Buea, we partner directly with local farmers, harvesters, and traditional practitioners from all across Cameroon to bring you the purest botanical extracts. Understanding the vast, powerful chemical constituents of our native plants, we carefully select herbs that offer the highest levels of bio-active compounds. We thoroughly research all of our raw materials, studying their composite nature and harmonious relationship to one another, to ensure every remedy you order delivers a direct, positive biological effect on your health.
            </p>
          </div>
        </div>
      </section>

      {/* ── Banner Section ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-forest-900">
            <img 
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&h=600&fit=crop" 
              alt="Banner" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="relative z-10 px-6 py-20 lg:py-28 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold font-headline text-white mb-6">
                Ready to start your natural wellness journey?
              </h2>
              <p className="text-stone-300 text-lg mb-10">
                Join thousands of customers who have discovered the power of pure, organic botanical remedies.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-forest-900 px-8 py-4 rounded-full font-bold hover:bg-stone-100 transition-colors shadow-xl"
              >
                Explore Collection
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
