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

// Slug digenerate di frontend sebagai `${slugify(nama)}-${id_produk}`
// (lihat src/lib/mapProduct.ts), jadi id produk selalu ada di segmen
// terakhir setelah tanda hubung paling akhir.
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

  // Reset jumlah tiap ganti produk (mis. klik produk terkait) supaya
  // navigasi antar produk terasa bersih, bukan bawa-bawa state lama.
  useEffect(() => {
    setQty(1);
  }, [slug]);

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
          <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-7 pb-4">
            <div className="rounded-[18px] aspect-square bg-cream-deep animate-pulse" />
            <div className="flex flex-col gap-3 pt-2">
              <div className="h-6 w-3/4 bg-cream-deep rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-cream-deep rounded animate-pulse" />
              <div className="h-8 w-1/3 bg-cream-deep rounded animate-pulse" />
              <div className="h-20 w-full bg-cream-deep rounded animate-pulse" />
            </div>
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
  const wished = isWishlisted(product.id);

  const clampQty = (n: number) => Math.max(1, Math.min(product.stock, n));

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
        <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-5 flex-wrap">
          <Link to="/" className="transition-colors hover:text-brand">Beranda</Link>
          <Icon icon="mdi:chevron-right" width={14} />
          {category && (
            <Link to={`/kategori/${category.key}`} className="transition-colors hover:text-brand">
              {category.label}
            </Link>
          )}
          <Icon icon="mdi:chevron-right" width={14} />
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-7 pb-4">
          <motion.div
            key={`img-${product.id}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-xl overflow-hidden bg-cream-deep aspect-square self-start border border-line"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {pct > 0 && (
              <span className="absolute top-3 left-3 bg-brand text-white text-[13px] font-extrabold px-2.5 py-1 rounded-md">
                -{pct}%
              </span>
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

          <motion.div
            key={`info-${product.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display font-extrabold text-[1.4rem] text-ink">{product.name}</p>
            <div className="flex items-center gap-2 text-[13px] text-muted mt-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold whitespace-nowrap ${
                  product.stock > 0 ? "bg-ok/10 text-ok" : "bg-amber/15 text-amber-dark"
                }`}
              >
                {product.stock > 0 ? "Tersedia" : "Stok Habis"}
              </span>
            </div>

            <div className="mt-3.5 flex items-baseline gap-2.5">
              <span className="font-mono font-extrabold text-2xl text-ink">{formatRupiah(product.price)}</span>
              {product.priceOriginal && (
                <span className="line-through text-muted text-xs">{formatRupiah(product.priceOriginal)}</span>
              )}
            </div>

            {product.description && (
              <p className="mt-3.5 text-sm leading-relaxed text-ink-soft">{product.description}</p>
            )}

            <div className="flex gap-2.5 text-[13.5px] mt-2 text-ink-soft">
              <span className="w-[70px] text-muted flex-shrink-0">Stok</span>
              <span>{product.stock} unit tersedia</span>
            </div>

            <div className="flex items-center gap-3.5 mt-4">
              <span className="text-[13.5px] text-muted w-[70px]">Jumlah</span>
              <div className="flex items-center border border-line rounded-[10px] overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="w-[34px] h-[34px] bg-cream-deep border-none flex items-center justify-center cursor-pointer text-ink"
                  onClick={() => setQty((q) => clampQty(q - 1))}
                >
                  <Icon icon="mdi:minus" width={16} />
                </motion.button>
                <motion.input
                  type="number"
                  value={qty}
                  animate={qtyPulse}
                  onChange={(e) => setQty(clampQty(Number(e.target.value) || 1))}
                  className="w-[46px] text-center border-none outline-none font-bold text-[13.5px] bg-surface text-ink"
                />
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  className="w-[34px] h-[34px] bg-cream-deep border-none flex items-center justify-center cursor-pointer text-ink"
                  onClick={() => setQty((q) => clampQty(q + 1))}
                >
                  <Icon icon="mdi:plus" width={16} />
                </motion.button>
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
          </motion.div>
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
