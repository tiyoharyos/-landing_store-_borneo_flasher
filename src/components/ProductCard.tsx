import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { formatRupiah, discountPercent, type Product } from "@/data/products";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const pct = discountPercent(product);
  const { isWishlisted, toggle } = useWishlist();
  const wished = isWishlisted(product.id);

  return (
    <Link
      to={`/produk/${product.slug}`}
      className="block bg-surface border border-line rounded-[14px] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-square bg-cream-deep">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {pct > 0 && (
          <span className="absolute top-2 left-2 bg-brand text-white text-[10.5px] font-extrabold px-[7px] py-0.5 rounded-md">
            -{pct}%
          </span>
        )}
        {product.condition === "Bekas Layak Pakai" && (
          <span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-[7px] py-0.5 rounded-md">
            Bekas
          </span>
        )}
        <button
          type="button"
          className={`absolute top-2 right-2 w-7 h-7 rounded-full border-none bg-white/92 flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-110 z-[2] ${
            wished ? "text-brand" : "text-ink-soft"
          }`}
          aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
        >
          <Icon icon={wished ? "mdi:heart" : "mdi:heart-outline"} width={16} />
        </button>
      </div>
      <div className="px-3 pt-2.5 pb-3">
        <p className="text-[13px] font-semibold text-ink leading-[1.35] line-clamp-2 min-h-[35px]">
          {product.name}
        </p>
        <div className="flex flex-col mt-1.5">
          <span className="font-mono font-bold text-brand-dark">{formatRupiah(product.price)}</span>
          {product.priceOriginal && (
            <span className="line-through text-muted text-xs block">
              {formatRupiah(product.priceOriginal)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11.5px] text-muted mt-1.5">
          <span className="flex items-center gap-0.5 text-amber-dark font-bold">
            <Icon icon="mdi:star" width={13} />
            {product.rating.toFixed(1)}
          </span>
          <span className="text-line">•</span>
          <span>Terjual {product.sold}</span>
        </div>
      </div>
    </Link>
  );
}
