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
    <div className="min-h-screen">
      <div className="container pt-6 pb-14">
        <div className="mb-5 rounded-[30px] border border-line bg-surface/80 p-4 shadow-[var(--shadow-sm)] backdrop-blur-sm md:p-5">
          <p className="font-display text-[1.6rem] font-extrabold tracking-[-0.05em] text-ink md:text-[2rem]">
            Keranjang Belanja
          </p>
        </div>

        {!user && (
          <div className="mb-4 flex items-center gap-2 rounded-[18px] border border-brand/25 bg-brand-tint px-3.5 py-2.5 text-[12.75px] font-semibold text-brand-dark">
            <Icon icon="mdi:lock-outline" width={17} />
            <span>
              Kamu belum masuk. <Link to="/masuk?next=/keranjang" className="font-bold underline">Masuk dulu</Link> untuk mulai
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
          <div className="grid grid-cols-1 items-start gap-5 pb-12 md:grid-cols-[1fr_320px]">
            <FadeIn className="flex flex-col items-center rounded-[30px] border border-line bg-surface px-6 py-14 text-center shadow-[var(--shadow-sm)]">
              <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-cream-deep text-line">
                <Icon icon="mdi:basket-outline" width={56} />
              </div>
              <p className="mt-6 font-display text-[1.15rem] font-extrabold text-ink">
                Wah, keranjang belanjamu kosong
              </p>
              <p className="mt-1.5 max-w-[320px] text-[13.5px] text-muted">
                Yuk, isi dengan barang-barang kebutuhan servis kamu!
              </p>
              <ButtonLink to="/" icon="mdi:storefront-outline" className="mt-6">
                Mulai Belanja
              </ButtonLink>
            </FadeIn>

            <FadeIn delay={0.08} className="sticky top-[90px] rounded-[28px] border border-line bg-surface p-5 opacity-70 shadow-[var(--shadow-sm)]">
              <p className="mb-3 font-display text-[15px] font-bold text-ink">Ringkasan Belanja</p>
              <div className="flex justify-between py-1.5 text-[13.5px] text-ink-soft">
                <span>Total</span>
                <span>-</span>
              </div>

              <div className="mt-2 flex items-center gap-2 rounded-[18px] bg-cream-deep px-3.5 py-2.5 text-[13px] text-ink-soft">
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
          <div className="grid grid-cols-1 items-start gap-5 pb-12 md:grid-cols-[1fr_320px]">
            <AnimatedGrid className="flex flex-col gap-3">
              {items.map((item) => (
                <AnimatedGridItem key={item.productId}>
                  <div className="flex items-center gap-3.5 rounded-[26px] border border-line bg-surface p-3.5 shadow-[var(--shadow-xs)]">
                    <Link
                      to={`/produk/${item.product.slug}`}
                      className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[16px] bg-cream-deep"
                    >
                      <SafeImage src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/produk/${item.product.slug}`} className="block text-[13.5px] font-semibold text-ink line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="mt-1 font-mono text-[13px] font-bold text-brand-dark">{formatRupiah(item.product.price)}</p>
                      <div className="mt-2 flex items-center gap-3.5">
                        <div className="flex items-center overflow-hidden rounded-lg border border-line">
                          <Button
                            variant="subtle"
                            size="sm"
                            icon="mdi:minus"
                            onClick={() => setQty(item.productId, item.qty - 1)}
                            aria-label="Kurangi jumlah"
                            className="h-[26px]! w-[26px]! rounded-none! border-none! p-0!"
                          />
                          <span className="w-[30px] text-center text-[13px] font-bold text-ink">{item.qty}</span>
                          <Button
                            variant="subtle"
                            size="sm"
                            icon="mdi:plus"
                            onClick={() => setQty(item.productId, Math.min(item.product.stock, item.qty + 1))}
                            aria-label="Tambah jumlah"
                            className="h-[26px]! w-[26px]! rounded-none! border-none! p-0!"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          icon="mdi:trash-can-outline"
                          onClick={() => handleRemove(item.productId, item.product.name)}
                          className="h-auto! w-auto! gap-1 border-none! p-0! text-xs text-warn! hover:bg-transparent! hover:underline"
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                    <p className="flex-shrink-0 font-mono text-[13.5px] font-bold text-ink">{formatRupiah(item.lineTotal)}</p>
                  </div>
                </AnimatedGridItem>
              ))}
            </AnimatedGrid>

            <FadeIn delay={0.1} className="sticky top-[90px] rounded-[28px] border border-line bg-surface p-5 shadow-[var(--shadow-sm)]">
              <p className="mb-3 font-display text-[15px] font-bold text-ink">Ringkasan Belanja</p>
              <div className="flex justify-between py-1.5 text-[13.5px] text-ink-soft">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <p className="mt-1.5 text-[11.5px] text-muted">Ongkos kirim dihitung di halaman checkout.</p>
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
