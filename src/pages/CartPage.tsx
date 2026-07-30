import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/data/products";
import Button from "@/components/ui/Button";
import { confirmDialog, toastSuccess } from "@/components/ui/alert";

const LAYOUT_GRID = "grid grid-cols-1 items-start gap-[22px] pb-12 md:grid-cols-[1fr_320px]";
const SUMMARY_CARD = "sticky top-[90px] rounded-2xl border border-line bg-white p-5";

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
        <p className="mt-6 mb-4 font-display text-[1.1rem] font-extrabold text-ink">Keranjang Belanja</p>

        {!user && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#f2c9c8] bg-brand-tint px-3.5 py-2.5 text-[12.75px] font-semibold text-brand-dark">
            <Icon icon="mdi:lock-outline" width={17} />
            <span>
              Kamu belum masuk. <Link to="/masuk?next=/keranjang" className="font-bold underline">Masuk dulu</Link> untuk mulai
              menambahkan produk ke keranjang.
            </span>
          </div>
        )}

        {items.length === 0 ? (
          <div className={LAYOUT_GRID}>
            <div className="flex flex-col items-center rounded-[18px] border border-line bg-white px-6 py-14 text-center shadow-card-xs">
              <div className="flex h-[140px] w-[140px] items-center justify-center text-line">
                <Icon icon="mdi:basket-outline" width={56} />
              </div>
              <p className="mt-6 font-display text-[1.15rem] font-extrabold text-ink">Wah, keranjang belanjamu kosong</p>
              <p className="mt-1.5 max-w-[320px] text-[13.5px] text-muted">
                Yuk, isi dengan barang-barang kebutuhan servis kamu!
              </p>
              <Link to="/" className="mt-4 inline-block">
                <Button variant="primary" icon="mdi:storefront-outline">
                  Mulai Belanja
                </Button>
              </Link>
            </div>

            <div className={`${SUMMARY_CARD} opacity-90`}>
              <p className="mb-3 font-display text-[15px] font-bold text-ink">Ringkasan Belanja</p>
              <div className="flex justify-between py-1 text-[13.5px] text-ink-soft">
                <span>Total</span>
                <span>-</span>
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-xl bg-cream-deep px-3 py-2.5 text-[12.5px] font-semibold text-ink-soft">
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
          <div className={LAYOUT_GRID}>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3.5">
                  <Link
                    to={`/produk/${item.product.slug}`}
                    className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[10px] bg-cream-deep"
                  >
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/produk/${item.product.slug}`} className="line-clamp-1 text-[13.5px] font-semibold text-ink">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 font-mono text-[13px] font-bold text-brand-dark">{formatRupiah(item.product.price)}</p>
                    <div className="mt-2 flex items-center gap-3.5">
                      <div className="flex items-center overflow-hidden rounded-lg border border-line">
                        <button
                          className="flex h-[26px] w-[26px] items-center justify-center bg-cream-deep"
                          onClick={() => setQty(item.productId, item.qty - 1)}
                        >
                          <Icon icon="mdi:minus" width={14} />
                        </button>
                        <span className="w-[30px] text-center text-[13px] font-bold">{item.qty}</span>
                        <button
                          className="flex h-[26px] w-[26px] items-center justify-center bg-cream-deep"
                          onClick={() =>
                            setQty(item.productId, Math.min(item.product.stock, item.qty + 1))
                          }
                        >
                          <Icon icon="mdi:plus" width={14} />
                        </button>
                      </div>
                      <button
                        className="flex items-center gap-1 text-xs text-warn"
                        onClick={() => handleRemove(item.productId, item.product.name)}
                      >
                        <Icon icon="mdi:trash-can-outline" width={16} />
                        Hapus
                      </button>
                    </div>
                  </div>
                  <p className="flex-shrink-0 font-mono text-[13.5px] font-bold text-ink">{formatRupiah(item.lineTotal)}</p>
                </div>
              ))}
            </div>

            <div className={SUMMARY_CARD}>
              <p className="mb-3 font-display text-[15px] font-bold text-ink">Ringkasan Belanja</p>
              <div className="flex justify-between py-1 text-[13.5px] text-ink-soft">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <p className="mt-1.5 text-[11.5px] text-muted">
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
