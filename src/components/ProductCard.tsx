import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { formatRupiah, discountPercent, type Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const pct = discountPercent(product);

  return (
    <Link
      to={`/produk/${product.slug}`}
      className="block overflow-hidden rounded-[14px] border border-line bg-white transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-14px_rgba(28,22,19,0.22)]"
    >
      <div className="relative aspect-square bg-cream-deep">
        <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
        {pct > 0 && (
          <span className="absolute top-2 left-2 rounded-md bg-brand px-[7px] py-0.5 text-[10.5px] font-extrabold text-white">
            -{pct}%
          </span>
        )}
        {product.condition === "Bekas Layak Pakai" && (
          <span className="absolute top-2 right-2 rounded-md bg-[rgba(28,22,19,0.65)] px-[7px] py-0.5 text-[10px] font-bold text-white">
            Bekas
          </span>
        )}
      </div>
      <div className="px-3 pt-2.5 pb-3">
        <p className="min-h-[35px] line-clamp-2 text-[13px] leading-[1.35] font-semibold text-ink">{product.name}</p>
        <div className="mt-1.5 flex flex-col">
          <span className="font-mono font-bold text-brand-dark">{formatRupiah(product.price)}</span>
          {product.priceOriginal && (
            <span className="block text-xs text-muted line-through">{formatRupiah(product.priceOriginal)}</span>
          )}
        </div>
        <div className="mt-1.5 flex items-center gap-[5px] text-[11.5px] text-muted">
          <span className="flex items-center gap-0.5 font-bold text-amber-dark">
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
