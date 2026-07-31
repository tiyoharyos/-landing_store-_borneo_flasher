import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "../assets/img/logo-lpks.png";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/data/products";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, subtotal, totalItems, setQty } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const menuRef = useRef<HTMLDivElement>(null);
  const cartCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submitSearch = () => {
    const q = query.trim();
    navigate(q ? `/kategori?cari=${encodeURIComponent(q)}` : "/kategori");
    setOpen(false);
  };

  const openCartDropdown = () => {
    if (cartCloseTimer.current) clearTimeout(cartCloseTimer.current);
    setCartOpen(true);
  };

  const scheduleCloseCartDropdown = () => {
    cartCloseTimer.current = setTimeout(() => setCartOpen(false), 150);
  };

  return (
    <nav className="site-navbar">
      <div className="container navbar-row">
        <div className="navbar-top">
          <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
            <img src={logoLpks} alt="Borneo Flasher Store" className="h-10 w-auto" />
          </Link>

          <div className="navbar-search">
            <Icon icon="mdi:magnify" width={19} style={{ color: "var(--muted)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Cari alat, sparepart, atau merchandise..."
            />
            <button onClick={submitSearch} className="navbar-search-btn">
              Cari
            </button>
          </div>

          <div className="navbar-actions">
            <Link to="/akun/profil?tab=wishlist" className="navbar-cart" aria-label="Wishlist">
              <Icon icon="mdi:heart-outline" width={23} />
              {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
            </Link>

            <div
              className="navbar-cart-wrap"
              onMouseEnter={openCartDropdown}
              onMouseLeave={scheduleCloseCartDropdown}
            >
              <Link to="/keranjang" className="navbar-cart" aria-label="Keranjang">
                <Icon icon="mdi:cart-outline" width={24} />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>

              {cartOpen && (
                <>
                  <div className="cart-dropdown-bridge" />
                  <div className="cart-dropdown">
                    <div className="cart-dropdown-header">
                      <span className="title">
                        Keranjang{totalItems > 0 ? ` (${totalItems})` : ""}
                      </span>
                      {items.length > 0 && (
                        <Link
                          to="/keranjang"
                          className="see-all"
                          onClick={() => setCartOpen(false)}
                        >
                          Lihat
                        </Link>
                      )}
                    </div>

                    {items.length === 0 ? (
                      <div className="cart-dropdown-empty">
                        <svg
                          className="illu"
                          viewBox="0 0 140 140"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="70" cy="70" r="68" fill="var(--brand-tint)" />
                          <g transform="translate(30, 40)">
                            <path
                              d="M8 20 L72 20 L64 62 C63 66 60 68 56 68 L24 68 C20 68 17 66 16 62 Z"
                              fill="var(--amber)"
                            />
                            <path
                              d="M4 18 H76"
                              stroke="var(--brand-dark)"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            <path
                              d="M22 18 C22 4 30 -4 40 -4 C50 -4 58 4 58 18"
                              stroke="var(--brand-dark)"
                              strokeWidth="4"
                              fill="none"
                              strokeLinecap="round"
                            />
                            <line x1="24" y1="28" x2="20" y2="58" stroke="var(--brand-dark)" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
                            <line x1="40" y1="28" x2="40" y2="58" stroke="var(--brand-dark)" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
                            <line x1="56" y1="28" x2="60" y2="58" stroke="var(--brand-dark)" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
                          </g>
                          <g stroke="var(--amber-dark)" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M108 32 l5 5 M113 32 l-5 5" />
                            <path d="M22 100 l4 4 M26 100 l-4 4" />
                          </g>
                        </svg>
                        <p className="title">Wah, keranjang belanjamu kosong</p>
                        <p className="desc">Yuk, isi dengan barang-barang impianmu!</p>
                        <Link to="/" onClick={() => setCartOpen(false)}>
                          <Button variant="outline">Mulai Belanja</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="cart-dropdown-list">
                          {items.map((item) => (
                            <div key={item.productId} className="cart-dropdown-item">
                              <Link
                                to={`/produk/${item.product.slug}`}
                                className="cart-dropdown-item-img"
                                onClick={() => setCartOpen(false)}
                              >
                                <img src={item.product.image} alt={item.product.name} />
                              </Link>
                              <div className="cart-dropdown-item-body">
                                <Link
                                  to={`/produk/${item.product.slug}`}
                                  className="cart-dropdown-item-name"
                                  onClick={() => setCartOpen(false)}
                                >
                                  {item.product.name}
                                </Link>
                                <div className="cart-dropdown-item-line">
                                  <span className="qty-x-price">
                                    {item.qty} x {formatRupiah(item.product.price)}
                                  </span>
                                </div>
                                <div className="cart-dropdown-item-controls">
                                  <div className="qty-control sm">
                                    <button
                                      onClick={() => setQty(item.productId, item.qty - 1)}
                                    >
                                      <Icon icon="mdi:minus" width={14} />
                                    </button>
                                    <span>{item.qty}</span>
                                    <button
                                      onClick={() =>
                                        setQty(
                                          item.productId,
                                          Math.min(item.product.stock, item.qty + 1)
                                        )
                                      }
                                    >
                                      <Icon icon="mdi:plus" width={14} />
                                    </button>
                                  </div>
                                  <span className="cart-dropdown-stock">
                                    Stok: {item.product.stock}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="cart-dropdown-footer">
                          <div className="cart-dropdown-subtotal-row">
                            <span>Subtotal</span>
                            <span className="value">{formatRupiah(subtotal)}</span>
                          </div>
                          <Button
                            variant="primary"
                            fullWidth
                            onClick={() => {
                              setCartOpen(false);
                              navigate(user ? "/checkout" : "/masuk?next=/checkout");
                            }}
                          >
                            Checkout
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {user ? (
              <div className="navbar-account" ref={menuRef}>
                <button className="navbar-account-btn" onClick={() => setMenuOpen((v) => !v)}>
                  <Icon icon="mdi:account-circle-outline" width={22} />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                  <Icon icon="mdi:chevron-down" width={16} />
                </button>
                {menuOpen && (
                  <div className="navbar-account-dropdown">
                    <Link to="/akun/profil" onClick={() => setMenuOpen(false)}>
                      <Icon icon="mdi:account-outline" width={17} /> Profil Saya
                    </Link>
                    <Link to="/akun/profil?tab=pesanan" onClick={() => setMenuOpen(false)}>
                      <Icon icon="mdi:receipt-text-outline" width={17} /> Pesanan Saya
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                    >
                      <Icon icon="mdi:logout" width={17} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar-auth-links">
                <Link to="/masuk" className="btn-outline-sm">
                  Masuk
                </Link>
                <Link to="/daftar" className="btn-solid-sm">
                  Daftar
                </Link>
              </div>
            )}

            <button
              className="md:hidden text-2xl navbar-burger"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              <Icon icon={open ? "mdi:close" : "mdi:menu"} />
            </button>
          </div>
        </div>

        <ul className={`navbar-menu ${open ? "flex" : ""}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink to="/kategori" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              Kategori
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}