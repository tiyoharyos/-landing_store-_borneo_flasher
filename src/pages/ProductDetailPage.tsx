import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion, useAnimation } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Button from "@/components/ui/Button";
import { type Product, formatRupiah, discountPercent } from "@/data/products";
import { getProductDetail, getProducts } from "@/services/productsService";
import { getCategories } from "@/services/categoriesService";
import { mapApiProductToProduct, mapApiProductsToProducts, mapCategoryOptions, type CategoryOption } from "@/lib/mapProduct";
import { getApiErrorMessage } from "@/lib/axios";

const LOW_STOCK_THRESHOLD = 5;
function extractIdFromSlug(slug: string): string {
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const qtyPulse = useAnimation();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setQty(1);
  }, [slug]);

  useEffect(() => {
    if (product && product.stock <= 0) setQty(0);
  }, [product]);

  // Feedback halus tiap jumlah berubah, tanpa remount input (jadi input
  // tetap bisa diketik langsung tanpa kehilangan fokus).
  useEffect(() => {
    qtyPulse.start({ scale: [1, 1.12, 1], transition: { duration: 0.22, ease: "easeOut" } });
  }, [qty, qtyPulse]);

  // Ambil daftar kategori sekali di awal, dipakai buat label breadcrumb.
  useEffect(() => {
    let active = true;
    getCategories()
      .then((res) => {
        if (!active) return;
        setCategories(mapCategoryOptions(res.data ?? []));
      })
      .catch(() => {
        // Breadcrumb kategori opsional, gagal muat tetap lanjut.
      });
    return () => {
      active = false;
    };
  }, []);

  // Fetch detail produk (Products/detail/:id) tiap kali slug berubah.
  useEffect(() => {
    if (!slug) return;
    const id = extractIdFromSlug(slug);

    let active = true;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setRelated([]);

    getProductDetail(id)
      .then((res) => {
        if (!active) return;
        if (!res.status || !res.data) {
          setNotFound(true);
          return;
        }
        const mapped = mapApiProductToProduct(res.data);
        setProduct(mapped);

        // Ambil produk terkait dari kategori yang sama.
        getProducts({ id_kategori: mapped.category })
          .then((relRes) => {
            if (!active) return;
            const relatedItems = mapApiProductsToProducts(relRes.data ?? []).filter(
              (p) => p.id !== mapped.id
            );
            setRelated(relatedItems.slice(0, 4));
          })
          .catch(() => {
            // Produk terkait opsional, gagal muat tetap lanjut.
          });
      })
      .catch((err) => {
        if (!active) return;
        setNotFound(true);
        setError(getApiErrorMessage(err, "Gagal memuat detail produk."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div>
        <div className="container pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_320px] gap-6 pb-4">
            <div className="rounded-xl aspect-square bg-cream-deep animate-pulse" />
            <div className="flex flex-col gap-3 pt-2">
              <div className="h-6 w-3/4 bg-cream-deep rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-cream-deep rounded animate-pulse" />
              <div className="h-8 w-1/3 bg-cream-deep rounded animate-pulse" />
              <div className="h-20 w-full bg-cream-deep rounded animate-pulse" />
            </div>
            <div className="hidden lg:block h-64 bg-cream-deep rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div>
        <div className="container text-center py-12 px-6">
          <Icon icon="mdi:package-variant-closed" width={64} className="text-line inline-block" />
          <p className="font-display font-bold text-[1.1rem] mt-4">Produk Tidak Ditemukan</p>
          {error && <p className="text-muted text-sm mt-1">{error}</p>}
          <Link
            to="/"
            className="mt-4 inline-block border border-brand text-brand text-[13px] font-semibold rounded-lg px-6 py-2 hover:bg-brand-tint transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const pct = discountPercent(product);
  const category = categories.find((c) => c.key === product.category);
  // Banyak produk lama belum ada id_kategori-nya (null) tapi backend tetap
  // kadang mengirim nama_kategori langsung di response — pakai itu sebagai
  // fallback label breadcrumb kalau lookup by ID tidak ketemu.
  const categoryLabel = category?.label ?? product.categoryName;
  const wished = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const isLowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD;
  const stockTone = outOfStock ? "warn" : isLowStock ? "amber" : "ok";
  const subtotal = product.price * qty;

  const clampQty = (n: number) => (outOfStock ? 0 : Math.max(1, Math.min(product.stock, n)));

  const handleAddToCart = () => {
    // Toast sukses/gagal sudah ditangani di dalam CartContext.addItem.
    addItem(product.id, qty);
  };

  const handleBuyNow = async () => {
    const added = await addItem(product.id, qty);
    if (added) navigate("/keranjang");
  };

  return (
    <div>
      <div className="container pt-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-5 flex-wrap">
          <Link to="/" className="transition-colors hover:text-brand">Beranda</Link>
          <Icon icon="mdi:chevron-right" width={14} />
          {categoryLabel && (
            <>
              {category ? (
                <Link to={`/kategori/${category.key}`} className="transition-colors hover:text-brand">
                  {categoryLabel}
                </Link>
              ) : (
                <span>{categoryLabel}</span>
              )}
              <Icon icon="mdi:chevron-right" width={14} />
            </>
          )}
          <span className="truncate max-w-[220px]" title={product.name}>
            {product.name}
          </span>
        </div>

        {/* Layout utama: gambar | info produk | sidebar beli */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_320px] gap-6 items-start pb-4">
          {/* Kolom gambar */}
          <motion.div
            key={`img-${product.id}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-xl overflow-hidden bg-cream-deep aspect-square border border-line"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {pct > 0 && (
              <span className="absolute top-3 left-3 bg-brand text-white text-[13px] font-extrabold px-2.5 py-1 rounded-md">
                -{pct}%
              </span>
            )}
            {outOfStock && (
              <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
                <span className="bg-surface/95 text-warn text-[13px] font-extrabold px-4 py-1.5 rounded-full">
                  Stok Habis
                </span>
              </div>
            )}
            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full border border-line bg-surface/95 flex items-center justify-center cursor-pointer transition-colors ${
                wished ? "text-brand" : "text-ink-soft"
              }`}
              aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
              onClick={() => toggle(product.id)}
            >
              <motion.span
                key={wished ? "filled" : "outline"}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Icon icon={wished ? "mdi:heart" : "mdi:heart-outline"} width={22} />
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Kolom info produk */}
          <motion.div
            key={`info-${product.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display font-extrabold text-[1.3rem] text-ink leading-snug">{product.name}</p>

            {(product.sold > 0 || product.rating > 0) && (
              <div className="flex items-center gap-2 text-[13px] text-muted mt-2 flex-wrap">
                {product.sold > 0 && <span>Terjual {product.sold}+</span>}
                {product.sold > 0 && product.rating > 0 && <span className="text-line">•</span>}
                {product.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:star" width={14} className="text-amber" />
                    {product.rating.toFixed(1)}
                  </span>
                )}
              </div>
            )}

            <div className="mt-3.5 flex items-baseline gap-2.5">
              <span className="font-mono font-extrabold text-2xl text-ink">{formatRupiah(product.price)}</span>
              {product.priceOriginal && (
                <>
                  {pct > 0 && (
                    <span className="bg-brand/10 text-brand text-[11px] font-extrabold px-1.5 py-0.5 rounded">
                      {pct}%
                    </span>
                  )}
                  <span className="line-through text-muted text-xs">{formatRupiah(product.priceOriginal)}</span>
                </>
              )}
            </div>

            {/* Spesifikasi produk — langsung tampil, tanpa tab & tanpa judul */}
           <motion.div
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, delay: 0.15 }}
  className="mt-5 pt-4 border-t border-line flex flex-col gap-2"
>
  <div className="flex gap-2.5 text-[13.5px] text-ink-soft">
    <span className="w-[120px] text-muted flex-shrink-0">Kondisi</span>
    <span>{product.condition}</span>
  </div>

  {product.weightGram > 0 && (
    <div className="flex gap-2.5 text-[13.5px] text-ink-soft">
      <span className="w-[120px] text-muted flex-shrink-0">Berat Satuan</span>
      <span>{product.weightGram} g</span>
    </div>
  )}

  {product.code && (
    <div className="flex gap-2.5 text-[13.5px] text-ink-soft">
      <span className="w-[120px] text-muted flex-shrink-0">Kode Produk</span>
      <span className="font-mono">{product.code}</span>
    </div>
  )}

  <div className="flex gap-2.5 text-[13.5px] text-ink-soft">
    <span className="w-[120px] text-muted flex-shrink-0">Kategori</span>
    <span>{categoryLabel ?? "-"}</span>
  </div>

  {product.supplier && (
    <div className="flex gap-2.5 text-[13.5px] text-ink-soft">
      <span className="w-[120px] text-muted flex-shrink-0">Supplier</span>
      <span>{product.supplier}</span>
    </div>
  )}

  {product.location && (
    <div className="flex gap-2.5 text-[13.5px] text-ink-soft">
      <span className="w-[120px] text-muted flex-shrink-0">Lokasi</span>
      <span>{product.location}</span>
    </div>
  )}

  <div className="flex gap-2.5 text-[13.5px] text-ink-soft">
    <span className="w-[120px] text-muted flex-shrink-0">Stok</span>
    <span>{outOfStock ? "0 unit" : `${product.stock} unit`}</span>
  </div>

  {product.description && (
    <div className="flex gap-2.5 text-[13.5px] text-ink-soft pt-1">
      <span className="w-[120px] text-muted flex-shrink-0">Deskripsi</span>
      <span className="leading-relaxed whitespace-pre-line">{product.description}</span>
    </div>
  )}
</motion.div>
          </motion.div>

          {/* Sidebar beli — sticky di desktop */}
          <motion.aside
            key={`buy-${product.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-[90px] bg-surface border border-line rounded-xl p-5 flex flex-col gap-4"
          >
            {/* Status stok spotlight */}
            <div
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 ${
                stockTone === "warn"
                  ? "bg-warn/5 border-warn/30"
                  : stockTone === "amber"
                  ? "bg-amber/10 border-amber/30"
                  : "bg-ok/5 border-ok/25"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  stockTone === "warn"
                    ? "bg-warn/15 text-warn"
                    : stockTone === "amber"
                    ? "bg-amber/20 text-amber-dark"
                    : "bg-ok/15 text-ok"
                }`}
              >
                <Icon
                  icon={
                    stockTone === "warn"
                      ? "mdi:package-variant-closed-remove"
                      : stockTone === "amber"
                      ? "mdi:alert-circle"
                      : "mdi:check-decagram"
                  }
                  width={18}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[13px] font-bold leading-tight ${
                    stockTone === "warn" ? "text-warn" : stockTone === "amber" ? "text-amber-dark" : "text-ok"
                  }`}
                >
                  {outOfStock ? "Stok Habis" : isLowStock ? `Tersisa ${product.stock} unit!` : "Stok Tersedia"}
                </p>
                <p className="text-[11.5px] text-muted mt-0.5">
                  {outOfStock
                    ? "Pantau lewat wishlist."
                    : isLowStock
                    ? "Segera checkout."
                    : `${product.stock} unit siap dikirim`}
                </p>
              </div>
              {isLowStock && (
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-amber shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>

            <div>
              <p className="text-[12.5px] font-semibold text-ink-soft mb-2">Atur jumlah</p>
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`flex items-center border border-line rounded-[10px] overflow-hidden ${
                    outOfStock ? "opacity-50" : ""
                  }`}
                >
                  <motion.button
                    whileTap={{ scale: outOfStock ? 1 : 0.85 }}
                    disabled={outOfStock}
                    className="w-[34px] h-[34px] bg-cream-deep border-none flex items-center justify-center text-ink disabled:cursor-not-allowed cursor-pointer"
                    onClick={() => setQty((q) => clampQty(q - 1))}
                  >
                    <Icon icon="mdi:minus" width={16} />
                  </motion.button>
                  <motion.input
                    type="number"
                    value={qty}
                    animate={qtyPulse}
                    disabled={outOfStock}
                    onChange={(e) => setQty(clampQty(Number(e.target.value) || 1))}
                    className="w-[46px] text-center border-none outline-none font-bold text-[13.5px] bg-surface text-ink disabled:cursor-not-allowed"
                  />
                  <motion.button
                    whileTap={{ scale: outOfStock ? 1 : 0.85 }}
                    disabled={outOfStock}
                    className="w-[34px] h-[34px] bg-cream-deep border-none flex items-center justify-center text-ink disabled:cursor-not-allowed cursor-pointer"
                    onClick={() => setQty((q) => clampQty(q + 1))}
                  >
                    <Icon icon="mdi:plus" width={16} />
                  </motion.button>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted">Stok Total</p>
                  <p className="text-[13px] font-bold text-ink">{product.stock.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-line pt-3.5 flex items-center justify-between">
              <span className="text-[13px] text-muted">Subtotal</span>
              <div className="text-right">
                {product.priceOriginal && (
                  <p className="line-through text-muted text-[11px]">
                    {formatRupiah(product.priceOriginal * qty)}
                  </p>
                )}
                <p className="font-mono font-extrabold text-[17px] text-ink">{formatRupiah(subtotal)}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                variant="outline"
                size="lg"
                icon="mdi:cart-plus"
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="w-full justify-center"
              >
                Keranjang
              </Button>
              <Button
                variant="primary"
                size="lg"
                disabled={outOfStock}
                onClick={handleBuyNow}
                className="w-full justify-center"
              >
                Beli Langsung
              </Button>
            </div>

            <div className="flex items-center justify-center gap-5 pt-1 text-[12px] text-ink-soft">
              <button type="button" className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer hover:text-brand transition-colors">
                <Icon icon="mdi:chat-outline" width={17} />
                Chat
              </button>
              <button
                type="button"
                onClick={() => toggle(product.id)}
                className={`flex items-center gap-1.5 bg-transparent border-none cursor-pointer transition-colors ${
                  wished ? "text-brand" : "hover:text-brand"
                }`}
              >
                <Icon icon={wished ? "mdi:heart" : "mdi:heart-outline"} width={17} />
                Wishlist
              </button>
              <button type="button" className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer hover:text-brand transition-colors">
                <Icon icon="mdi:share-variant-outline" width={17} />
                Share
              </button>
            </div>
          </motion.aside>
        </div>

        {related.length > 0 && (
          <div className="mt-10 pb-16">
            <p className="font-display font-extrabold text-[1.1rem] text-ink mb-4">Produk Terkait</p>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {related.map((p) => (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}