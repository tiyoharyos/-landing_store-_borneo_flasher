import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/data/products";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/Toast";
import FadeIn from "@/components/FadeIn";
import AnimatedGrid, { AnimatedGridItem } from "@/components/AnimatedGrid";
import SafeImage from "@/components/SafeImage";

export default function CartPage() {
  const { items, subtotal, loading, removeItem, setQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const goCheckout = () => {
    if (!user) {
      navigate("/masuk?next=/checkout");
      return;
    }
    navigate("/checkout");
  };

  const handleRemove = async (productId: string, name: string) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Hapus produk ini?",
      text: `"${name}" akan dihapus dari keranjang kamu.`,
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--brand)",
    });
    if (res.isConfirmed) {
      removeItem(productId);
      toast.success("Produk dihapus dari keranjang");
    }
  };

  return (
    <div>
      <div className="container pt-6">
        <p className="font-display font-extrabold text-[1.1rem] text-ink mb-4">Keranjang Belanja</p>

        {!user && (
          <div className="flex items-center gap-2 bg-brand-tint text-brand-dark border border-brand/25 rounded-xl px-3.5 py-2.5 text-[12.75px] font-semibold mb-4">
            <Icon icon="mdi:lock-outline" width={17} />
            <span>
              Kamu belum masuk. <Link to="/masuk?next=/keranjang" className="underline font-bold">Masuk dulu</Link> untuk mulai
              menambahkan produk ke keranjang.
            </span>
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
            <Icon icon="mdi:loading" width={32} className="animate-spin" />
            <span className="text-[13px]">Memuat keranjang...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 pb-12 items-start">
            <FadeIn className="flex flex-col items-center text-center bg-surface border border-line rounded-xl px-6 py-14 shadow-sm">
              <div className="w-[140px] h-[140px] flex items-center justify-center text-line">
                <Icon icon="mdi:basket-outline" width={56} />
              </div>
              <p className="font-display font-extrabold text-[1.15rem] text-ink mt-6">
                Wah, keranjang belanjamu kosong
              </p>
              <p className="text-muted text-[13.5px] mt-1.5 max-w-[320px]">
                Yuk, isi dengan barang-barang kebutuhan servis kamu!
              </p>
              <ButtonLink to="/" icon="mdi:storefront-outline" className="mt-6">
                Mulai Belanja
              </ButtonLink>
            </FadeIn>

            <FadeIn delay={0.08} className="bg-surface border border-line rounded-xl p-5 sticky top-[90px] opacity-70">
              <p className="font-display font-bold text-[15px] text-ink mb-3">Ringkasan Belanja</p>
              <div className="flex justify-between text-[13.5px] text-ink-soft py-1.5">
                <span>Total</span>
                <span>-</span>
              </div>

              <div className="flex items-center gap-2 bg-cream-deep rounded-xl px-3.5 py-2.5 text-[13px] text-ink-soft mt-2">
                <Icon icon="mdi:tag-outline" width={18} />
                <span>Makin hemat pakai promo</span>
                <Icon icon="mdi:chevron-right" width={18} className="ml-auto" />
              </div>

              <Button variant="primary" size="lg" fullWidth className="mt-3" disabled>
                Beli
              </Button>
            </FadeIn>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 pb-12 items-start">
            <AnimatedGrid className="flex flex-col gap-3">
              {items.map((item) => (
                <AnimatedGridItem key={item.productId}>
                  <div className="flex gap-3.5 bg-surface border border-line rounded-xl p-3.5 items-center">
                  <Link to={`/produk/${item.product.slug}`} className="w-[72px] h-[72px] rounded-[10px] overflow-hidden flex-shrink-0 bg-cream-deep">
                    <SafeImage src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/produk/${item.product.slug}`} className="block text-[13.5px] font-semibold text-ink line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="font-mono font-bold text-[13px] text-brand-dark mt-1">{formatRupiah(item.product.price)}</p>
                    <div className="flex items-center gap-3.5 mt-2">
                      <div className="flex items-center border border-line rounded-lg overflow-hidden">
                        <Button
                          variant="subtle"
                          size="sm"
                          icon="mdi:minus"
                          onClick={() => setQty(item.productId, item.qty - 1)}
                          aria-label="Kurangi jumlah"
                          className="w-[26px]! h-[26px]! p-0! rounded-none! border-none!"
                        />
                        <span className="w-[30px] text-center font-bold text-[13px] text-ink">{item.qty}</span>
                        <Button
                          variant="subtle"
                          size="sm"
                          icon="mdi:plus"
                          onClick={() =>
                            setQty(item.productId, Math.min(item.product.stock, item.qty + 1))
                          }
                          aria-label="Tambah jumlah"
                          className="w-[26px]! h-[26px]! p-0! rounded-none! border-none!"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        icon="mdi:trash-can-outline"
                        onClick={() => handleRemove(item.productId, item.product.name)}
                        className="h-auto! w-auto! p-0! border-none! gap-1 text-warn! text-xs hover:bg-transparent! hover:underline"
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-[13.5px] text-ink flex-shrink-0">{formatRupiah(item.lineTotal)}</p>
                  </div>
                </AnimatedGridItem>
              ))}
            </AnimatedGrid>

            <FadeIn delay={0.1} className="bg-surface border border-line rounded-xl p-5 sticky top-[90px]">
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
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  );
}
