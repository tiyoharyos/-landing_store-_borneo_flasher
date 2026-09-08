import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
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

  // Fetch ulang produk dari backend tiap kali kategori atau kata kunci pencarian berubah.
  // Filter lain (ketersediaan, range harga, sort) dilakukan di client karena backend
  // belum menyediakan parameter untuk itu.
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
    navigate("/kategori");
  };

  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="flex flex-wrap justify-end gap-2.5 my-6 mt-0">
          <button
            type="button"
            className="border border-brand text-brand text-[13px] font-semibold rounded-full px-4 py-1.5 whitespace-nowrap flex lg:hidden items-center gap-1.5 hover:bg-brand-tint transition-colors"
            onClick={() => setMobileFilterOpen((v) => !v)}
          >
            <Icon icon="mdi:filter-variant" width={17} /> Filter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 pb-16">
          {/* Filter sidebar */}
          <aside
            className={`${
              mobileFilterOpen ? "flex" : "hidden"
            } lg:flex flex-col gap-6 bg-surface border border-line rounded-2xl p-5 self-start lg:sticky lg:top-[90px]`}
          >
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
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="flex-1 w-0 border border-line rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-brand"
                />
                <span className="text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="flex-1 w-0 border border-line rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-brand"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-0 bg-surface border border-brand text-brand text-[13px] font-semibold rounded-full px-[1.6rem] py-2 cursor-pointer transition-colors hover:bg-brand-tint"
              onClick={resetAllFilters}
            >
              Reset Filter
            </button>
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            {(query.trim() || activeFilters.length > 0) && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 my-5 mb-4">
                {query.trim() && (
                  <p className="font-display font-extrabold text-[1.1rem] text-ink">
                    Menampilkan <span className="text-brand">{filtered.length}</span> produk
                  </p>
                )}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
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
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-[14px] bg-cream-deep animate-pulse" />
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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
                      ))}
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
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
