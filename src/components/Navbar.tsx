import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "../assets/img/logo-lpks.png";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinkClass } from "@/components/navLinkClass";
import { formatRupiah } from "@/data/products";
import Logo from "./Logo";

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
    <nav className="bg-cream border-b border-line sticky top-0 z-50 transition-colors">
      <div className="container py-3">
        {/* Bungkus utama dibuat flex-wrap agar search bar bisa turun ke bawah di mode mobile */}
        <div className="flex flex-wrap items-center justify-between gap-y-3 md:gap-[18px]">
          
          {/* LOGO - Urutan 1 */}
          <Link to="/" className="flex-shrink-0 order-1" onClick={() => setOpen(false)}>
            {/* Tampil di Desktop, Sembunyi di Mobile */}
            <div className="hidden md:block">
              <Logo />
            </div>
            {/* Tampil di Mobile, Sembunyi di Desktop */}
            <img 
              src={logoLpks} 
              alt="Logo LPKS" 
              className="block md:hidden h-9 w-auto object-contain" 
            />
          </Link>

          {/* SEARCH BAR - Turun ke baris baru (full width) di mobile, flex-1 di desktop - Urutan 3 (Mobile) / 2 (Desktop) */}
          <div className="w-full order-3 md:order-2 md:flex-1 flex items-center gap-2 bg-surface border border-line rounded-full py-1.5 pr-1.5 pl-[18px] min-w-0 transition-colors duration-200">
            <Icon icon="mdi:magnify" width={19} className="text-muted flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Cari alat, sparepart..."
              className="flex-1 min-w-0 border-none outline-none bg-transparent text-sm h-9 text-ink placeholder:text-muted transition-colors duration-200"
            />
            <button
              onClick={submitSearch}
              className="flex-shrink-0 rounded-full px-4 md:px-5 h-9 font-bold text-[13px] bg-brand text-white cursor-pointer whitespace-nowrap hover:bg-brand-dark transition-colors"
            >
              Cari
            </button>
          </div>

          {/* ICONS & MENU TOGGLE - Urutan 2 (Mobile) / 3 (Desktop) */}
          <div className="order-2 md:order-3 flex items-center gap-3 sm:gap-3.5 flex-shrink-0">
            <ThemeToggle className="hidden sm:flex" />

            <Link
              to="/akun/profil?tab=wishlist"
              className="relative text-ink-soft flex"
              aria-label="Wishlist"
            >
              <Icon icon="mdi:heart-outline" width={23} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[10px] font-bold rounded-full px-1 min-w-[16px] text-center transition-colors duration-200">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <div
              className="relative"
              onMouseEnter={openCartDropdown}
              onMouseLeave={scheduleCloseCartDropdown}
            >
              <Link to="/keranjang" className="relative text-ink-soft flex" aria-label="Keranjang">
                <Icon icon="mdi:cart-outline" width={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[10px] font-bold rounded-full px-1 min-w-[16px] text-center transition-colors duration-200">
                    {totalItems}
                  </span>
                )}
              </Link>

              {cartOpen && (
                <>
                  <div className="absolute top-full right-0 w-[300px] h-3.5" />
                  {/* Responsif pada lebar dropdown keranjang agar tidak off-screen di mobile */}
                  <div className="absolute top-[calc(100%+14px)] right-[-50px] sm:-right-2.5 w-[85vw] sm:w-[340px] max-w-[340px] bg-surface border border-line rounded-2xl shadow-xl z-[80] overflow-hidden transition-colors duration-200">
                    <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-line transition-colors duration-200">
                      <span className="font-display font-extrabold text-[14.5px] text-ink">
                        Keranjang{totalItems > 0 ? ` (${totalItems})` : ""}
                      </span>
                      {items.length > 0 && (
                        <Link
                          to="/keranjang"
                          className="text-[12.5px] font-bold text-brand hover:underline"
                          onClick={() => setCartOpen(false)}
                        >
                          Lihat
                        </Link>
                      )}
                    </div>

                    {items.length === 0 ? (
                      <div className="flex flex-col items-center text-center px-6 pt-7 pb-8">
                        {/* Placeholder keranjang kosong (SVG dihilangkan agar ringkas, gunakan SVG Anda yang sebelumnya) */}
                        <p className="font-display font-extrabold text-[14.5px] text-ink mt-4">
                          Wah, keranjang belanjamu kosong
                        </p>
                        <p className="text-[12.5px] text-muted mt-1">
                          Yuk, isi dengan barang-barang impianmu!
                        </p>
                        <Link to="/" onClick={() => setCartOpen(false)} className="mt-[1.1rem]">
                          <Button variant="outline">Mulai Belanja</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-[300px] overflow-y-auto flex flex-col">
                          {items.map((item) => (
                            <div key={item.productId} className="flex gap-2.5 px-[18px] py-3 border-b border-line last:border-b-0 transition-colors duration-200">
                              <Link
                                to={`/produk/${item.product.slug}`}
                                className="relative w-[52px] h-[52px] rounded-lg overflow-hidden flex-shrink-0 bg-cream-deep transition-colors duration-200"
                                onClick={() => setCartOpen(false)}
                              >
                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/produk/${item.product.slug}`}
                                  className="block text-[12.75px] font-semibold text-ink line-clamp-1"
                                  onClick={() => setCartOpen(false)}
                                >
                                  {item.product.name}
                                </Link>
                                <div className="flex items-baseline gap-1.5 mt-[3px] text-xs">
                                  <span className="font-mono font-bold text-brand-dark">
                                    {item.qty} x {formatRupiah(item.product.price)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center border border-line rounded-lg overflow-hidden transition-colors duration-200">
                                    <button
                                      className="w-[26px] h-[26px] bg-cream-deep border-none flex items-center justify-center cursor-pointer text-ink transition-colors duration-200"
                                      onClick={() => setQty(item.productId, item.qty - 1)}
                                    >
                                      <Icon icon="mdi:minus" width={14} />
                                    </button>
                                    <span className="w-[30px] text-center font-bold text-[13px] text-ink">{item.qty}</span>
                                    <button
                                      className="w-[26px] h-[26px] bg-cream-deep border-none flex items-center justify-center cursor-pointer text-ink transition-colors duration-200"
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
                                  <span className="text-[11px] text-muted">
                                    Stok: {item.product.stock}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="px-[18px] pt-3.5 pb-4 border-t border-line transition-colors duration-200">
                          <div className="flex justify-between items-center text-[13px] text-ink-soft mb-2.5">
                            <span>Subtotal</span>
                            <span className="font-mono font-extrabold text-[14.5px] text-ink">
                              {formatRupiah(subtotal)}
                            </span>
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
              <div className="relative" ref={menuRef}>
                <button
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-[13.5px] font-semibold text-ink-soft transition-colors duration-200"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <Icon icon="mdi:account-circle-outline" width={22} />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                  <Icon icon="mdi:chevron-down" width={16} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] bg-surface border border-line rounded-xl shadow-lg min-w-[180px] overflow-hidden z-[60] transition-colors duration-200">
                    <Link
                      to="/akun/profil"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 text-[13.5px] text-ink hover:bg-cream-deep transition-colors duration-200"
                    >
                      <Icon icon="mdi:account-outline" width={17} /> Profil Saya
                    </Link>
                    <Link
                      to="/akun/profil?tab=pesanan"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 text-[13.5px] text-ink hover:bg-cream-deep transition-colors duration-200"
                    >
                      <Icon icon="mdi:receipt-text-outline" width={17} /> Pesanan Saya
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                      className="flex items-center gap-2 w-full text-left px-3.5 py-2.5 text-[13.5px] bg-transparent border-none cursor-pointer text-ink hover:bg-cream-deep transition-colors duration-200"
                    >
                      <Icon icon="mdi:logout" width={17} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Link
                  to="/masuk"
                  className="hidden sm:block border border-brand text-brand text-[13px] font-semibold rounded-full px-4 py-1.5 whitespace-nowrap hover:bg-brand-tint transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/daftar"
                  className="bg-brand text-white text-[13px] font-semibold rounded-full px-3 md:px-4 py-1.5 whitespace-nowrap hover:bg-brand-dark transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}

            <button
              className="md:hidden text-2xl text-ink bg-transparent border-none cursor-pointer ml-1 transition-colors duration-200"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              <Icon icon={open ? "mdi:close" : "mdi:menu"} />
            </button>
          </div>
        </div>

        <ul
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-2 md:gap-6 list-none m-0 mt-4 md:mt-2 p-0 items-start md:items-center`}
        >
          <li>
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink to="/kategori" className={navLinkClass} onClick={() => setOpen(false)}>
              Kategori
            </NavLink>
          </li>
          <li className="sm:hidden mt-2 border-t border-line pt-2 w-full transition-colors duration-200">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}