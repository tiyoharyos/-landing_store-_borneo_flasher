import { useEffect, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAddresses } from "@/context/AddressContext";
import { formatRupiah } from "@/data/products";
import Button from "@/components/ui/Button";
import AddressListModal from "@/components/address/AddressListModal";
import AddressFormModal from "@/components/address/AddressFormModal";
import { alertWarning } from "@/components/ui/swal";
import { useToast } from "@/components/ui/Toast";
import type { Address } from "@/data/addresses";
import {
  createOrder,
  SHIPPING_OPTIONS,
  PAYMENT_OPTIONS,
  type ShippingMethodKey,
  type PaymentMethodKey,
} from "@/data/orders";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const { addresses, primaryAddress } = useAddresses();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressListOpen, setAddressListOpen] = useState(false);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodKey>("reguler");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>("transfer");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // Pilih otomatis alamat utama begitu daftar alamat termuat, kecuali user
  // sudah memilih alamat lain secara manual.
  useEffect(() => {
    if (!selectedAddress && primaryAddress) setSelectedAddress(primaryAddress);
  }, [primaryAddress, selectedAddress]);

  if (!user) {
    return <Navigate to="/masuk?next=/checkout" replace />;
  }

  if (items.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container text-center py-12 px-6">
          <Icon icon="mdi:cart-off" width={64} className="text-line inline-block" />
          <p className="font-display font-bold text-[1.1rem] mt-4">Keranjang Kosong</p>
          <p className="text-muted text-sm mt-1">Tambahkan produk ke keranjang sebelum checkout.</p>
          <Link to="/" className="inline-block mt-4">
            <Button variant="primary" icon="mdi:storefront-outline">
              Kembali Belanja
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = SHIPPING_OPTIONS.find((s) => s.key === shippingMethod)?.cost ?? 0;
  const total = subtotal + shippingCost;

  const handleSubmit = () => {
    if (!selectedAddress) {
      alertWarning({
        title: "Alamat Belum Dipilih",
        text: "Pilih atau tambahkan alamat pengiriman dulu sebelum membuat pesanan.",
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder(
        items,
        {
          name: selectedAddress.recipientName,
          phone: selectedAddress.phone,
          fullAddress: selectedAddress.fullAddress,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
        },
        shippingMethod,
        paymentMethod,
        user.email
      );
      clear();
      toast.success("Pesanan berhasil dibuat!");
      navigate(`/pesanan/sukses/${order.id}`);
    }, 700);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <p className="font-display font-extrabold text-[1.1rem] text-ink mt-6 mb-4">Checkout</p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 pb-12 items-start">
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-line rounded-2xl p-5">
              <p className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center gap-2 font-display font-bold text-[14.5px] text-ink">
                  <Icon icon="mdi:map-marker-outline" width={18} /> Alamat Pengiriman
                </span>
                {selectedAddress && (
                  <button
                    type="button"
                    className="bg-transparent border-none p-0 text-brand text-[12.5px] font-bold cursor-pointer hover:underline"
                    onClick={() => setAddressListOpen(true)}
                  >
                    Ganti
                  </button>
                )}
              </p>

              {selectedAddress ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-ink-soft bg-cream-deep rounded-full px-2.5 py-1">
                      <Icon icon="mdi:home-outline" width={14} />
                      {selectedAddress.label}
                    </span>
                    <span className="text-[13.5px] font-bold text-ink">{selectedAddress.recipientName}</span>
                  </div>
                  <p className="text-[12.5px] text-ink-soft leading-relaxed">
                    {selectedAddress.fullAddress}, {selectedAddress.city} {selectedAddress.postalCode},{" "}
                    {selectedAddress.phone}
                  </p>
                </div>
              ) : addresses.length > 0 ? (
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 w-full h-11 rounded-xl border-[1.5px] border-dashed border-brand bg-brand-tint text-brand text-[13.5px] font-bold cursor-pointer hover:bg-brand/10 transition-colors"
                  onClick={() => setAddressListOpen(true)}
                >
                  Pilih Alamat Pengiriman
                </button>
              ) : (
                <div className="flex flex-col items-center text-center py-6">
                  <Icon icon="mdi:map-marker-off-outline" width={40} className="text-line" />
                  <p className="text-[13px] text-muted mt-2 mb-3">Kamu belum punya alamat tersimpan.</p>
                  <Button variant="primary" size="sm" icon="mdi:plus" onClick={() => setAddressFormOpen(true)}>
                    Tambah Alamat Baru
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-surface border border-line rounded-2xl p-5">
              <p className="flex items-center gap-2 font-display font-bold text-[14.5px] text-ink mb-3">
                <Icon icon="mdi:truck-outline" width={18} /> Metode Pengiriman
              </p>
              <div className="flex flex-col gap-2">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-center gap-3 border rounded-xl px-3.5 py-2.5 cursor-pointer ${
                      shippingMethod === opt.key ? "border-brand bg-brand-tint" : "border-line"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      className="accent-brand"
                      checked={shippingMethod === opt.key}
                      onChange={() => setShippingMethod(opt.key)}
                    />
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold text-ink">{opt.label}</p>
                      <span className="text-xs text-muted">Estimasi {opt.eta}</span>
                    </div>
                    <span className="font-mono font-bold text-[13px] text-brand-dark">{formatRupiah(opt.cost)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-line rounded-2xl p-5">
              <p className="flex items-center gap-2 font-display font-bold text-[14.5px] text-ink mb-3">
                <Icon icon="mdi:credit-card-outline" width={18} /> Metode Pembayaran
              </p>
              <div className="flex flex-col gap-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-center gap-3 border rounded-xl px-3.5 py-2.5 cursor-pointer ${
                      paymentMethod === opt.key ? "border-brand bg-brand-tint" : "border-line"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="accent-brand"
                      checked={paymentMethod === opt.key}
                      onChange={() => setPaymentMethod(opt.key)}
                    />
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold text-ink">{opt.label}</p>
                      <span className="text-xs text-muted">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-2xl p-5 sticky top-[90px]">
            <p className="font-display font-bold text-[15px] text-ink mb-3">Ringkasan Pesanan</p>
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between text-[12.5px] text-muted py-1.5">
                <span>
                  {i.product.name} x{i.qty}
                </span>
                <span>{formatRupiah(i.lineTotal)}</span>
              </div>
            ))}
            <div className="h-px bg-line my-2" />
            <div className="flex justify-between text-[13.5px] text-ink-soft py-1.5">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13.5px] text-ink-soft py-1.5">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(shippingCost)}</span>
            </div>
            <div className="h-px bg-line my-2" />
            <div className="flex justify-between text-[15px] font-extrabold text-ink py-1.5">
              <span>Total Bayar</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mt-3"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!selectedAddress}
            >
              Buat Pesanan
            </Button>
            <p className="text-[11.5px] text-muted mt-1.5 text-center mt-2">
              Ini adalah simulasi checkout (belum ada pembayaran nyata).
            </p>
          </div>
        </div>
      </div>

      <AddressListModal
        open={addressListOpen}
        onClose={() => setAddressListOpen(false)}
        onPick={(address) => setSelectedAddress(address)}
      />
      <AddressFormModal
        open={addressFormOpen}
        onClose={() => setAddressFormOpen(false)}
        onSaved={(address) => setSelectedAddress(address)}
      />
    </div>
  );
}
