import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { getOrderById } from "@/data/orders";
import { formatRupiah } from "@/data/products";

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div>
        <Navbar />
        <div className="container not-found-box">
          <Icon icon="mdi:receipt-text-remove-outline" width={64} style={{ color: "var(--line)" }} />
          <p className="title">Pesanan Tidak Ditemukan</p>
          <Link to="/" className="btn-clear mt-4 inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="order-success">
          <Icon icon="mdi:check-decagram" width={64} style={{ color: "var(--ok)" }} />
          <p className="title">Pesanan Berhasil Dibuat!</p>
          <p className="desc">
            Nomor pesanan kamu: <span className="order-id">{order.id}</span>
          </p>
          <p className="desc">Status: {order.status} (simulasi, belum ada pembayaran nyata)</p>

          <div className="order-summary-card">
            <p className="checkout-card-title">Ringkasan Pesanan</p>
            {order.items.map((i) => (
              <div key={i.productId} className="cart-summary-row small">
                <span>
                  {i.name} x{i.qty}
                </span>
                <span>{formatRupiah(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="cart-summary-divider" />
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row total">
              <span>Total Bayar</span>
              <span>{formatRupiah(order.total)}</span>
            </div>

            <div className="cart-summary-divider" />
            <p className="checkout-card-title">Alamat Pengiriman</p>
            <p className="order-address">
              {order.address.name} — {order.address.phone}
              <br />
              {order.address.fullAddress}, {order.address.city} {order.address.postalCode}
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Link to="/" className="btn-outline-lg">
              Kembali ke Beranda
            </Link>
            <Link to="/akun/pesanan" className="btn-solid-lg">
              Lihat Pesanan Saya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
