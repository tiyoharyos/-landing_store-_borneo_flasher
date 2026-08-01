import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import Button from "@/components/ui/Button";
import { toastSuccess } from "@/components/ui/alert";
import {
  getProductBySlug,
  relatedProducts,
  formatRupiah,
  discountPercent,
  getCategory,
} from "@/data/products";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggle } = useWishlist();
  const [qty, setQty] = useState(1);

  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container text-center py-12 px-6">
          <Icon icon="mdi:package-variant-closed" width={64} className="text-line inline-block" />
          <p className="font-display font-bold text-[1.1rem] mt-4">Produk Tidak Ditemukan</p>
          <Link
            to="/"
            className="mt-4 inline-block border border-brand text-brand text-[13px] font-semibold rounded-full px-6 py-2 hover:bg-brand-tint transition-colors"
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
  const wished = isWishlisted(product.id);

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
        <div className="flex items-center gap-1.5 text-[12.5px] text-muted my-5 flex-wrap">
          <Link to="/" className="hover:text-brand">Beranda</Link>
          <Icon icon="mdi:chevron-right" width={14} />
          {category && <Link to={`/kategori/${category.key}`} className="hover:text-brand">{category.label}</Link>}
          <Icon icon="mdi:chevron-right" width={14} />
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-7 pb-4">
          <div className="relative rounded-[18px] overflow-hidden bg-cream-deep aspect-square self-start transition-colors duration-200">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {pct > 0 && (
              <span className="absolute top-3 left-3 bg-brand text-white text-[13px] font-extrabold px-2.5 py-1 rounded-md transition-colors duration-200">
                -{pct}%
              </span>
            )}
            <button
              type="button"
              className={`absolute top-3 right-3 w-10 h-10 rounded-full border-none bg-white/92 flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-110 ${
                wished ? "text-brand" : "text-ink-soft"
              }`}
              aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
              onClick={() => toggle(product.id)}
            >
              <Icon icon={wished ? "mdi:heart" : "mdi:heart-outline"} width={22} />
            </button>
          </div>

          <div>
            <p className="font-display font-extrabold text-[1.4rem] text-ink">{product.name}</p>
            <div className="flex items-center gap-2 text-[13px] text-muted mt-2">
              <span className="flex items-center gap-1 text-amber-dark font-bold">
                <Icon icon="mdi:star" width={15} />
                {product.rating.toFixed(1)}
              </span>
              <span className="text-line">•</span>
              <span>Terjual {product.sold}</span>
              <span className="text-line">•</span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold whitespace-nowrap ${
                  product.condition === "Baru" ? "bg-ok/10 text-ok" : "bg-amber/15 text-amber-dark"
                } transition-colors duration-200`}
              >
                {product.condition}
              </span>
            </div>

            <div className="mt-3.5 flex items-baseline gap-2.5">
              <span className="font-mono font-extrabold text-2xl text-brand-dark">{formatRupiah(product.price)}</span>
              {product.priceOriginal && (
                <span className="line-through text-muted text-xs">{formatRupiah(product.priceOriginal)}</span>
              )}
            </div>

            <p className="mt-3.5 text-sm leading-relaxed text-ink-soft">{product.description}</p>

            <div className="flex gap-2.5 text-[13.5px] mt-2 text-ink-soft">
              <span className="w-[70px] text-muted flex-shrink-0">Stok</span>
              <span>{product.stock} unit tersedia</span>
            </div>
            <div className="flex gap-2.5 text-[13.5px] mt-2 text-ink-soft">
              <span className="w-[70px] text-muted flex-shrink-0">Berat</span>
              <span>{product.weightGram} gram</span>
            </div>

            <div className="flex items-center gap-3.5 mt-4">
              <span className="text-[13.5px] text-muted w-[70px]">Jumlah</span>
              <div className="flex items-center border border-line rounded-[10px] overflow-hidden transition-colors duration-200">
                <button
                  className="w-[34px] h-[34px] bg-cream-deep border-none flex items-center justify-center cursor-pointer text-ink transition-colors duration-200"
                  onClick={() => setQty((q) => clampQty(q - 1))}
                >
                  <Icon icon="mdi:minus" width={16} />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(clampQty(Number(e.target.value) || 1))}
                  className="w-[46px] text-center border-none outline-none font-bold text-[13.5px] bg-surface text-ink transition-colors duration-200"
                />
                <button
                  className="w-[34px] h-[34px] bg-cream-deep border-none flex items-center justify-center cursor-pointer text-ink transition-colors duration-200"
                  onClick={() => setQty((q) => clampQty(q + 1))}
                >
                  <Icon icon="mdi:plus" width={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-[22px] flex-wrap">
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
            <p className="font-display font-extrabold text-[1.1rem] text-ink mb-4">Produk Terkait</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pb-8">
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
