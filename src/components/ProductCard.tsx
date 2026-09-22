import { Link } from "react-router-dom";
import { memo } from "react";
import { formatRupiah, discountPercent, type Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/SafeImage";

function ProductCard({ product }: { product: Product }) {
  const pct = discountPercent(product);
  const { isWishlisted, toggle } = useWishlist();
  const wished = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/produk/${product.slug}`}
      className={`group block bg-surface border border-line rounded-2xl overflow-hidden transition-[transform,box-shadow,border-color] duration-300 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:border-ink/15 ${
        outOfStock ? "opacity-80" : ""
      }`}
    >
      <div className="relative aspect-square bg-cream-deep overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.06] ${outOfStock ? "grayscale opacity-60" : ""}`}
        />
        {outOfStock && (
          <div className="absolute inset-0 z-[1] flex items-center justify-center bg-ink/45">
            <span className="bg-surface/95 text-ink text-[11px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-full border border-line shadow-[var(--shadow-sm)]">
              Stok Habis
            </span>
          </div>
        )}
        {!outOfStock && pct > 0 && (
          <span className="absolute top-2 left-2 bg-surface text-brand-dark text-[10.5px] font-bold px-[7px] py-0.5 rounded-md border border-line">
            -{pct}%
          </span>
        )}
        {product.condition === "Bekas Layak Pakai" && (
          <span className="absolute bottom-2 left-2 bg-surface/95 text-ink-soft text-[10px] font-semibold px-[7px] py-0.5 rounded-md border border-line">
            Bekas
          </span>
        )}
        <Button
          variant="outline"
          icon={wished ? "mdi:heart" : "mdi:heart-outline"}
          aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className={`absolute top-2 right-2 w-7! h-7! p-0! rounded-full! bg-surface/95! z-[2] ${
            wished ? "text-brand!" : "text-ink-soft!"
          }`}
        />
      </div>
      <div className="px-3.5 pt-3 pb-3.5">
        <p
          className={`text-[13px] font-semibold leading-[1.4] line-clamp-2 min-h-[35px] ${
            outOfStock ? "text-ink-soft" : "text-ink"
          }`}
        >
          {product.name}
        </p>
        <div className="flex flex-col mt-2 gap-0.5">
          <span className={`font-mono font-bold ${outOfStock ? "text-muted" : "text-ink"}`}>
            {formatRupiah(product.price)}
          </span>
          {product.priceOriginal && (
            <span className="line-through text-muted text-xs block">
              {formatRupiah(product.priceOriginal)}
            </span>
          )}
        </div>
        {outOfStock ? (
          <p className="mt-1.5 text-[11px] font-semibold text-warn">Stok sedang habis</p>
        ) : (
          <p className="mt-1.5 text-[11px] text-ink-soft">
            Stok:{" "}
            <span className={`font-bold ${product.stock <= 5 ? "text-amber-dark" : "text-ok"}`}>
              {product.stock}
            </span>{" "}
            unit
          </p>
        )}
        {/* <div className="flex items-center gap-1.5 text-[11.5px] text-muted mt-1.5">
          <span className="flex items-center gap-0.5 text-amber-dark font-bold">
            <Icon icon="mdi:star" width={13} />
            {product.rating.toFixed(1)}
          </span>
          <span className="text-line">•</span>
          <span>Terjual {product.sold}</span>
        </div> */}
      </div>
    </Link>
  );
}

export default memo(ProductCard);
