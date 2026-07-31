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
    tone: "brand-tint",
    to: "/kategori/sparepart-iphone",
  },
  {
    title: "TOOLS & ALAT SERVIS",
    desc: "Solder, blower, microscope, sampai fixing tools favorit teknisi.",
    tone: "amber-tint",
    to: "/kategori/alat-tools",
  },
  {
    title: "DISKON SPAREPART ANDROID",
    desc: "Mesin dan plat universal berbagai brand, harga bersahabat.",
    tone: "cream-deep",
    to: "/kategori/sparepart-android",
  },
  {
    title: "MERCHANDISE ALUMNI",
    desc: "Koleksi apparel terbaru khusus komunitas Borneo Flasher.",
    tone: "brand-tint",
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
        <section className="home-section">
          <div className="home-main-header">
            <p className="section-title">Kategori Teratas</p>
            <Link to="/kategori" className="section-link">
              Lihat Semua
            </Link>
          </div>
          <div className="category-grid-home">
            {CATEGORIES.map((c) => (
              <Link key={c.key} to={`/kategori/${c.key}`} className="category-card-home">
                <span className="category-card-home-icon">
                  <Icon icon={c.icon} width={26} />
                </span>
                <p className="category-card-home-name">{c.label}</p>
                <p className="category-card-home-count">
                  {getProductsByCategory(c.key).length} produk
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Produk Pilihan */}
        <section className="home-section">
          <div className="home-main-header">
            <div>
              <p className="section-title mb-2">Produk Pilihan</p>
              <div className="sort-tabs sort-tabs-underline">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    className={`sort-tab-underline ${sort === s.key ? "active" : ""}`}
                    onClick={() => setSort(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/kategori" className="section-link">
              Lihat Semua
            </Link>
          </div>

          <div className="product-grid">
            {sorted.slice(0, 12).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="home-view-all-wrap">
            <Link to="/kategori" className="btn-view-all-products">
              Lihat Semua Produk
            </Link>
          </div>
        </section>

        {/* Promo Section */}
        <section className="home-section">
          <p className="section-title mb-4">Baru untuk Anda</p>
          <div className="promo-grid">
            {PROMO_CARDS.map((promo) => (
              <div key={promo.title} className={`promo-card promo-${promo.tone}`}>
                <h3 className="promo-card-title">{promo.title}</h3>
                <p className="promo-card-desc">{promo.desc}</p>
                <Link to={promo.to} className="btn-outline-sm promo-card-btn">
                  BELI SEKARANG
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Trusted Brands */}
        <section className="home-section">
          <p className="section-title text-center mb-6">
            Sparepart &amp; Tools Kompatibel Dengan Brand Terpercaya
          </p>
          <div className="brand-strip">
            {TRUSTED_BRANDS.map((brand) => (
              <span key={brand} className="brand-strip-item">
                {brand}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container newsletter-inner">
          <h2 className="newsletter-title">Dapatkan Penawaran Eksklusif!</h2>
          <p className="newsletter-subtitle">
            Langganan info promo &amp; produk baru Borneo Flasher Store
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Email Anda" className="newsletter-input" />
            <button className="btn-search">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
