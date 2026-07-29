import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatRupiah } from "@/data/products";
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
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodKey>("reguler");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>("transfer");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container not-found-box">
          <Icon icon="mdi:cart-off" width={64} style={{ color: "var(--line)" }} />
          <p className="title">Keranjang Kosong</p>
          <p className="desc">Tambahkan produk ke keranjang sebelum checkout.</p>
          <Link to="/" className="btn-clear mt-4 inline-block">
            Kembali Belanja
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = SHIPPING_OPTIONS.find((s) => s.key === shippingMethod)?.cost ?? 0;
  const total = subtotal + shippingCost;

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !fullAddress.trim() || !city.trim() || !postalCode.trim()) {
      setError("Semua kolom alamat wajib diisi.");
      return;
    }
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder(
        items,
        { name, phone, fullAddress, city, postalCode },
        shippingMethod,
        paymentMethod
      );
      clear();
      navigate(`/pesanan/sukses/${order.id}`);
    }, 700);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <p className="section-title mt-6 mb-4">Checkout</p>

        <div className="checkout-layout">
          <div className="checkout-form">
            <div className="checkout-card">
              <p className="checkout-card-title">
                <Icon icon="mdi:map-marker-outline" width={18} /> Alamat Pengiriman
              </p>
              <div className="form-grid">
                <label>
                  Nama Penerima
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
                </label>
                <label>
                  No. HP
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" />
                </label>
                <label className="col-span-2">
                  Alamat Lengkap
                  <textarea
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    rows={3}
                  />
                </label>
                <label>
                  Kota / Kabupaten
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Contoh: Boyolali" />
                </label>
                <label>
                  Kode Pos
                  <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="57316" />
                </label>
              </div>
              {error && <p className="form-error">{error}</p>}
            </div>

            <div className="checkout-card">
              <p className="checkout-card-title">
                <Icon icon="mdi:truck-outline" width={18} /> Metode Pengiriman
              </p>
              <div className="option-list">
                {SHIPPING_OPTIONS.map((opt) => (
                  <label key={opt.key} className={`option-row ${shippingMethod === opt.key ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === opt.key}
                      onChange={() => setShippingMethod(opt.key)}
                    />
                    <div className="option-row-text">
                      <p>{opt.label}</p>
                      <span>Estimasi {opt.eta}</span>
                    </div>
                    <span className="option-row-price">{formatRupiah(opt.cost)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="checkout-card">
              <p className="checkout-card-title">
                <Icon icon="mdi:credit-card-outline" width={18} /> Metode Pembayaran
              </p>
              <div className="option-list">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label key={opt.key} className={`option-row ${paymentMethod === opt.key ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === opt.key}
                      onChange={() => setPaymentMethod(opt.key)}
                    />
                    <div className="option-row-text">
                      <p>{opt.label}</p>
                      <span>{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <p className="cart-summary-title">Ringkasan Pesanan</p>
            {items.map((i) => (
              <div key={i.productId} className="cart-summary-row small">
                <span>
                  {i.product.name} x{i.qty}
                </span>
                <span>{formatRupiah(i.lineTotal)}</span>
              </div>
            ))}
            <div className="cart-summary-divider" />
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(shippingCost)}</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row total">
              <span>Total Bayar</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <button className="btn-solid-lg w-full mt-3" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Memproses..." : "Buat Pesanan"}
            </button>
            <p className="cart-summary-note text-center mt-2">
              Ini adalah simulasi checkout (belum ada pembayaran nyata).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
