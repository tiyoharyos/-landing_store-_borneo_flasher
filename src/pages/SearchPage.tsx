import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { searchProducts, type Product } from "@/data/products";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [results, setResults] = useState<Product[]>(() => searchProducts(initialQ));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = params.get("q") ?? "";
    setSearchTerm(q);
    setResults(searchProducts(q));
  }, [params]);

  const cari = () => {
    const q = searchTerm.trim();
    setParams(q ? { q } : {});
  };

  return (
    <div>
      <Navbar />

      <section className="header-search">
        <div className="container">
          <span className="eyebrow">
            <Icon icon="mdi:store-search-outline" />
            Borneo Flasher Store
          </span>
          <p className="title-search">Cari alat, sparepart, atau merchandise</p>

          <div className="searchbar">
            <Icon icon="mdi:magnify" width={20} style={{ color: "var(--muted)" }} />
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && cari()}
              placeholder="Ketik nama produk, misal: obeng, flux, kaos"
            />
            <button onClick={cari} className="btn-search">
              Cari
            </button>
          </div>
        </div>
      </section>

      <section className="result-search">
        <div className="container">
          {params.get("q") !== null ? (
            <div>
              <p className="result-heading text-center mb-4">
                Menampilkan hasil untuk : <span className="key">{params.get("q")}</span> —{" "}
                {results.length} produk ditemukan
              </p>

              {results.length ? (
                <div className="product-grid">
                  {results.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="not-found-box">
                  <Icon icon="mdi:file-search-outline" width={64} style={{ color: "var(--line)" }} />
                  <p className="title">Oops.. Tidak Ditemukan</p>
                  <p className="desc">Jangan khawatir, coba masukkan kata kunci pencarian lain.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="img-default-search">
              <Icon icon="mdi:text-box-search-outline" width={72} style={{ color: "var(--brand)" }} />
              <p className="content-text">
                Gunakan pencarian di atas untuk menemukan produk, atau lihat semua{" "}
                <span>Kategori Borneo Flasher Store</span>.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
