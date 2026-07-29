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
        <p className="section-title mt-6 mb-4">Pesanan Saya</p>

        {orders.length === 0 ? (
          <div className="not-found-box">
            <Icon icon="mdi:receipt-text-outline" width={64} style={{ color: "var(--line)" }} />
            <p className="title">Belum Ada Pesanan</p>
            <p className="desc">Pesanan yang kamu buat akan muncul di sini.</p>
            <Link to="/" className="btn-clear mt-4 inline-block">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((o) => (
              <div key={o.id} className="order-list-item">
                <div className="order-list-header">
                  <div>
                    <p className="order-id">{o.id}</p>
                    <p className="order-date">
                      {new Date(o.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="badge badge-low">{o.status}</span>
                </div>
                <div className="order-list-items">
                  {o.items.map((i) => (
                    <div key={i.productId} className="order-list-line">
                      <img src={i.image} alt={i.name} />
                      <span className="flex-1">
                        {i.name} x{i.qty}
                      </span>
                      <span>{formatRupiah(i.price * i.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-list-footer">
                  <span>Total Bayar</span>
                  <span className="order-list-total">{formatRupiah(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
