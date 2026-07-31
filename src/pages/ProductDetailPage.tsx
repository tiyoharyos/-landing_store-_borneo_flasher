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
        <div className="container not-found-box">
          <Icon icon="mdi:package-variant-closed" width={64} style={{ color: "var(--line)" }} />
          <p className="title">Produk Tidak Ditemukan</p>
          <Link to="/" className="btn-clear mt-4 inline-block">
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
        <div className="breadcrumb">
          <Link to="/">Beranda</Link>
          <Icon icon="mdi:chevron-right" width={14} />
          {category && <Link to={`/kategori/${category.key}`}>{category.label}</Link>}
          <Icon icon="mdi:chevron-right" width={14} />
          <span>{product.name}</span>
        </div>

        <div className="product-detail-layout">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
            {pct > 0 && <span className="badge-discount lg">-{pct}%</span>}
            <button
              type="button"
              className={`wishlist-btn lg ${wished ? "active" : ""}`}
              aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
              onClick={() => toggle(product.id)}
            >
              <Icon icon={wished ? "mdi:heart" : "mdi:heart-outline"} width={22} />
            </button>
          </div>

          <div className="product-detail-info">
            <p className="product-detail-name">{product.name}</p>
            <div className="product-detail-meta">
              <span className="rating">
                <Icon icon="mdi:star" width={15} />
                {product.rating.toFixed(1)}
              </span>
              <span className="dot">•</span>
              <span>Terjual {product.sold}</span>
              <span className="dot">•</span>
              <span className={`badge ${product.condition === "Baru" ? "badge-open" : "badge-low"}`}>
                {product.condition}
              </span>
            </div>

            <div className="product-detail-price">
              <span className="price-final">{formatRupiah(product.price)}</span>
              {product.priceOriginal && (
                <span className="price-original">{formatRupiah(product.priceOriginal)}</span>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="product-detail-row">
              <span className="label">Stok</span>
              <span>{product.stock} unit tersedia</span>
            </div>
            <div className="product-detail-row">
              <span className="label">Berat</span>
              <span>{product.weightGram} gram</span>
            </div>

            <div className="qty-selector">
              <span className="label">Jumlah</span>
              <div className="qty-control">
                <button onClick={() => setQty((q) => clampQty(q - 1))}>
                  <Icon icon="mdi:minus" width={16} />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(clampQty(Number(e.target.value) || 1))}
                />
                <button onClick={() => setQty((q) => clampQty(q + 1))}>
                  <Icon icon="mdi:plus" width={16} />
                </button>
              </div>
            </div>

            <div className="product-detail-actions">
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
            <p className="section-title mb-4">Produk Terkait</p>
            <div className="product-grid">
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
