import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "@/services/categoriesService";
import { mapCategoryOptions, type CategoryOption } from "@/lib/mapProduct";
import SafeImage from "@/components/SafeImage";

/**
 * Menampilkan kategori sebagai grid kartu bergambar (bukan sidebar) di
 * HomePage, diambil langsung dari GET Categories/ (lihat categoriesService.ts).
 * Tiap kategori jadi tautan ke /kategori/:id_kategori.
 */
export default function CategoryShowcase() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const res = await getCategories();
        if (!active) return;
        setCategories(mapCategoryOptions(res.data ?? []));
      } catch {
        if (!active) return;
        setError("Gagal memuat kategori.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  if (!loading && !error && categories.length === 0) return null;

  return (
    <section className="py-6 md:py-8">
      <div className="flex items-end justify-between gap-4 mb-5">
        <p className="font-display font-extrabold text-[1.35rem] text-ink tracking-tight">
          Belanja per Kategori
        </p>
        <Link
          to="/kategori"
          className="text-[13.5px] font-semibold text-ink-soft hover:text-ink transition-colors shrink-0"
        >
          Lihat Semua
        </Link>
      </div>

      {loading && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[110px] sm:w-[128px] aspect-[4/5] rounded-xl bg-cream-deep animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && <p className="text-sm text-warn">{error}</p>}

      {!loading && !error && categories.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar snap-x snap-mandatory">
          {categories.map((c) => (
            <Link
              key={c.key}
              to={`/kategori/${c.key}`}
              className="group shrink-0 w-[110px] sm:w-[128px] snap-start flex flex-col items-center gap-2.5 rounded-xl border border-line bg-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[var(--shadow-sm)]"
            >
              <div className="w-full aspect-square rounded-lg bg-cream-deep overflow-hidden flex items-center justify-center">
                <SafeImage
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                />
              </div>
              <span className="text-[12.5px] font-semibold text-ink-soft text-center leading-snug line-clamp-2 group-hover:text-ink">
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
