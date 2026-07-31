import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getOrders, type Order } from "@/data/orders";
import { formatRupiah } from "@/data/products";
import { toastInfo } from "@/components/ui/alert";

type ProfileTab = "pesanan" | "wishlist" | "biodata";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { items: wishlistItems, totalItems: wishlistCount } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);

  const tabFromUrl = searchParams.get("tab");
  const [tab, setTab] = useState<ProfileTab>(
    tabFromUrl === "wishlist" || tabFromUrl === "pesanan" ? tabFromUrl : "biodata"
  );

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  if (!user) return <Navigate to="/masuk?next=/akun/profil" replace />;

  const changeTab = (next: ProfileTab) => {
    setTab(next);
    setSearchParams(next === "biodata" ? {} : { tab: next }, { replace: true });
  };

  const initial = user.name.trim().charAt(0).toUpperCase() || "U";
  const notifyDemo = () => toastInfo("Fitur ini belum tersedia di versi demo");

  return (
    <div>
      <Navbar />
      <div className="container profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-sidebar-user">
            <div className="profile-avatar">{initial}</div>
            <p className="profile-sidebar-name">{user.name}</p>
            <p className="profile-sidebar-email">{user.email}</p>
          </div>

          <nav className="profile-nav">
            <button
              type="button"
              className={`profile-nav-item ${tab === "pesanan" ? "active" : ""}`}
              onClick={() => changeTab("pesanan")}
            >
              <Icon icon="mdi:receipt-text-outline" width={18} />
              Pesanan Saya
              {orders.length > 0 && <span className="profile-nav-count">{orders.length}</span>}
            </button>

            <button
              type="button"
              className={`profile-nav-item ${tab === "wishlist" ? "active" : ""}`}
              onClick={() => changeTab("wishlist")}
            >
              <Icon icon="mdi:heart-outline" width={18} />
              Wishlist Saya
              {wishlistCount > 0 && <span className="profile-nav-count">{wishlistCount}</span>}
            </button>

            <p className="profile-nav-group">Profil Saya</p>
            <button
              type="button"
              className={`profile-nav-item sub ${tab === "biodata" ? "active" : ""}`}
              onClick={() => changeTab("biodata")}
            >
              Biodata Diri
            </button>

            <button type="button" className="profile-nav-item danger" onClick={logout}>
              <Icon icon="mdi:logout" width={18} />
              Keluar
            </button>
          </nav>
        </aside>

        <section className="profile-content">
          <div className="profile-tabs">
            <button
              type="button"
              className={`profile-tab ${tab === "pesanan" ? "active" : ""}`}
              onClick={() => changeTab("pesanan")}
            >
              Pesanan Saya{orders.length > 0 ? ` (${orders.length})` : ""}
            </button>
            <button
              type="button"
              className={`profile-tab ${tab === "wishlist" ? "active" : ""}`}
              onClick={() => changeTab("wishlist")}
            >
              Wishlist Saya{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </button>
            <button
              type="button"
              className={`profile-tab ${tab === "biodata" ? "active" : ""}`}
              onClick={() => changeTab("biodata")}
            >
              Biodata Diri
            </button>
          </div>

          {tab === "pesanan" && (
            <div className="profile-orders">
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
          )}

          {tab === "biodata" && (
            <div className="profile-biodata">
              <p className="profile-section-title">Ubah Biodata Diri</p>

              <div className="profile-row">
                <span className="label">Nama</span>
                <span className="value">{user.name}</span>
                <button type="button" className="profile-edit-link" onClick={notifyDemo}>
                  Ubah
                </button>
              </div>

              <div className="profile-row">
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
                <span className="badge badge-open">Terverifikasi</span>
              </div>

              <div className="profile-row">
                <span className="label">Nomor HP</span>
                <span className="value muted">Belum ditambahkan</span>
                <button type="button" className="profile-edit-link" onClick={notifyDemo}>
                  Tambah
                </button>
              </div>
              <div className="profile-row">
                <span className="label">Alamat</span>
                <span className="value muted">Belum ditambahkan</span>
                <button type="button" className="profile-edit-link" onClick={notifyDemo}>
                  Tambah
                </button>
              </div>
            </div>
            
          )}

          {tab === "wishlist" && (
            <div className="profile-wishlist">
              {wishlistItems.length === 0 ? (
                <div className="not-found-box">
                  <Icon icon="mdi:heart-outline" width={64} style={{ color: "var(--line)" }} />
                  <p className="title">Wishlist Kamu Masih Kosong</p>
                  <p className="desc">
                    Simpan produk favoritmu dengan tap ikon hati pada produk.
                  </p>
                  <Link to="/" className="btn-clear mt-4 inline-block">
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                <div className="product-grid">
                  {wishlistItems.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
