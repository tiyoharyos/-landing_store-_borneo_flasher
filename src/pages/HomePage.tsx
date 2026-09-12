import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BannerCarousel from "@/components/BannerCarousel";
import ProductCard from "@/components/ProductCard";
import { type Product } from "@/data/products";
import { getProducts } from "@/services/productsService";
import { mapApiProductsToProducts } from "@/lib/mapProduct";
import { getApiErrorMessage } from "@/lib/axios";

type SortKey = "terlaris" | "termurah" | "termahal" | "terbaru";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "terlaris", label: "Paling Laris" },
  { key: "terbaru", label: "Terbaru" },
  { key: "termurah", label: "Termurah" },
  { key: "termahal", label: "Termahal" },
];

export default function HomePage() {
  const [sort, setSort] = useState<SortKey>("terlaris");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await getProducts();
        if (!active) return;
        setProducts(mapApiProductsToProducts(res.data ?? []));
      } catch (err) {
        if (!active) return;
        setError(getApiErrorMessage(err, "Gagal memuat produk."));
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      active = false;
    };
  }, []);

  const sorted = [...products].sort((a, b) => {
    switch (sort) {
      case "termurah":
        return a.price - b.price;
      case "termahal":
        return b.price - a.price;
      case "terbaru":
        return b.id.localeCompare(a.id);
      case "terlaris":
      default:
        return b.sold - a.sold;
    }
  });

  return (
    <div>

      <div className="container pt-8">
        {/* Hero */}
        <div>
          <BannerCarousel />
        </div>

        {/* Produk Pilihan */}
        <section className="py-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-display font-extrabold text-[1.35rem] text-ink mb-3 tracking-tight">
                Produk Pilihan
              </p>
              <div className="flex gap-6 flex-wrap">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    className={`bg-transparent border-none pb-1.5 text-[13.5px] font-medium cursor-pointer border-b-2 transition-colors ${
                      sort === s.key
                        ? "text-ink border-ink font-semibold"
                        : "text-muted border-transparent hover:text-ink"
                    }`}
                    onClick={() => setSort(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/kategori" className="text-[13.5px] font-semibold text-ink-soft hover:text-ink transition-colors">
              Lihat Semua
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-cream-deep animate-pulse" />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-warn text-sm py-8">{error}</p>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
                {sorted.slice(0, 12).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <div className="flex justify-center text-white">
                <Link
                  to="/kategori"
                  className="rounded-lg px-4 md:px-5 h-9 inline-flex items-center gap-2 bg-brand text-white  cursor-pointer whitespace-nowrap hover:bg-brand-dark active:scale-95 transition-all duration-200"
                >
                  Lihat Semua Produk
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
