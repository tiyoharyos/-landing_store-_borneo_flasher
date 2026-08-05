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
        <div className="container text-center py-12 px-6">
          <Icon icon="mdi:receipt-text-remove-outline" width={64} className="text-line inline-block" />
          <p className="font-display font-bold text-[1.1rem] mt-4">Pesanan Tidak Ditemukan</p>
          <Link
            to="/"
            className="mt-4 inline-block border border-brand text-brand text-[13px] font-semibold rounded-full px-6 py-2 hover:bg-brand-tint transition-colors"
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
        <div className="max-w-[480px] mx-auto my-12 text-center flex flex-col items-center">
          <Icon icon="mdi:check-decagram" width={64} className="text-ok" />
          <p className="font-display font-extrabold text-[1.4rem] mt-2.5 text-ink">Pesanan Berhasil Dibuat!</p>
          <p className="text-muted text-[13.5px] mt-1">
            Nomor pesanan kamu: <span className="font-mono font-bold text-brand-dark">{order.id}</span>
          </p>
          <p className="text-muted text-[13.5px] mt-1">Status: {order.status} (simulasi, belum ada pembayaran nyata)</p>

          <div className="w-full bg-surface border border-line rounded-2xl p-5 mt-6 text-left">
            <p className="flex items-center gap-2 font-display font-bold text-[14.5px] text-ink mb-3">Ringkasan Pesanan</p>
            {order.items.map((i) => (
              <div key={i.productId} className="flex justify-between text-[12.5px] text-muted py-1.5">
                <span>
                  {i.name} x{i.qty}
                </span>
                <span>{formatRupiah(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="h-px bg-line my-2" />
            <div className="flex justify-between text-[13.5px] text-ink-soft py-1.5">
              <span>Subtotal</span>
              <span>{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13.5px] text-ink-soft py-1.5">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(order.shippingCost)}</span>
            </div>
            <div className="h-px bg-line my-2" />
            <div className="flex justify-between text-[15px] font-extrabold text-ink py-1.5">
              <span>Total Bayar</span>
              <span>{formatRupiah(order.total)}</span>
            </div>

            <div className="h-px bg-line my-2" />
            <p className="font-display font-bold text-[14.5px] text-ink mb-2 mt-3">Alamat Pengiriman</p>
            <p className="text-[13px] text-ink-soft leading-relaxed">
              {order.address.name} — {order.address.phone}
              <br />
              {order.address.fullAddress}, {order.address.city} {order.address.postalCode}
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 font-bold text-sm rounded-xl px-6 py-3.5 border-[1.5px] border-brand text-brand hover:bg-brand-tint transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <Link
              to="/akun/profil?tab=pesanan"
              className="inline-flex items-center justify-center gap-2 font-bold text-sm rounded-xl px-6 py-3.5 bg-brand text-white hover:bg-brand-dark transition-colors"
            >
              Lihat Pesanan Saya
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
