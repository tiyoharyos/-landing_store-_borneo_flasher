import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, QUICK_ICONS } from "@/data/products";

type SortKey = "terlaris" | "termurah" | "termahal" | "terbaru";

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
        <div className="mt-4">
          <BannerCarousel />
        </div>

        <div className="quick-icons">
          {QUICK_ICONS.map((q) => (
            <Link key={q.category} to={`/kategori/${q.category}`} className="quick-icon">
              <span className="quick-icon-circle">
                <Icon icon={q.icon} width={24} />
              </span>
              <span>{q.label}</span>
            </Link>
          ))}
        </div>

        <div className="home-layout">
          <CategorySidebar />

          <div className="home-main">
            <div className="home-main-header">
              <p className="section-title">Produk Pilihan</p>
              <div className="sort-tabs">
                {(
                  [
                    { key: "terlaris", label: "Terlaris" },
                    { key: "termurah", label: "Termurah" },
                    { key: "termahal", label: "Termahal" },
                    { key: "terbaru", label: "Terbaru" },
                  ] as { key: SortKey; label: string }[]
                ).map((s) => (
                  <button
                    key={s.key}
                    className={`sort-tab ${sort === s.key ? "active" : ""}`}
                    onClick={() => setSort(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {sorted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
