import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { getOrderById } from "@/data/orders";
import { formatRupiah } from "@/data/products";

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold whitespace-nowrap transition-colors";

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div>
        <Navbar />
        <div className="container px-6 py-12 text-center">
          <Icon icon="mdi:receipt-text-remove-outline" width={64} className="mx-auto text-line" />
          <p className="mt-4 font-display text-[1.1rem] font-bold text-ink">Pesanan Tidak Ditemukan</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full border border-brand bg-white px-6 py-2 text-[13px] font-semibold text-brand transition-colors hover:bg-brand-tint"
          >
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
        <div className="mx-auto flex max-w-[480px] flex-col items-center py-12 text-center">
          <Icon icon="mdi:check-decagram" width={64} className="text-ok" />
          <p className="mt-2.5 font-display text-[1.4rem] font-extrabold text-ink">Pesanan Berhasil Dibuat!</p>
          <p className="mt-1 text-[13.5px] text-muted">
            Nomor pesanan kamu: <span className="font-mono font-bold text-brand-dark">{order.id}</span>
          </p>
          <p className="text-[13.5px] text-muted">Status: {order.status} (simulasi, belum ada pembayaran nyata)</p>

          <div className="mt-6 w-full rounded-2xl border border-line bg-white p-5 text-left">
            <p className="mb-3 font-display text-[14.5px] font-bold text-ink">Ringkasan Pesanan</p>
            {order.items.map((i) => (
              <div key={i.productId} className="flex justify-between py-1.5 text-xs text-muted">
                <span>
                  {i.name} x{i.qty}
                </span>
                <span>{formatRupiah(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="my-2 h-px bg-line" />
            <div className="flex justify-between py-1.5 text-[13.5px] text-ink-soft">
              <span>Subtotal</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1.5 text-[13.5px] text-ink-soft">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="my-2 h-px bg-line" />
            <div className="flex justify-between py-1.5 text-[15px] font-extrabold text-ink">
              <span>Total Bayar</span>
              <span>{formatRupiah(order.total)}</span>
            </div>

            <div className="my-2 h-px bg-line" />
            <p className="mb-3 font-display text-[14.5px] font-bold text-ink">Alamat Pengiriman</p>
            <p className="text-[13px] leading-relaxed text-ink-soft">
              {order.address.name} — {order.address.phone}
              <br />
              {order.address.fullAddress}, {order.address.city} {order.address.postalCode}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link to="/" className={`${BTN_BASE} border-[1.5px] border-brand bg-white text-brand hover:bg-brand-tint`}>
              Kembali ke Beranda
            </Link>
            <Link to="/akun/pesanan" className={`${BTN_BASE} bg-brand text-white hover:bg-brand-dark`}>
              Lihat Pesanan Saya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
