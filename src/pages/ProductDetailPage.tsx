import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { toastSuccess } from "@/components/ui/alert";
import {
  getProductBySlug,
  relatedProducts,
  formatRupiah,
  discountPercent,
  getCategory,
} from "@/data/products";

const BADGE_BASE = "inline-flex items-center gap-[5px] rounded-full px-[0.85em] py-[0.35em] text-[0.72rem] font-bold whitespace-nowrap";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);

  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container px-6 py-12 text-center">
          <Icon icon="mdi:package-variant-closed" width={64} className="mx-auto text-line" />
          <p className="mt-4 font-display text-[1.1rem] font-bold text-ink">Produk Tidak Ditemukan</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full border border-brand bg-white px-6 py-2 text-[13px] font-semibold text-brand transition-colors hover:bg-brand-tint"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const pct = discountPercent(product);
  const category = getCategory(product.category);
  const related = relatedProducts(product);

  const clampQty = (n: number) => Math.max(1, Math.min(product.stock, n));

  const handleAddToCart = () => {
    addItem(product.id, qty);
    if (user) toastSuccess("Ditambahkan ke keranjang");
  };

  const handleBuyNow = () => {
    addItem(product.id, qty);
    if (user) navigate("/keranjang");
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="my-5 flex flex-wrap items-center gap-[5px] text-[12.5px] text-muted">
          <Link to="/" className="hover:text-brand">Beranda</Link>
          <Icon icon="mdi:chevron-right" width={14} />
          {category && (
            <Link to={`/kategori/${category.key}`} className="hover:text-brand">
              {category.label}
            </Link>
          )}
          <Icon icon="mdi:chevron-right" width={14} />
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-7 pb-4 md:grid-cols-[420px_1fr]">
          <div className="relative aspect-square self-start overflow-hidden rounded-[18px] bg-cream-deep">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            {pct > 0 && (
              <span className="absolute top-3 left-3 rounded-md bg-brand px-2.5 py-1 text-[13px] font-extrabold text-white">
                -{pct}%
              </span>
            )}
          </div>

          <div>
            <p className="font-display text-[1.4rem] font-extrabold text-ink">{product.name}</p>
            <div className="mt-2 flex items-center gap-2 text-[13px] text-muted">
              <span className="flex items-center gap-[3px] font-bold text-amber-dark">
                <Icon icon="mdi:star" width={15} />
                {product.rating.toFixed(1)}
              </span>
              <span className="text-line">•</span>
              <span>Terjual {product.sold}</span>
              <span className="text-line">•</span>
              <span className={`${BADGE_BASE} ${product.condition === "Baru" ? "bg-ok/12 text-ok" : "bg-amber/15 text-amber-dark"}`}>
                {product.condition}
              </span>
            </div>

            <div className="mt-3.5 flex items-baseline gap-2.5">
              <span className="font-mono text-2xl font-extrabold text-brand-dark">{formatRupiah(product.price)}</span>
              {product.priceOriginal && (
                <span className="text-xs text-muted line-through">{formatRupiah(product.priceOriginal)}</span>
              )}
            </div>

            <p className="mt-3.5 text-sm leading-relaxed text-ink-soft">{product.description}</p>

            <div className="mt-2 flex gap-2.5 text-[13.5px] text-ink-soft">
              <span className="w-[70px] flex-shrink-0 text-muted">Stok</span>
              <span>{product.stock} unit tersedia</span>
            </div>
            <div className="mt-2 flex gap-2.5 text-[13.5px] text-ink-soft">
              <span className="w-[70px] flex-shrink-0 text-muted">Berat</span>
              <span>{product.weightGram} gram</span>
            </div>

            <div className="mt-[18px] flex items-center gap-3.5">
              <span className="w-[70px] text-[13.5px] text-muted">Jumlah</span>
              <div className="flex items-center overflow-hidden rounded-[10px] border border-line">
                <button
                  className="flex h-[34px] w-[34px] items-center justify-center bg-cream-deep"
                  onClick={() => setQty((q) => clampQty(q - 1))}
                >
                  <Icon icon="mdi:minus" width={16} />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(clampQty(Number(e.target.value) || 1))}
                  className="w-[46px] border-none text-center text-[13.5px] font-bold outline-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  className="flex h-[34px] w-[34px] items-center justify-center bg-cream-deep"
                  onClick={() => setQty((q) => clampQty(q + 1))}
                >
                  <Icon icon="mdi:plus" width={16} />
                </button>
              </div>
            </div>

            <div className="mt-[22px] flex flex-wrap gap-3">
              <Button variant="outline" size="lg" icon="mdi:cart-plus" onClick={handleAddToCart}>
                Tambah ke Keranjang
              </Button>
              <Button variant="primary" size="lg" onClick={handleBuyNow}>
                Beli Langsung
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10 pb-16">
            <p className="mb-4 font-display text-[1.1rem] font-extrabold text-ink">Produk Terkait</p>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
