import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
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
      <Navbar />

      <div className="container">
        {/* Hero (banner carousel dipertahankan) */}
        <div className="mt-4">
          <BannerCarousel />
        </div>

        {/* Produk Pilihan */}
        <section className="py-7 border-b border-line last-of-type:border-b-0">
          <div className="flex flex-wrap items-center justify-between gap-3 my-7 mb-[1.1rem]">
            <div>
              <p className="font-display font-extrabold text-[1.1rem] text-ink mb-2">Produk Pilihan</p>
              <div className="flex gap-[18px] flex-wrap">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    className={`bg-transparent border-none pb-2 text-[13.5px] font-semibold cursor-pointer border-b-2 transition-colors ${
                      sort === s.key
                        ? "text-brand border-brand"
                        : "text-muted border-transparent hover:text-brand"
                    }`}
                    onClick={() => setSort(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/kategori" className="text-[13.5px] font-bold text-brand hover:underline">
              Lihat Semua
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-[14px] bg-cream-deep animate-pulse" />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-warn text-sm py-8">{error}</p>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-8">
                {sorted.slice(0, 12).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <div className="flex justify-center mt-2">
                <Link
                  to="/kategori"
                  className="inline-flex items-center gap-2 bg-brand !text-white font-bold text-sm px-8 py-3 rounded-full hover:bg-brand-dark transition-colors"
                  style={{ color: "#ffffff" }}
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
