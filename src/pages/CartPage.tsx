import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/data/products";
import Button from "@/components/ui/Button";
import { confirmDialog, toastSuccess } from "@/components/ui/alert";

export default function CartPage() {
  const { items, subtotal, removeItem, setQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goCheckout = () => {
    if (!user) {
      navigate("/masuk?next=/checkout");
      return;
    }
    navigate("/checkout");
  };

  const handleRemove = async (productId: string, name: string) => {
    const ok = await confirmDialog({
      title: "Hapus produk ini?",
      text: `"${name}" akan dihapus dari keranjang kamu.`,
      confirmText: "Ya, hapus",
      icon: "warning",
      danger: true,
    });
    if (ok) {
      removeItem(productId);
      toastSuccess("Produk dihapus dari keranjang");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <p className="section-title mt-6 mb-4">Keranjang Belanja</p>

        {!user && (
          <div className="cart-login-notice">
            <Icon icon="mdi:lock-outline" width={17} />
            <span>
              Kamu belum masuk. <Link to="/masuk?next=/keranjang">Masuk dulu</Link> untuk mulai
              menambahkan produk ke keranjang.
            </span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="cart-empty-layout">
            <div className="cart-empty-box">
              <div className="cart-empty-illustration">
                <Icon icon="mdi:basket-outline" width={56} />
              </div>
              <p className="cart-empty-title">Wah, keranjang belanjamu kosong</p>
              <p className="cart-empty-desc">
                Yuk, isi dengan barang-barang kebutuhan servis kamu!
              </p>
              <Link to="/" className="inline-block mt-4">
                <Button variant="primary" icon="mdi:storefront-outline">
                  Mulai Belanja
                </Button>
              </Link>
            </div>

            <div className="cart-summary cart-summary-disabled">
              <p className="cart-summary-title">Ringkasan Belanja</p>
              <div className="cart-summary-row">
                <span>Total</span>
                <span>-</span>
              </div>

              <div className="cart-promo-banner">
                <Icon icon="mdi:tag-outline" width={18} />
                <span>Makin hemat pakai promo</span>
                <Icon icon="mdi:chevron-right" width={18} className="ml-auto" />
              </div>

              <Button variant="primary" size="lg" fullWidth className="mt-3" disabled>
                Beli
              </Button>
            </div>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <div key={item.productId} className="cart-item">
                  <Link to={`/produk/${item.product.slug}`} className="cart-item-img">
                    <img src={item.product.image} alt={item.product.name} />
                  </Link>
                  <div className="cart-item-body">
                    <Link to={`/produk/${item.product.slug}`} className="cart-item-name">
                      {item.product.name}
                    </Link>
                    <p className="cart-item-price">{formatRupiah(item.product.price)}</p>
                    <div className="cart-item-controls">
                      <div className="qty-control sm">
                        <button onClick={() => setQty(item.productId, item.qty - 1)}>
                          <Icon icon="mdi:minus" width={14} />
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() =>
                            setQty(item.productId, Math.min(item.product.stock, item.qty + 1))
                          }
                        >
                          <Icon icon="mdi:plus" width={14} />
                        </button>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => handleRemove(item.productId, item.product.name)}
                      >
                        <Icon icon="mdi:trash-can-outline" width={16} />
                        Hapus
                      </button>
                    </div>
                  </div>
                  <p className="cart-item-total">{formatRupiah(item.lineTotal)}</p>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p className="cart-summary-title">Ringkasan Belanja</p>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <p className="cart-summary-note">
                Ongkos kirim dihitung di halaman checkout.
              </p>
              <Button variant="primary" size="lg" fullWidth className="mt-3" onClick={goCheckout}>
                Checkout ({items.length})
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}