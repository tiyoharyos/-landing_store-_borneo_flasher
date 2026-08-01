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
    tone: "bg-amber/15",
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
        <section className="py-7 border-b border-line last-of-type:border-b-0">
          <div className="flex flex-wrap items-center justify-between gap-3 my-7 mb-[1.1rem]">
            <p className="font-display font-extrabold text-[1.1rem] text-ink">Kategori Teratas</p>
            <Link to="/kategori" className="text-[13.5px] font-bold text-brand hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to={`/kategori/${c.key}`}
                className="bg-surface border border-line rounded-2xl px-3 py-5 text-center transition-all hover:-translate-y-[3px] hover:shadow-lg"
              >
                <span className="w-12 h-12 mx-auto mb-2.5 rounded-[14px] bg-brand-tint text-brand flex items-center justify-center">
                  <Icon icon={c.icon} width={26} />
                </span>
                <p className="font-display font-bold text-[13.5px] text-ink">{c.label}</p>
                <p className="text-xs text-muted mt-0.5">
                  {getProductsByCategory(c.key).length} produk
                </p>
              </Link>
            ))}
          </div>
        </section>

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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-8">
            {sorted.slice(0, 12).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <Link
              to="/kategori"
              className="inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-8 py-3 rounded-full hover:bg-brand-dark transition-colors"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </section>

        {/* Promo Section */}
        {/* <section className="py-7 border-b border-line last-of-type:border-b-0">
          <p className="font-display font-extrabold text-[1.1rem] text-ink mb-4">Baru untuk Anda</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROMO_CARDS.map((promo) => (
              <div key={promo.title} className={`rounded-[18px] p-6 border border-line ${promo.tone}`}>
                <h3 className="font-display font-extrabold text-[1.05rem] text-ink mb-2">{promo.title}</h3>
                <p className="text-[13px] text-ink-soft mb-[1.1rem] leading-relaxed">{promo.desc}</p>
                <Link
                  to={promo.to}
                  className="inline-block border border-brand text-brand text-[13px] font-semibold rounded-full px-4 py-1.5 whitespace-nowrap hover:bg-white transition-colors"
                >
                  BELI SEKARANG
                </Link>
              </div>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  );
}
