import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { formatRupiah, discountPercent, type Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const pct = discountPercent(product);

  return (
    <Link to={`/produk/${product.slug}`} className="product-card">
      <div className="product-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
        {pct > 0 && <span className="badge-discount">-{pct}%</span>}
        {product.condition === "Bekas Layak Pakai" && (
          <span className="badge-condition">Bekas</span>
        )}
      </div>
      <div className="product-card-body">
        <p className="product-card-name">{product.name}</p>
        <div className="product-card-price">
          <span className="price-final">{formatRupiah(product.price)}</span>
          {product.priceOriginal && (
            <span className="price-original">{formatRupiah(product.priceOriginal)}</span>
          )}
        </div>
        <div className="product-card-meta">
          <span className="rating">
            <Icon icon="mdi:star" width={13} />
            {product.rating.toFixed(1)}
          </span>
          <span className="dot">•</span>
          <span>Terjual {product.sold}</span>
        </div>
      </div>
    </Link>
  );
}
