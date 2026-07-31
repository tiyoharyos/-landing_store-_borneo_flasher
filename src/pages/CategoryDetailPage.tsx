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

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "terbaru", label: "Terbaru" },
  { key: "terlaris", label: "Terlaris" },
  { key: "nama-az", label: "Nama A-Z" },
  { key: "nama-za", label: "Nama Z-A" },
  { key: "termurah", label: "Harga Terendah" },
  { key: "termahal", label: "Harga Tertinggi" },
  { key: "rating", label: "Rating Tertinggi" },
];

type Availability = "semua" | "tersedia" | "habis";
type ConditionFilter = "semua" | Condition;
type CategoryFilter = "semua" | CategoryKey;

const PER_PAGE = 12;

const isCategoryKey = (value: string | undefined): value is CategoryKey =>
  CATEGORIES.some((c) => c.key === value);

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
        <div className="catalog-toolbar">
          <button
            type="button"
            className="btn-outline-sm catalog-filter-toggle"
            onClick={() => setMobileFilterOpen((v) => !v)}
          >
            <Icon icon="mdi:filter-variant" width={17} /> Filter
          </button>

        </div>

        <div className="home-layout">
          {/* Filter sidebar */}
          <aside className={`filter-panel ${mobileFilterOpen ? "filter-panel-open" : ""}`}>
            <div className="filter-group">
              <p className="filter-group-title">Kategori</p>
              <ul className="filter-category-list">
                <li>
                  <button
                    type="button"
                    className={`filter-category-link ${categoryFilter === "semua" ? "active" : ""}`}
                    onClick={() => goToCategory("semua")}
                  >
                    <Icon icon="mdi:view-grid-outline" width={16} />
                    <span>Semua Produk</span>
                    <span className="filter-category-count">({PRODUCTS.length})</span>
                  </button>
                </li>
                {CATEGORIES.map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      className={`filter-category-link ${categoryFilter === c.key ? "active" : ""}`}
                      onClick={() => goToCategory(c.key)}
                    >
                      <Icon icon={c.icon} width={16} />
                      <span>{c.label}</span>
                      <span className="filter-category-count">({categoryCounts.get(c.key) ?? 0})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <p className="filter-group-title">Ketersediaan</p>
              {(
                [
                  { key: "semua", label: "Semua Produk" },
                  { key: "tersedia", label: "Tersedia" },
                  { key: "habis", label: "Stok Habis" },
                ] as { key: Availability; label: string }[]
              ).map((opt) => (
                <label key={opt.key} className="filter-option">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === opt.key}
                    onChange={() => setAvailability(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <p className="filter-group-title">Kondisi</p>
              {(
                [
                  { key: "semua", label: "Semua Kondisi" },
                  { key: "Baru", label: "Baru" },
                  { key: "Bekas Layak Pakai", label: "Bekas Layak Pakai" },
                ] as { key: ConditionFilter; label: string }[]
              ).map((opt) => (
                <label key={opt.key} className="filter-option">
                  <input
                    type="radio"
                    name="condition"
                    checked={condition === opt.key}
                    onChange={() => setCondition(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <p className="filter-group-title">Range Harga</p>
              <div className="filter-price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                />
                Produk Diskon
              </label>
            </div>

            <button type="button" className="btn-clear filter-reset-btn" onClick={resetAllFilters}>
              Reset Filter
            </button>
          </aside>

          {/* Main content */}
          <div className="home-main">
            <div className="catalog-count-row">
              <p className="section-title">
                Menampilkan <span className="text-brand">{filtered.length}</span> produk
              </p>
              {activeFilters.length > 0 && (
                <div className="catalog-active-filters">
                  {activeFilters.map((f) => (
                    <button key={f.label} className="filter-chip" onClick={f.onClear}>
                      {f.label}
                      <Icon icon="mdi:close" width={13} />
                    </button>
                  ))}
                  <button className="catalog-clear-all" onClick={resetAllFilters}>
                    Hapus Semua
                  </button>
                </div>
              )}
            </div>

            {paged.length ? (
              <>
                <div className="product-grid">
                  {paged.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-label="Sebelumnya"
                    >
                      <Icon icon="mdi:chevron-left" width={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        className={`page-btn ${page === n ? "active" : ""}`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      className="page-btn"
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
              <div className="not-found-box">
                <Icon icon="mdi:package-variant-closed" width={64} style={{ color: "var(--line)" }} />
                <p className="title">Produk Tidak Ditemukan</p>
                <p className="desc">Coba ubah kata kunci atau filter pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
