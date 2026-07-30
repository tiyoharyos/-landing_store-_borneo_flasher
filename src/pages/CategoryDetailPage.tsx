import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import {
  CATEGORIES,
  PRODUCTS,
  getProductsByCategory,
  type CategoryKey,
  type Condition,
} from "@/data/products";

type SortKey = "terbaru" | "terlaris" | "nama-az" | "nama-za" | "termurah" | "termahal" | "rating";

type Availability = "semua" | "tersedia" | "habis";
type ConditionFilter = "semua" | Condition;
type CategoryFilter = "semua" | CategoryKey;

const PER_PAGE = 12;

const isCategoryKey = (value: string | undefined): value is CategoryKey =>
  CATEGORIES.some((c) => c.key === value);

const filterOptionClass = "flex cursor-pointer items-center gap-2 py-1.5 text-[13.5px] text-ink-soft";
const filterGroupClass = "border-b border-line pb-5 last:border-b-0 last:pb-0";
const filterGroupTitleClass = "mb-2.5 font-display text-[13px] font-bold text-ink";

export default function CategoryDetailPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // "semua" atau slug kategori yang tidak dikenal -> tampilkan semua produk
  const urlCategory: CategoryFilter = isCategoryKey(category) ? category : "semua";

  // Kata kunci pencarian sepenuhnya dikendalikan dari kotak cari di Navbar (?cari=...)
  const query = searchParams.get("cari") ?? "";

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(urlCategory);
  const [sort, setSort] = useState<SortKey>("terbaru");
  const [availability, setAvailability] = useState<Availability>("semua");
  const [condition, setCondition] = useState<ConditionFilter>("semua");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Sinkronkan filter kategori setiap kali URL berubah (klik dari navbar/link lain)
  useEffect(() => {
    setCategoryFilter(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, query, sort, availability, condition, priceMin, priceMax, discountOnly]);

  const categoryCounts = useMemo(() => {
    const map = new Map<CategoryKey, number>();
    CATEGORIES.forEach((c) => map.set(c.key, getProductsByCategory(c.key).length));
    return map;
  }, []);

  const filtered = useMemo(() => {
    let items = categoryFilter === "semua" ? PRODUCTS : getProductsByCategory(categoryFilter);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (availability === "tersedia") items = items.filter((p) => p.stock > 0);
    if (availability === "habis") items = items.filter((p) => p.stock === 0);
    if (condition !== "semua") items = items.filter((p) => p.condition === condition);
    if (discountOnly) items = items.filter((p) => p.priceOriginal && p.priceOriginal > p.price);

    const min = priceMin ? Number(priceMin) : null;
    const max = priceMax ? Number(priceMax) : null;
    if (min !== null) items = items.filter((p) => p.price >= min);
    if (max !== null) items = items.filter((p) => p.price <= max);

    items = [...items].sort((a, b) => {
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
  }, [categoryFilter, query, availability, condition, priceMin, priceMax, discountOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const activeCategoryLabel =
    categoryFilter === "semua" ? "Semua Produk" : CATEGORIES.find((c) => c.key === categoryFilter)?.label ?? "Semua Produk";

  const activeFilters: { label: string; onClear: () => void }[] = [];
  if (categoryFilter !== "semua")
    activeFilters.push({ label: activeCategoryLabel, onClear: () => goToCategory("semua") });
  if (query.trim()) activeFilters.push({ label: `Cari: "${query.trim()}"`, onClear: clearSearch });
  if (availability !== "semua")
    activeFilters.push({
      label: availability === "tersedia" ? "Tersedia" : "Stok Habis",
      onClear: () => setAvailability("semua"),
    });
  if (condition !== "semua") activeFilters.push({ label: condition, onClear: () => setCondition("semua") });
  if (priceMin) activeFilters.push({ label: `Min Rp ${priceMin}`, onClear: () => setPriceMin("") });
  if (priceMax) activeFilters.push({ label: `Max Rp ${priceMax}`, onClear: () => setPriceMax("") });
  if (discountOnly) activeFilters.push({ label: "Produk Diskon", onClear: () => setDiscountOnly(false) });

  function goToCategory(key: CategoryFilter) {
    setCategoryFilter(key);
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
    setCondition("semua");
    setPriceMin("");
    setPriceMax("");
    setDiscountOnly(false);
    setSort("terbaru");
    setCategoryFilter("semua");
    navigate("/kategori");
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="my-6 mb-2 flex flex-wrap justify-end gap-2.5">
          <button
            type="button"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-brand px-4 py-1.5 text-[13px] font-semibold text-brand min-[900px]:hidden"
            onClick={() => setMobileFilterOpen((v) => !v)}
          >
            <Icon icon="mdi:filter-variant" width={17} /> Filter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 pb-16 min-[900px]:grid-cols-[240px_1fr]">
          {/* Filter sidebar */}
          <aside
            className={`${mobileFilterOpen ? "flex" : "hidden"} flex-col gap-6 self-start rounded-2xl border border-line bg-white p-5 min-[900px]:sticky min-[900px]:top-[90px] min-[900px]:flex`}
          >
            <div className={filterGroupClass}>
              <p className={filterGroupTitleClass}>Kategori</p>
              <ul className="m-0 flex max-h-[260px] list-none flex-col gap-0.5 overflow-y-auto p-0">
                <li>
                  <button
                    type="button"
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] font-semibold text-ink-soft hover:bg-cream-deep ${
                      categoryFilter === "semua" ? "bg-brand-tint text-brand" : ""
                    }`}
                    onClick={() => goToCategory("semua")}
                  >
                    <Icon icon="mdi:view-grid-outline" width={16} />
                    <span>Semua Produk</span>
                    <span className={`ml-auto text-xs font-medium ${categoryFilter === "semua" ? "text-brand" : "text-muted"}`}>
                      ({PRODUCTS.length})
                    </span>
                  </button>
                </li>
                {CATEGORIES.map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] font-semibold text-ink-soft hover:bg-cream-deep ${
                        categoryFilter === c.key ? "bg-brand-tint text-brand" : ""
                      }`}
                      onClick={() => goToCategory(c.key)}
                    >
                      <Icon icon={c.icon} width={16} />
                      <span>{c.label}</span>
                      <span className={`ml-auto text-xs font-medium ${categoryFilter === c.key ? "text-brand" : "text-muted"}`}>
                        ({categoryCounts.get(c.key) ?? 0})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={filterGroupClass}>
              <p className={filterGroupTitleClass}>Ketersediaan</p>
              {(
                [
                  { key: "semua", label: "Semua Produk" },
                  { key: "tersedia", label: "Tersedia" },
                  { key: "habis", label: "Stok Habis" },
                ] as { key: Availability; label: string }[]
              ).map((opt) => (
                <label key={opt.key} className={filterOptionClass}>
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

            <div className={filterGroupClass}>
              <p className={filterGroupTitleClass}>Kondisi</p>
              {(
                [
                  { key: "semua", label: "Semua Kondisi" },
                  { key: "Baru", label: "Baru" },
                  { key: "Bekas Layak Pakai", label: "Bekas Layak Pakai" },
                ] as { key: ConditionFilter; label: string }[]
              ).map((opt) => (
                <label key={opt.key} className={filterOptionClass}>
                  <input
                    type="radio"
                    name="condition"
                    className="accent-brand"
                    checked={condition === opt.key}
                    onChange={() => setCondition(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <div className={filterGroupClass}>
              <p className={filterGroupTitleClass}>Range Harga</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-0 flex-1 rounded-lg border border-line px-2.5 py-2 text-[13px] outline-none"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <span className="text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-0 flex-1 rounded-lg border border-line px-2.5 py-2 text-[13px] outline-none"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            <div className={filterGroupClass}>
              <label className={filterOptionClass}>
                <input
                  type="checkbox"
                  className="accent-brand"
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                />
                Produk Diskon
              </label>
            </div>

            <button
              type="button"
              className="mt-0 w-full rounded-full border border-brand bg-white px-6 py-2 text-center text-[13px] font-semibold text-brand transition-colors hover:bg-brand-tint"
              onClick={resetAllFilters}
            >
              Reset Filter
            </button>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            <div className="my-5 mb-4 flex flex-wrap items-center justify-between gap-2.5">
              <p className="font-display text-[1.1rem] font-extrabold text-ink">
                Menampilkan <span className="text-brand">{filtered.length}</span> produk
              </p>
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {activeFilters.map((f) => (
                    <button
                      key={f.label}
                      className="inline-flex items-center gap-[5px] rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-brand"
                      onClick={f.onClear}
                    >
                      {f.label}
                      <Icon icon="mdi:close" width={13} />
                    </button>
                  ))}
                  <button className="text-[12.5px] font-bold text-warn hover:underline" onClick={resetAllFilters}>
                    Hapus Semua
                  </button>
                </div>
              )}
            </div>

            {paged.length ? (
              <>
                <div className="grid grid-cols-2 gap-3.5 pb-8 sm:grid-cols-3 lg:grid-cols-4">
                  {paged.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="my-9 mb-12 flex flex-wrap justify-center gap-1.5">
                    <button
                      className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-white px-1.5 text-[13px] font-semibold text-ink-soft enabled:hover:border-brand enabled:hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-label="Sebelumnya"
                    >
                      <Icon icon="mdi:chevron-left" width={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-1.5 text-[13px] font-semibold ${
                          page === n
                            ? "border-brand bg-brand text-white"
                            : "border-line bg-white text-ink-soft hover:border-brand hover:text-brand"
                        }`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-white px-1.5 text-[13px] font-semibold text-ink-soft enabled:hover:border-brand enabled:hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
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
              <div className="px-6 py-12 text-center">
                <Icon icon="mdi:package-variant-closed" width={64} className="mx-auto text-line" />
                <p className="mt-4 font-display text-[1.1rem] font-bold text-ink">Produk Tidak Ditemukan</p>
                <p className="mt-1 text-sm text-muted">Coba ubah kata kunci atau filter pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
