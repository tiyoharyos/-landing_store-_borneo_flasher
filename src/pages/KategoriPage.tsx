import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import ProductCard from "@/components/ProductCard";
import { type Product } from "@/data/products";
import { getProducts } from "@/services/productsService";
import { getCategories } from "@/services/categoriesService";
import { mapApiProductsToProducts, mapCategoryOptions, type CategoryOption } from "@/lib/mapProduct";
import { getApiErrorMessage } from "@/lib/axios";

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
  const delta = 1; // jumlah halaman di kiri/kanan current yang ditampilkan
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

  // Kata kunci pencarian sepenuhnya dikendalikan dari kotak cari di Navbar (?cari=...)
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

  // Sinkronkan filter kategori setiap kali URL berubah (klik dari navbar/link lain)
  useEffect(() => {
    setCategoryFilter(urlCategory);
  }, [urlCategory]);

  // Ambil daftar kategori sekali di awal (buat sidebar filter).
  useEffect(() => {
    let active = true;
    getCategories()
      .then((res) => {
        if (!active) return;
        setCategories(mapCategoryOptions(res.data ?? []));
      })
      .catch(() => {
        // Sidebar kategori gagal dimuat tetap bisa lanjut lihat produk tanpa filter kategori.
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

  // Kunci scroll body selagi drawer filter mobile terbuka.
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

  // Konten filter dipakai bareng di sidebar desktop & drawer mobile supaya
  // tidak dobel logic — cukup beda pembungkus tampilannya saja.
  const filterContent = (
    <>
      <div className="pb-5 border-b border-line last-of-type:border-b-0 last-of-type:pb-0">
        <p className="font-display font-bold text-[13px] text-ink mb-2.5">Kategori</p>
        <ul className="list-none m-0 p-0 flex flex-col gap-0.5 max-h-[260px] overflow-y-auto">
          <li>
            <button
              type="button"
              className={`flex items-center gap-2 w-full bg-transparent border-none text-left px-2 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer ${
                categoryFilter === SEMUA_KATEGORI ? "bg-brand-tint text-brand" : "text-ink-soft hover:bg-cream-deep"
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
                className={`flex items-center gap-2 w-full bg-transparent border-none text-left px-2 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer ${
                  categoryFilter === c.key ? "bg-brand-tint text-brand" : "text-ink-soft hover:bg-cream-deep"
                }`}
                onClick={() => goToCategory(c.key)}
              >
                {c.image ? (
                  <img src={c.image} alt="" className="w-4 h-4 rounded object-cover shrink-0" />
                ) : (
                  <Icon icon="mdi:tag-outline" width={16} />
                )}
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="pb-5 border-b border-line last-of-type:border-b-0 last-of-type:pb-0">
        <p className="font-display font-bold text-[13px] text-ink mb-2.5">Ketersediaan</p>
        {(
          [
            { key: "semua", label: "Semua Produk" },
            { key: "tersedia", label: "Tersedia" },
            { key: "habis", label: "Stok Habis" },
          ] as { key: Availability; label: string }[]
        ).map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 text-[13.5px] text-ink-soft py-1.5 cursor-pointer">
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

      <div className="pb-5 border-b border-line last-of-type:border-b-0 last-of-type:pb-0">
        <p className="font-display font-bold text-[13px] text-ink mb-2.5">Range Harga</p>
        <div className="flex items-center gap-2">
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
              className="w-full border border-line rounded-lg pl-7 pr-2 py-2 text-[13px] outline-none focus:border-brand"
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
              className="w-full border border-line rounded-lg pl-7 pr-2 py-2 text-[13px] outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="w-full mt-0 bg-surface border border-brand text-brand text-[13px] font-semibold rounded-lg px-[1.6rem] py-2 cursor-pointer transition-colors hover:bg-brand-tint"
        onClick={resetAllFilters}
      >
        Reset Filter
      </button>
    </>
  );

  return (
    <div>
      <div className="container pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 pb-16">
          {/* Filter sidebar — hanya tampil di desktop, menetap saat scroll */}
          <aside className="hidden lg:flex flex-col gap-6 bg-surface border border-line rounded-2xl p-5 self-start lg:sticky lg:top-[90px]">
            {filterContent}
          </aside>

          {/* Drawer filter mobile — overlay dari kiri, tidak mendorong konten */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-[95]">
              <div
                className="absolute inset-0 bg-overlay animate-[modalIn_0.2s_ease-out]"
                onClick={() => setMobileFilterOpen(false)}
              />
              <aside className="absolute inset-y-0 left-0 w-[85vw] max-w-[320px] bg-surface flex flex-col shadow-[var(--shadow-lg)]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
                  <p className="font-display font-bold text-[14.5px] text-ink">Filter Produk</p>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full flex items-center justify-center border-none bg-transparent text-muted cursor-pointer hover:bg-cream-deep hover:text-ink transition-colors"
                    onClick={() => setMobileFilterOpen(false)}
                    aria-label="Tutup filter"
                  >
                    <Icon icon="mdi:close" width={20} />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-5 overflow-y-auto">{filterContent}</div>
                <div className="p-4 border-t border-line shrink-0">
                  <button
                    type="button"
                    className="w-full h-11 rounded-lg bg-brand text-white text-[13.5px] font-bold cursor-pointer hover:bg-brand-dark transition-colors"
                    onClick={() => setMobileFilterOpen(false)}
                  >
                    Tampilkan {filtered.length} Produk
                  </button>
                </div>
              </aside>
            </div>
          )}

          {/* Main content */}
          <div className="min-w-0">
            {/* Toolbar: jumlah produk + urutkan + tombol filter mobile */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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
                    className="h-9 border border-line rounded-lg bg-surface pl-3 pr-8 text-[12.75px] font-semibold text-ink outline-none appearance-none cursor-pointer transition-all focus:border-brand"
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

                <button
                  type="button"
                  className="relative border border-brand text-brand text-[13px] font-semibold rounded-lg px-4 h-9 whitespace-nowrap flex lg:hidden items-center gap-1.5 hover:bg-brand-tint transition-colors"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <Icon icon="mdi:filter-variant" width={17} /> Filter
                  {activeFilters.length > 0 && (
                    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-brand text-white text-[10px] font-bold">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {activeFilters.map((f) => (
                  <button
                    key={f.label}
                    className="inline-flex items-center gap-1.5 bg-brand-tint text-brand border-none rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer"
                    onClick={f.onClear}
                  >
                    {f.label}
                    <Icon icon="mdi:close" width={13} />
                  </button>
                ))}
                <button
                  className="bg-transparent border-none text-warn text-[12.5px] font-bold cursor-pointer hover:underline"
                  onClick={resetAllFilters}
                >
                  Hapus Semua
                </button>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-cream-deep animate-pulse" />
                ))}
              </div>
            )}

            {!loading && error && (
              <p className="text-center text-warn text-sm py-12">{error}</p>
            )}

            {!loading && !error && (
              paged.length ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-8">
                    {paged.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center gap-1.5 my-9 mb-12">
                      <button
                        className="min-w-9 h-9 px-1.5 rounded-lg border border-line bg-surface text-[13px] font-semibold text-ink-soft flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-brand hover:enabled:text-brand"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="Sebelumnya"
                      >
                        <Icon icon="mdi:chevron-left" width={18} />
                      </button>
                      {getPageNumbers(page, totalPages).map((n, idx) =>
                        n === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="min-w-9 h-9 px-1.5 flex items-center justify-center text-[13px] font-semibold text-muted select-none"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={n}
                            className={`min-w-9 h-9 px-1.5 rounded-lg border text-[13px] font-semibold flex items-center justify-center cursor-pointer ${
                              page === n
                                ? "bg-brand border-brand text-white"
                                : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand"
                            }`}
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        )
                      )}
                      <button
                        className="min-w-9 h-9 px-1.5 rounded-lg border border-line bg-surface text-[13px] font-semibold text-ink-soft flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-brand hover:enabled:text-brand"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        aria-label="Berikutnya"
                      >
                        <Icon icon="mdi:chevron-right" width={18} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 px-6">
                  <Icon icon="mdi:package-variant-closed" width={64} className="text-line inline-block" />
                  <p className="font-display font-bold text-[1.1rem] mt-4">Produk Tidak Ditemukan</p>
                  <p className="text-muted text-sm mt-1">Coba ubah kata kunci atau filter pencarian Anda.</p>
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      className="mt-4 border border-brand text-brand text-[13px] font-semibold rounded-lg px-6 py-2 hover:bg-brand-tint transition-colors"
                      onClick={resetAllFilters}
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
