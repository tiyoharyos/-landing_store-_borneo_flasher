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
        <p className="font-display font-extrabold text-[1.1rem] text-ink mt-6 mb-4">Keranjang Belanja</p>

        {!user && (
          <div className="flex items-center gap-2 bg-brand-tint text-brand-dark border border-brand/25 rounded-xl px-3.5 py-2.5 text-[12.75px] font-semibold mb-4 transition-colors duration-200">
            <Icon icon="mdi:lock-outline" width={17} />
            <span>
              Kamu belum masuk. <Link to="/masuk?next=/keranjang" className="underline font-bold">Masuk dulu</Link> untuk mulai
              menambahkan produk ke keranjang.
            </span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 pb-12 items-start">
            <div className="flex flex-col items-center text-center bg-surface border border-line rounded-2xl px-6 py-14 shadow-sm transition-colors duration-200">
              <div className="w-[140px] h-[140px] flex items-center justify-center text-line">
                <Icon icon="mdi:basket-outline" width={56} />
              </div>
              <p className="font-display font-extrabold text-[1.15rem] text-ink mt-6">
                Wah, keranjang belanjamu kosong
              </p>
              <p className="text-muted text-[13.5px] mt-1.5 max-w-[320px]">
                Yuk, isi dengan barang-barang kebutuhan servis kamu!
              </p>
              <Link to="/" className="inline-block mt-6">
                <Button variant="primary" icon="mdi:storefront-outline">
                  Mulai Belanja
                </Button>
              </Link>
            </div>

            <div className="bg-surface border border-line rounded-2xl p-5 sticky top-[90px] opacity-70 transition-colors duration-200">
              <p className="font-display font-bold text-[15px] text-ink mb-3">Ringkasan Belanja</p>
              <div className="flex justify-between text-[13.5px] text-ink-soft py-1.5">
                <span>Total</span>
                <span>-</span>
              </div>

              <div className="flex items-center gap-2 bg-cream-deep rounded-xl px-3.5 py-2.5 text-[13px] text-ink-soft mt-2 transition-colors duration-200">
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 pb-12 items-start">
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3.5 bg-surface border border-line rounded-2xl p-3.5 items-center transition-colors duration-200">
                  <Link to={`/produk/${item.product.slug}`} className="w-[72px] h-[72px] rounded-[10px] overflow-hidden flex-shrink-0 bg-cream-deep transition-colors duration-200">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/produk/${item.product.slug}`} className="block text-[13.5px] font-semibold text-ink line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="font-mono font-bold text-[13px] text-brand-dark mt-1">{formatRupiah(item.product.price)}</p>
                    <div className="flex items-center gap-3.5 mt-2">
                      <div className="flex items-center border border-line rounded-lg overflow-hidden transition-colors duration-200">
                        <button
                          className="w-[26px] h-[26px] bg-cream-deep flex items-center justify-center cursor-pointer text-ink transition-colors duration-200"
                          onClick={() => setQty(item.productId, item.qty - 1)}
                        >
                          <Icon icon="mdi:minus" width={14} />
                        </button>
                        <span className="w-[30px] text-center font-bold text-[13px] text-ink">{item.qty}</span>
                        <button
                          className="w-[26px] h-[26px] bg-cream-deep flex items-center justify-center cursor-pointer text-ink transition-colors duration-200"
                          onClick={() =>
                            setQty(item.productId, Math.min(item.product.stock, item.qty + 1))
                          }
                        >
                          <Icon icon="mdi:plus" width={14} />
                        </button>
                      </div>
                      <button
                        className="flex items-center gap-1 text-xs text-warn bg-transparent border-none cursor-pointer hover:underline transition-colors duration-200"
                        onClick={() => handleRemove(item.productId, item.product.name)}
                      >
                        <Icon icon="mdi:trash-can-outline" width={16} />
                        Hapus
                      </button>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-[13.5px] text-ink flex-shrink-0">{formatRupiah(item.lineTotal)}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-line rounded-2xl p-5 sticky top-[90px] transition-colors duration-200">
              <p className="font-display font-bold text-[15px] text-ink mb-3">Ringkasan Belanja</p>
              <div className="flex justify-between text-[13.5px] text-ink-soft py-1.5">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <p className="text-[11.5px] text-muted mt-1.5">
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
