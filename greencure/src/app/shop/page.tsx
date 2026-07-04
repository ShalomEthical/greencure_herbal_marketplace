"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronRight, ChevronLeft, Loader2, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  "All",
  "Herbal Teas",
  "Essential Oils",
  "Natural Supplements",
  "Skin Care",
  "Superfoods",
  "Spices & Seasonings",
  "Detox & Cleanse",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name", label: "Name A–Z" },
];

const PRODUCTS_PER_PAGE = 24;

function formatFCFA(amount: number) {
  return new Intl.NumberFormat("fr-CM", { style: "decimal" }).format(amount) + " FCFA";
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  supplier?: { name: string | null };
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="First page"
      >
        <ChevronsLeft size={16} />
      </button>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-stone-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
              page === p
                ? "bg-forest-700 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Next page"
      >
        <ChevronRight size={16} />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Last page"
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category !== "All") params.set("category", category);
        if (sort) params.set("sort", sort);
        params.set("page", String(page));
        params.set("limit", String(PRODUCTS_PER_PAGE));
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        let sorted = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
        if (sort === "price_asc") sorted.sort((a: Product, b: Product) => a.price - b.price);
        if (sort === "price_desc") sorted.sort((a: Product, b: Product) => b.price - a.price);
        if (sort === "name") sorted.sort((a: Product, b: Product) => a.name.localeCompare(b.name));

        setProducts(sorted);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.total || sorted.length);
      } catch {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timeout);
  }, [search, category, sort, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-forest-900 pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-forest-200">Shop</span>
          </div>
          <h1 className="text-3xl font-bold font-headline text-white">Shop Botanical Remedies</h1>
          <p className="text-stone-300 mt-2 text-sm max-w-xl">
            Browse our curated collection of ethically sourced herbal remedies from the highlands of Cameroon.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9 text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Categories
                </p>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat
                          ? "bg-forest-700 text-white font-semibold"
                          : "text-stone-600 hover:bg-stone-100 font-medium"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Sort By
                </p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-field text-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters bar */}
            <div className="lg:hidden flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9 text-sm"
                />
              </div>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-600"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>
            </div>

            {/* Mobile filter panel */}
            {showMobileFilters && (
              <div className="lg:hidden bg-white border border-stone-100 rounded-xl p-4 mb-6 space-y-4 animate-slide-up">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        category === cat
                          ? "bg-forest-700 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-field text-sm"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Active filters */}
            {(category !== "All" || search) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-stone-400 font-medium">Active filters:</span>
                {category !== "All" && (
                  <button
                    onClick={() => setCategory("All")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-forest-50 text-forest-700 rounded text-xs font-medium"
                  >
                    {category}
                    <X size={12} />
                  </button>
                )}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-forest-50 text-forest-700 rounded text-xs font-medium"
                  >
                    &ldquo;{search}&rdquo;
                    <X size={12} />
                  </button>
                )}
              </div>
            )}

            {/* Results count + pagination info */}
            {!loading && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-stone-400 font-medium">
                  {totalProducts} {totalProducts === 1 ? "product" : "products"} found
                  {totalPages > 1 && (
                    <span className="ml-1">
                      · Page {page} of {totalPages}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden border border-stone-100 animate-pulse">
                    <div className="aspect-square bg-stone-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-stone-100 rounded w-1/3" />
                      <div className="h-4 bg-stone-100 rounded w-3/4" />
                      <div className="h-3 bg-stone-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search size={40} className="text-stone-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-400 mb-1 font-headline">
                  No products found
                </h3>
                <p className="text-sm text-stone-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="btn-primary text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
