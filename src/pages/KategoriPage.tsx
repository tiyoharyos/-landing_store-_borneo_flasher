import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import AnimatedGrid, { AnimatedGridItem } from "@/components/AnimatedGrid";
import FadeIn from "@/components/FadeIn";
import { type Product } from "@/data/products";
import { getProducts } from "@/services/productsService";
import { getCategories } from "@/services/categoriesService";
import { mapApiProductsToProducts, mapCategoryOptions, type CategoryOption } from "@/lib/mapProduct";
import { getApiErrorMessage } from "@/lib/axios";
import SafeImage from "@/components/SafeImage";

type SortKey = "terbaru" | "terlaris" | "nama-az" | "nama-za" | "termurah" | "termahal" | "rating";
type Availability = "semua" | "tersedia" | "habis";

const PER_PAGE = 12;
const SEMUA_KATEGORI = "semua";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "terbaru", label: "Terbaru" },
  { key: "terlaris", label: "Paling Laris" },
  { key: "termurah", label: "Harga Terendah" },
  { key: "termahal", label: "Harga Tertinggi" },
  { key: "nama-az", label: "Nama A-Z" },
  { key: "nama-za", label: "Nama Z-A" },
  { key: "rating", label: "Rating Tertinggi" },
];

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];

  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  range.push(1);
  if (start > 2) range.push("...");
  for (let i = start; i <= end; i++) range.push(i);
  if (end < total - 1) range.push("...");
  if (total > 1) range.push(total);

  return range;
}

export default function KategoriPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = category && category !== SEMUA_KATEGORI ? category : SEMUA_KATEGORI;

  const query = searchParams.get("cari") ?? "";

  const [categoryFilter, setCategoryFilter] = useState<string>(urlCategory);
  const [sort, setSort] = useState<SortKey>("terbaru");
  const [availability, setAvailability] = useState<Availability>("semua");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategoryFilter(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((res) => {
        if (!active) return;
        setCategories(mapCategoryOptions(res.data ?? []));
      })
      .catch(() => {
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await getProducts({
          search: query || undefined,
          id_kategori: categoryFilter !== SEMUA_KATEGORI ? categoryFilter : undefined,
        });
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
  }, [categoryFilter, query]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, query, sort, availability, priceMin, priceMax]);

  useEffect(() => {
    if (!mobileFilterOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileFilterOpen]);

  const filtered = useMemo(() => {
    let items = [...products];

    if (availability === "tersedia") items = items.filter((p) => p.stock > 0);
    if (availability === "habis") items = items.filter((p) => p.stock === 0);

    const min = priceMin ? Number(priceMin) : null;
    const max = priceMax ? Number(priceMax) : null;
    if (min !== null) items = items.filter((p) => p.price >= min);
    if (max !== null) items = items.filter((p) => p.price <= max);

    items.sort((a, b) => {
      switch (sort) {
        case "nama-az":
          return a.name.localeCompare(b.name);
        case "nama-za":
          return b.name.localeCompare(a.name);
        case "termurah":
          return a.price - b.price;
        case "termahal":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "terlaris":
          return b.sold - a.sold;
        case "terbaru":
        default:
          return b.id.localeCompare(a.id);
      }
    });

    return items;
  }, [products, availability, priceMin, priceMax, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeCategoryLabel =
    categoryFilter === SEMUA_KATEGORI
      ? "Semua Produk"
      : categories.find((c) => c.key === categoryFilter)?.label ?? "Semua Produk";

  const activeFilters: { label: string; onClear: () => void }[] = [];
  if (categoryFilter !== SEMUA_KATEGORI)
    activeFilters.push({ label: activeCategoryLabel, onClear: () => goToCategory(SEMUA_KATEGORI) });
  if (query.trim()) activeFilters.push({ label: `Cari: "${query.trim()}"`, onClear: clearSearch });
  if (availability !== "semua")
    activeFilters.push({
      label: availability === "tersedia" ? "Tersedia" : "Stok Habis",
      onClear: () => setAvailability("semua"),
    });
  if (priceMin) activeFilters.push({ label: `Min Rp ${priceMin}`, onClear: () => setPriceMin("") });
  if (priceMax) activeFilters.push({ label: `Max Rp ${priceMax}`, onClear: () => setPriceMax("") });

  function goToCategory(key: string) {
    setCategoryFilter(key);
    setMobileFilterOpen(false);
    navigate(`/kategori/${key}${query ? `?cari=${encodeURIComponent(query)}` : ""}`);
  }

  function clearSearch() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("cari");
      return next;
    });
  }

  const resetAllFilters = () => {
    setAvailability("semua");
    setPriceMin("");
    setPriceMax("");
    setSort("terbaru");
    setCategoryFilter(SEMUA_KATEGORI);
    setMobileFilterOpen(false);
    navigate("/kategori");
  };

  const filterContent = (
    <>
      <div className="pb-5 border-b border-line last-of-type:border-b-0 last-of-type:pb-0">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display font-bold text-[13px] text-ink">Kategori</p>
          <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand">
            {categories.length}
          </span>
        </div>
        <ul className="list-none m-0 p-0 flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-1">
          <li>
            <button
              type="button"
              className={`flex items-center gap-2.5 w-full bg-transparent border-none text-left px-2.5 py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
                categoryFilter === SEMUA_KATEGORI
                  ? "bg-brand-tint text-brand ring-1 ring-brand/15 "
                  : "text-ink-soft hover:bg-cream-deep hover:text-ink"
              }`}
              onClick={() => goToCategory(SEMUA_KATEGORI)}
            >
              <Icon icon="mdi:view-grid-outline" width={16} />
              <span>Semua Produk</span>
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                className={`flex items-center gap-2.5 w-full bg-transparent border-none text-left px-2.5 py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
                  categoryFilter === c.key
                    ? "bg-brand-tint text-brand ring-1 ring-brand/15"
                    : "text-ink-soft hover:bg-cream-deep hover:text-ink"
                }`}
                onClick={() => goToCategory(c.key)}
              >
                <SafeImage src={c.image} alt="" className="w-4 h-4 rounded object-cover shrink-0 ring-1 ring-line" />
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="pb-5 border-b border-line last-of-type:border-b-0 last-of-type:pb-0">
        <p className="font-display font-bold text-[13px] text-ink mb-2.5">Ketersediaan</p>
        <div className="space-y-2">
          {(
            [
              { key: "semua", label: "Semua Produk" },
              { key: "tersedia", label: "Tersedia" },
              { key: "habis", label: "Stok Habis" },
            ] as { key: Availability; label: string }[]
          ).map((opt) => (
            <label
              key={opt.key}
              className={`flex items-center gap-2.5 text-[13.5px] cursor-pointer rounded-lg px-2 py-1.5 transition-colors ${
                availability === opt.key ? "bg-brand-tint text-brand" : "text-ink-soft hover:bg-cream-deep hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name="availability"
                className="accent-brand"
                checked={availability === opt.key}
                onChange={() => setAvailability(opt.key)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="pb-5 border-b border-line last-of-type:border-b-0 last-of-type:pb-0">
        <p className="font-display font-bold text-[13px] text-ink mb-2.5">Range Harga</p>
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 w-0">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-muted pointer-events-none">
              Rp
            </span>
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full border border-line bg-cream rounded-xl pl-7 pr-2 py-2.5 text-[13px] outline-none transition focus:border-brand focus:bg-surface"
            />
          </div>
          <span className="text-muted">-</span>
          <div className="relative flex-1 w-0">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] text-muted pointer-events-none">
              Rp
            </span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full border border-line bg-cream rounded-xl pl-7 pr-2 py-2.5 text-[13px] outline-none transition focus:border-brand focus:bg-surface"
            />
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        fullWidth
        onClick={resetAllFilters}
        className="mt-2! border-brand/20! bg-brand-tint! text-brand! hover:bg-brand/8!"
      >
        Reset Filter
      </Button>
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="container pt-6 pb-14">
   

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 pb-16">
          <FadeIn className="hidden lg:flex flex-col gap-6 bg-surface/90 border border-line rounded-[26px] p-5 shadow-[var(--shadow-sm)] backdrop-blur-sm self-start lg:sticky lg:top-[90px]">
            {filterContent}
          </FadeIn>

          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-[95]">
              <div
                className="absolute inset-0 bg-overlay animate-[modalIn_0.2s_ease-out]"
                onClick={() => setMobileFilterOpen(false)}
              />
              <aside className="absolute inset-y-0 left-0 w-[85vw] max-w-[320px] bg-surface/95 backdrop-blur-md flex flex-col shadow-[var(--shadow-lg)] animate-slide-in-left">
                <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
                  <p className="font-display font-bold text-[14.5px] text-ink">Filter Produk</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="mdi:close"
                    onClick={() => setMobileFilterOpen(false)}
                    aria-label="Tutup filter"
                    className="w-8! h-8! p-0! rounded-full!"
                  />
                </div>
                <div className="p-5 flex flex-col gap-5 overflow-y-auto">{filterContent}</div>
                <div className="p-4 border-t border-line shrink-0">
                  <Button variant="primary" size="lg" fullWidth onClick={() => setMobileFilterOpen(false)}>
                    Tampilkan {filtered.length} Produk
                  </Button>
                </div>
              </aside>
            </div>
          )}

          {/* Main content */}
          <FadeIn delay={0.05} className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/80 px-3 py-3 shadow-sm backdrop-blur-sm">
              <p className="text-[13.5px] text-ink-soft">
                {!loading && !error && (
                  <>
                    <span className="font-bold text-ink">{filtered.length}</span> produk
                    {categoryFilter !== SEMUA_KATEGORI && (
                      <>
                        {" "}
                        di <span className="font-semibold text-ink">{activeCategoryLabel}</span>
                      </>
                    )}
                  </>
                )}
              </p>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    aria-label="Urutkan produk"
                    className="h-10 border border-line bg-cream rounded-xl pl-3 pr-9 text-[12.75px] font-semibold text-ink outline-none appearance-none cursor-pointer transition-all focus:border-brand focus:bg-surface"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        Urutkan: {opt.label}
                      </option>
                    ))}
                  </select>
                  <Icon
                    icon="mdi:chevron-down"
                    width={15}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                  />
                </div>

                <Button
                  variant="outline"
                  icon="mdi:filter-variant"
                  onClick={() => setMobileFilterOpen(true)}
                  className="relative h-10! border-brand/20! bg-brand-tint! text-brand! flex! lg:hidden! hover:bg-brand/8!"
                >
                  Filter
                  {activeFilters.length > 0 && (
                    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-brand text-white text-[10px] font-bold">
                      {activeFilters.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {activeFilters.map((f) => (
                  <Button
                    key={f.label}
                    variant="subtle"
                    iconRight="mdi:close"
                    onClick={f.onClear}
                    className="h-auto! w-auto! rounded-full! px-3! py-1.5! bg-brand-tint! border-none! text-brand! text-xs shadow-sm"
                  >
                    {f.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={resetAllFilters}
                  className="h-auto! w-auto! p-0! border-none! text-warn! text-[12.5px] hover:bg-transparent! hover:underline"
                >
                  Hapus Semua
                </Button>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-[22px] border border-line bg-cream-deep animate-pulse" />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-[22px] border border-warn/20 bg-warn/5 px-4 py-12 text-center text-sm text-warn">
                {error}
              </div>
            )}

            {!loading && !error && (
              paged.length ? (
                <>
                  <AnimatedGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                    {paged.map((p) => (
                      <AnimatedGridItem key={p.id}>
                        <ProductCard product={p} />
                      </AnimatedGridItem>
                    ))}
                  </AnimatedGrid>

                  {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center gap-1.5 my-9 mb-12">
                      <Button
                        variant="outline"
                        icon="mdi:chevron-left"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="Sebelumnya"
                        className="min-w-9! w-9! h-9! p-0! hover:enabled:border-brand! hover:enabled:text-brand!"
                      />
                      {getPageNumbers(page, totalPages).map((n, idx) =>
                        n === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="min-w-9 h-9 px-1.5 flex items-center justify-center text-[13px] font-semibold text-muted select-none"
                          >
                            ...
                          </span>
                        ) : (
                          <Button
                            key={n}
                            variant={page === n ? "primary" : "outline"}
                            onClick={() => setPage(n)}
                            className={`min-w-9! w-9! h-9! p-0! ${
                              page === n ? "" : "hover:border-brand! hover:text-brand!"
                            }`}
                          >
                            {n}
                          </Button>
                        )
                      )}
                      <Button
                        variant="outline"
                        icon="mdi:chevron-right"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        aria-label="Berikutnya"
                        className="min-w-9! w-9! h-9! p-0! hover:enabled:border-brand! hover:enabled:text-brand!"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-[26px] border border-dashed border-line bg-surface px-6 py-14 text-center shadow-sm">
                  <Icon icon="mdi:package-variant-closed" width={64} className="text-line inline-block" />
                  <p className="font-display font-bold text-[1.1rem] mt-4 text-ink">Produk Tidak Ditemukan</p>
                  <p className="text-muted text-sm mt-1">Coba ubah kata kunci atau filter pencarian Anda.</p>
                  {activeFilters.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAllFilters}
                      className="mt-4 border-brand! text-brand! hover:bg-brand-tint!"
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              )
            )}
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
