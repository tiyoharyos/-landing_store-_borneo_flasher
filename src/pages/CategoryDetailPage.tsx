import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, getProductsByCategory, type CategoryKey } from "@/data/products";

type SortKey = "terlaris" | "termurah" | "termahal" | "terbaru";

export default function CategoryDetailPage() {
  const { category } = useParams<{ category: CategoryKey }>();
  const navigate = useNavigate();
  const cat = CATEGORIES.find((c) => c.key === category);
  const [sort, setSort] = useState<SortKey>("terlaris");

  useEffect(() => {
    if (!cat) navigate("/kategori/alat-tools");
  }, [cat, navigate]);

  if (!cat) return null;

  const items = getProductsByCategory(cat.key).sort((a, b) => {
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
        <div className="category-hero">
          <span className="eyebrow">
            <Icon icon={cat.icon} />
            {cat.label}
          </span>
          <p className="title-search-sm">Semua produk di kategori {cat.label}</p>
        </div>

        <div className="home-layout">
          <CategorySidebar />

          <div className="home-main">
            <div className="home-main-header">
              <p className="section-title">{items.length} produk ditemukan</p>
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

            {items.length ? (
              <div className="product-grid">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="not-found-box">
                <Icon icon="mdi:package-variant-closed" width={64} style={{ color: "var(--line)" }} />
                <p className="title">Belum Ada Produk</p>
                <p className="desc">Produk untuk kategori ini belum tersedia. Pantau terus untuk pembaruan!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
