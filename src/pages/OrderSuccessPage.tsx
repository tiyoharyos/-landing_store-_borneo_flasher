import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { getOrderById } from "@/data/orders";
import { formatRupiah } from "@/data/products";
import ButtonLink from "@/components/ui/ButtonLink";
import FadeIn from "@/components/FadeIn";

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div>
        <FadeIn className="container text-center py-12 px-6">
          <Icon icon="mdi:receipt-text-remove-outline" width={64} className="text-line inline-block" />
          <p className="font-display font-bold text-[1.1rem] mt-4">Pesanan Tidak Ditemukan</p>
          <ButtonLink
            to="/"
            variant="outline"
            size="sm"
            className="mt-4 border-brand! text-brand! hover:bg-brand-tint!"
          >
            Kembali ke Beranda
          </ButtonLink>
        </FadeIn>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <div className="max-w-[480px] mx-auto my-12 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Icon icon="mdi:check-decagram" width={64} className="text-ok" />
          </motion.div>
          <FadeIn delay={0.1} className="flex flex-col items-center w-full">
          <p className="font-display font-extrabold text-[1.4rem] mt-2.5 text-ink">Pesanan Berhasil Dibuat!</p>
          <p className="text-muted text-[13.5px] mt-1">
            Nomor pesanan kamu: <span className="font-mono font-bold text-brand-dark">{order.id}</span>
          </p>
          <p className="text-muted text-[13.5px] mt-1">Status: {order.status} (simulasi, belum ada pembayaran nyata)</p>

          <div className="w-full bg-surface border border-line rounded-xl p-5 mt-6 text-left">
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
              {order.address.fullAddress}, {order.address.city}, {order.address.province} {order.address.postalCode}
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <ButtonLink
              to="/"
              variant="outline"
              size="lg"
              className="rounded-xl! border-[1.5px]! border-brand! text-brand! hover:bg-brand-tint!"
            >
              Kembali ke Beranda
            </ButtonLink>
            <ButtonLink to="/akun/profil?tab=pesanan" size="lg" className="rounded-xl!">
              Lihat Pesanan Saya
            </ButtonLink>
          </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
