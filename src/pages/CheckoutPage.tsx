import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/data/products";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { FormRow, FormSpan } from "@/components/ui/FormLayout";
import { alertWarning, toastSuccess } from "@/components/ui/alert";
import {
  createOrder,
  SHIPPING_OPTIONS,
  PAYMENT_OPTIONS,
  type ShippingMethodKey,
  type PaymentMethodKey,
} from "@/data/orders";

const CARD = "rounded-2xl border border-line bg-white p-5";
const CARD_TITLE = "mb-3 flex items-center gap-2 font-display text-[14.5px] font-bold text-ink";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodKey>("reguler");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>("transfer");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container px-6 py-12 text-center">
          <Icon icon="mdi:cart-off" width={64} className="mx-auto text-line" />
          <p className="mt-4 font-display text-[1.1rem] font-bold text-ink">Keranjang Kosong</p>
          <p className="mt-1 text-sm text-muted">Tambahkan produk ke keranjang sebelum checkout.</p>
          <Link to="/" className="mt-4 inline-block">
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
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Nama penerima wajib diisi.";
    if (!phone.trim()) errors.phone = "No. HP wajib diisi.";
    if (!fullAddress.trim()) errors.fullAddress = "Alamat lengkap wajib diisi.";
    if (!city.trim()) errors.city = "Kota/kabupaten wajib diisi.";
    if (!postalCode.trim()) errors.postalCode = "Kode pos wajib diisi.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      alertWarning({
        title: "Lengkapi Data Dulu",
        text: "Beberapa kolom alamat pengiriman masih kosong.",
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder(
        items,
        { name, phone, fullAddress, city, postalCode },
        shippingMethod,
        paymentMethod
      );
      clear();
      toastSuccess("Pesanan berhasil dibuat!");
      navigate(`/pesanan/sukses/${order.id}`);
    }, 700);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <p className="mt-6 mb-4 font-display text-[1.1rem] font-extrabold text-ink">Checkout</p>

        <div className="grid grid-cols-1 items-start gap-[22px] pb-12 md:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            <div className={CARD}>
              <p className={CARD_TITLE}>
                <Icon icon="mdi:map-marker-outline" width={18} /> Alamat Pengiriman
              </p>
              <FormRow columns={2}>
                <Input
                  label="Nama Penerima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  error={fieldErrors.name}
                />
                <Input
                  label="No. HP"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  error={fieldErrors.phone}
                />
                <FormSpan>
                  <Textarea
                    label="Alamat Lengkap"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    rows={3}
                    error={fieldErrors.fullAddress}
                  />
                </FormSpan>
                <Input
                  label="Kota / Kabupaten"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Boyolali"
                  error={fieldErrors.city}
                />
                <Input
                  label="Kode Pos"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="57316"
                  error={fieldErrors.postalCode}
                />
              </FormRow>
            </div>

            <div className={CARD}>
              <p className={CARD_TITLE}>
                <Icon icon="mdi:truck-outline" width={18} /> Metode Pengiriman
              </p>
              <div className="flex flex-col gap-2">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 ${
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
                    <span className="font-mono text-[13px] font-bold text-brand-dark">{formatRupiah(opt.cost)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={CARD}>
              <p className={CARD_TITLE}>
                <Icon icon="mdi:credit-card-outline" width={18} /> Metode Pembayaran
              </p>
              <div className="flex flex-col gap-2">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 ${
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

          <div className={`sticky top-[90px] ${CARD}`}>
            <p className="mb-3 font-display text-[15px] font-bold text-ink">Ringkasan Pesanan</p>
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between py-1 text-xs text-muted">
                <span>
                  {i.product.name} x{i.qty}
                </span>
                <span>{formatRupiah(i.lineTotal)}</span>
              </div>
            ))}
            <div className="my-2 h-px bg-line" />
            <div className="flex justify-between py-1 text-[13.5px] text-ink-soft">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 text-[13.5px] text-ink-soft">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(shippingCost)}</span>
            </div>
            <div className="my-2 h-px bg-line" />
            <div className="flex justify-between py-1 text-[15px] font-extrabold text-ink">
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
            >
              Buat Pesanan
            </Button>
            <p className="mt-2 text-center text-[11.5px] text-muted">
              Ini adalah simulasi checkout (belum ada pembayaran nyata).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
