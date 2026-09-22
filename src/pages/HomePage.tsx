import { useEffect, useMemo, useState } from "react";
import BannerCarousel from "@/components/BannerCarousel";
import ProductCard from "@/components/ProductCard";
import ButtonLink from "@/components/ui/ButtonLink";
import AnimatedGrid, { AnimatedGridItem } from "@/components/AnimatedGrid";
import FadeIn from "@/components/FadeIn";
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

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
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
  }, [products, sort]);

  return (
    <div>
      <div className="container pt-8">
        {/* Hero */}
        <FadeIn y={8}>
          <BannerCarousel />
        </FadeIn>

        <section className="py-10 md:py-14">
          <FadeIn
            delay={0.08}
            className="flex flex-wrap items-end justify-between gap-4 mb-8"
          >
            <p className="font-display font-extrabold text-[1.35rem] text-ink tracking-tight">
              Produk Pilihan
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.key}
                  className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
                    sort === s.key
                      ? "border-brand bg-brand text-white shadow-[var(--shadow-brand)]"
                      : "border-line bg-cream text-ink-soft hover:border-brand/20 hover:text-brand"
                  }`}
                  onClick={() => setSort(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[26px] border border-line bg-cream-deep animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[22px] border border-warn/20 bg-warn/5 px-4 py-10 text-center text-sm text-warn">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <AnimatedGrid
                key={sort}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-10"
              >
                {sorted.slice(0, 12).map((p) => (
                  <AnimatedGridItem key={p.id}>
                    <ProductCard product={p} />
                  </AnimatedGridItem>
                ))}
              </AnimatedGrid>

              <div className="flex justify-center">
                <ButtonLink
                  to="/kategori"
                  size="sm"
                  className="h-9! flex-shrink-0 px-4! md:px-5! text-white"
                >
                  Lihat Semua Produk
                </ButtonLink>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}