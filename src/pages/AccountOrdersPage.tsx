import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { getOrders, type Order } from "@/data/orders";
import { formatRupiah } from "@/data/products";

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  if (!user) return <Navigate to="/masuk?next=/akun/pesanan" replace />;

  return (
    <div>
      <Navbar />
      <div className="container">
        <p className="mt-6 mb-4 font-display text-[1.1rem] font-extrabold text-ink">Pesanan Saya</p>

        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Icon icon="mdi:receipt-text-outline" width={64} className="mx-auto text-line" />
            <p className="mt-4 font-display text-[1.1rem] font-bold text-ink">Belum Ada Pesanan</p>
            <p className="mt-1 text-sm text-muted">Pesanan yang kamu buat akan muncul di sini.</p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-full border border-brand bg-white px-6 py-2 text-[13px] font-semibold text-brand transition-colors hover:bg-brand-tint"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-12">
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-line bg-white px-5 py-[1.1rem]">
                <div className="mb-2.5 flex items-center justify-between border-b border-line pb-2.5">
                  <div>
                    <p className="font-mono font-bold text-brand-dark">{o.id}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(o.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-[5px] rounded-full bg-amber/15 px-[0.85em] py-[0.35em] text-[0.72rem] font-bold whitespace-nowrap text-amber-dark">
                    {o.status}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {o.items.map((i) => (
                    <div key={i.productId} className="flex items-center gap-2.5 text-[13px]">
                      <img src={i.image} alt={i.name} className="h-9 w-9 rounded-lg bg-cream-deep object-cover" />
                      <span className="flex-1">
                        {i.name} x{i.qty}
                      </span>
                      <span>{formatRupiah(i.price * i.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 flex justify-between border-t border-line pt-2.5 text-[13.5px] font-bold">
                  <span>Total Bayar</span>
                  <span className="font-mono text-brand-dark">{formatRupiah(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
