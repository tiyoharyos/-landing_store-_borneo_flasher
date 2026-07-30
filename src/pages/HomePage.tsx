import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES, getProductsByCategory } from "@/data/products";

type SortKey = "terlaris" | "termurah" | "termahal" | "terbaru";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "terlaris", label: "Paling Laris" },
  { key: "terbaru", label: "Terbaru" },
  { key: "termurah", label: "Termurah" },
  { key: "termahal", label: "Termahal" },
];

const PROMO_CARDS = [
  {
    title: "SPAREPART IPHONE",
    desc: "Mesin, plat BGA, sampai Face ID set — lengkap untuk servis harian.",
    tone: "bg-brand-tint",
    to: "/kategori/sparepart-iphone",
  },
  {
    title: "TOOLS & ALAT SERVIS",
    desc: "Solder, blower, microscope, sampai fixing tools favorit teknisi.",
    tone: "bg-amber/[0.14]",
    to: "/kategori/alat-tools",
  },
  {
    title: "DISKON SPAREPART ANDROID",
    desc: "Mesin dan plat universal berbagai brand, harga bersahabat.",
    tone: "bg-cream-deep",
    to: "/kategori/sparepart-android",
  },
  {
    title: "MERCHANDISE ALUMNI",
    desc: "Koleksi apparel terbaru khusus komunitas Borneo Flasher.",
    tone: "bg-brand-tint",
    to: "/kategori/merchandise",
  },
];

const TRUSTED_BRANDS = [
  "JCID",
  "Mechanic",
  "Sunshine",
  "Qianli",
  "Relife",
  "Mijing",
  "Youkiloon",
  "AMOI",
];

const SECTION = "border-b border-line py-7 last-of-type:border-b-0";
const SECTION_HEADER = "my-7 mb-[1.1rem] flex flex-wrap items-center justify-between gap-3";
const SECTION_TITLE = "font-display text-[1.1rem] font-extrabold text-ink";
const SECTION_LINK = "text-[13.5px] font-bold text-brand hover:underline";

export default function HomePage() {
  const [sort, setSort] = useState<SortKey>("terlaris");

  const sorted = [...PRODUCTS].sort((a, b) => {
    switch (sort) {
      case "termurah":
        return a.price - b.price;
      case "termahal":
        return b.price - a.price;
      case "terbaru":
        return a.id.localeCompare(b.id);
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

        {/* Kategori Teratas */}
        <section className={SECTION}>
          <div className={SECTION_HEADER}>
            <p className={SECTION_TITLE}>Kategori Teratas</p>
            <Link to="/kategori" className={SECTION_LINK}>
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to={`/kategori/${c.key}`}
                className="rounded-2xl border border-line bg-white px-3 py-5 text-center transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_28px_-14px_rgba(28,22,19,0.22)]"
              >
                <span className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand-tint text-brand">
                  <Icon icon={c.icon} width={26} />
                </span>
                <p className="font-display text-[13.5px] font-bold text-ink">{c.label}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {getProductsByCategory(c.key).length} produk
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Produk Pilihan */}
        <section className={SECTION}>
          <div className={SECTION_HEADER}>
            <div>
              <p className={`${SECTION_TITLE} mb-2`}>Produk Pilihan</p>
              <div className="flex flex-wrap gap-[18px]">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    className={`border-b-2 pb-2 text-[13.5px] font-semibold ${
                      sort === s.key ? "border-brand text-brand" : "border-transparent text-muted hover:text-brand"
                    }`}
                    onClick={() => setSort(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/kategori" className={SECTION_LINK}>
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3.5 pb-8 sm:grid-cols-3 lg:grid-cols-4">
            {sorted.slice(0, 12).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-2 flex justify-center">
            <Link
              to="/kategori"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </section>

        {/* Promo Section */}
        <section className={SECTION}>
          <p className={`${SECTION_TITLE} mb-4`}>Baru untuk Anda</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROMO_CARDS.map((promo) => (
              <div key={promo.title} className={`rounded-[18px] border border-line p-6 ${promo.tone}`}>
                <h3 className="mb-2 font-display text-[1.05rem] font-extrabold text-ink">{promo.title}</h3>
                <p className="mb-[1.1rem] text-[13px] leading-relaxed text-ink-soft">{promo.desc}</p>
                <Link
                  to={promo.to}
                  className="inline-block rounded-full border border-brand px-4 py-1.5 text-[13px] font-semibold text-brand"
                >
                  BELI SEKARANG
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Trusted Brands */}
        <section className={SECTION}>
          <p className={`${SECTION_TITLE} mb-6 text-center`}>
            Sparepart &amp; Tools Kompatibel Dengan Brand Terpercaya
          </p>
          <div className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 sm:grid-cols-4">
            {TRUSTED_BRANDS.map((brand) => (
              <span key={brand} className="font-display text-[1.15rem] font-extrabold tracking-[0.02em] text-muted">
                {brand}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Newsletter */}
      <section className="mt-4 bg-gradient-to-br from-brand to-brand-dark py-14 text-white">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-extrabold">Dapatkan Penawaran Eksklusif!</h2>
          <p className="mt-2 text-[14.5px] opacity-90">
            Langganan info promo &amp; produk baru Borneo Flasher Store
          </p>
          <div className="mx-auto mt-6 flex max-w-[440px] gap-2">
            <input
              type="email"
              placeholder="Email Anda"
              className="h-[46px] flex-1 rounded-full border-none px-[18px] text-sm text-ink outline-none"
            />
            <button className="flex-shrink-0 rounded-full bg-white px-7 py-[0.7rem] text-sm font-bold whitespace-nowrap text-brand-dark transition-colors hover:bg-cream">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
