import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import { EASE_POP } from "@/lib/motion";
import logoLpks from "../assets/img/logo-lpks.png";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinkClass } from "@/components/navLinkClass";
import { formatRupiah } from "@/data/products";
import Logo from "./Logo";
import SafeImage from "@/components/SafeImage";

const dropdownMotion = {
  initial: { opacity: 0, scale: 0.96, y: -6 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -4 },
  transition: { duration: 0.18, ease: EASE_POP },
};

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

  const handleLogout = async () => {
    setMenuOpen(false);

    const result = await Swal.fire({
      title: "Keluar dari akun?",
      text: "Kamu perlu masuk lagi untuk mengakses akunmu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "var(--brand)",
      cancelButtonColor: "var(--muted)",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      logout();
      navigate("/");
      Swal.fire({
        title: "Berhasil Keluar",
        text: "Sampai jumpa lagi!",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-line/70 bg-white/70 backdrop-blur-2xl saturate-150 transition-colors duration-200 dark:bg-[#111214]/70">
      <div className="container py-3">
        <div className="flex flex-wrap items-center justify-between gap-y-3 md:gap-[18px]">
          <Link to="/" className="order-1 flex-shrink-0" onClick={() => setOpen(false)}>
            <div className="hidden md:block">
              <Logo />
            </div>
            <img
              src={logoLpks}
              alt="Logo LPKS"
              className="block h-9 w-auto object-contain md:hidden"
            />
          </Link>

          <div className="order-3 flex w-full min-w-0 items-center gap-2 rounded-full border border-line bg-[#f5f5f7] px-[18px] py-1.5 pr-1.5 transition-all duration-200 focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand/15 md:order-2 md:flex-1 dark:bg-[#1a1a1d]">
            <Icon icon="mdi:magnify" width={19} className="flex-shrink-0 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Cari alat, sparepart..."
              className="h-9 flex-1 min-w-0 border-none bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={submitSearch}
              className="h-9! flex-shrink-0 px-4! md:px-5!"
            >
              Cari
            </Button>
          </div>

          <div className="order-2 flex flex-shrink-0 items-center gap-3 sm:gap-3.5 md:order-3">
            <ThemeToggle className="hidden cursor-pointer sm:flex" />

            <Link
              to="/akun/profil?tab=wishlist"
              className="relative flex text-ink-soft transition-colors hover:text-ink"
              aria-label="Wishlist"
            >
              <Icon icon="mdi:heart-outline" width={23} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-1.5 min-w-[16px] rounded-full bg-brand px-1 text-center text-[10px] font-bold text-white animate-[modalIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <div
              className="relative"
              onMouseEnter={openCartDropdown}
              onMouseLeave={scheduleCloseCartDropdown}
            >
              <Link to="/keranjang" className="relative flex text-ink-soft" aria-label="Keranjang">
                <Icon icon="mdi:cart-outline" width={24} />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-1.5 min-w-[16px] rounded-full bg-brand px-1 text-center text-[10px] font-bold text-white animate-[modalIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                    {totalItems}
                  </span>
                )}
              </Link>

              <AnimatePresence>
                {cartOpen && (
                  <>
                    <div className="absolute right-0 top-full h-3.5 w-[300px]" />
                    <motion.div
                      {...dropdownMotion}
                      style={{ willChange: "opacity, transform" }}
                      className="absolute right-[-50px] top-[calc(100%+14px)] z-[80] w-[85vw] max-w-[340px] origin-top-right overflow-hidden rounded-[24px] border border-line bg-surface shadow-[var(--shadow-md)] sm:-right-2.5 sm:w-[340px]"
                    >
                      <div className="flex items-center justify-between border-b border-line px-[18px] py-3.5">
                        <span className="font-display text-[14.5px] font-extrabold text-ink">
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
                        <div className="flex flex-col items-center px-6 pb-8 pt-7 text-center">
                          <p className="mt-4 font-display text-[14.5px] font-extrabold text-ink">
                            Wah, keranjang belanjamu kosong
                          </p>
                          <p className="mt-1 text-[12.5px] text-muted">
                            Yuk, isi dengan barang-barang impianmu!
                          </p>
                          <ButtonLink
                            to="/"
                            variant="outline"
                            onClick={() => setCartOpen(false)}
                            className="mt-[1.1rem]"
                          >
                            Mulai Belanja
                          </ButtonLink>
                        </div>
                      ) : (
                        <>
                          <div className="flex max-h-[300px] flex-col overflow-y-auto">
                            {items.map((item) => (
                              <div
                                key={item.productId}
                                className="flex gap-2.5 border-b border-line px-[18px] py-3 last:border-b-0"
                              >
                                <Link
                                  to={`/produk/${item.product.slug}`}
                                  className="relative h-[52px] w-[52px] flex-shrink-0 overflow-hidden rounded-xl bg-cream-deep"
                                  onClick={() => setCartOpen(false)}
                                >
                                  <SafeImage
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </Link>
                                <div className="min-w-0 flex-1">
                                  <Link
                                    to={`/produk/${item.product.slug}`}
                                    className="block text-[12.75px] font-semibold text-ink line-clamp-1"
                                    onClick={() => setCartOpen(false)}
                                  >
                                    {item.product.name}
                                  </Link>
                                  <div className="mt-[3px] flex items-baseline gap-1.5 text-xs">
                                    <span className="font-mono font-bold text-brand-dark">
                                      {item.qty} x {formatRupiah(item.product.price)}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center overflow-hidden rounded-lg border border-line">
                                      <Button
                                        variant="subtle"
                                        size="sm"
                                        icon="mdi:minus"
                                        onClick={() => setQty(item.productId, item.qty - 1)}
                                        aria-label="Kurangi jumlah"
                                        className="h-[26px]! w-[26px]! rounded-none! border-none! p-0! hover:bg-brand-tint! hover:text-brand!"
                                      />
                                      <span className="w-[30px] text-center text-[13px] font-bold text-ink">{item.qty}</span>
                                      <Button
                                        variant="subtle"
                                        size="sm"
                                        icon="mdi:plus"
                                        onClick={() =>
                                          setQty(
                                            item.productId,
                                            Math.min(item.product.stock, item.qty + 1)
                                          )
                                        }
                                        aria-label="Tambah jumlah"
                                        className="h-[26px]! w-[26px]! rounded-none! border-none! p-0! hover:bg-brand-tint! hover:text-brand!"
                                      />
                                    </div>
                                    <span className="text-[11px] text-muted">Stok: {item.product.stock}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-line px-[18px] pb-4 pt-3.5">
                            <div className="mb-2.5 flex items-center justify-between text-[13px] text-ink-soft">
                              <span>Subtotal</span>
                              <span className="font-mono text-[14.5px] font-extrabold text-ink">
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
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="relative" ref={menuRef}>
                <Button
                  variant="ghost"
                  icon="mdi:account-circle-outline"
                  iconRight="mdi:chevron-down"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-auto! border-none! px-0! text-[13.5px]"
                >
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                </Button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      {...dropdownMotion}
                      style={{ willChange: "opacity, transform" }}
                      className="absolute right-0 top-[calc(100%+8px)] z-[60] min-w-[180px] origin-top-right overflow-hidden rounded-[20px] border border-line bg-surface shadow-[var(--shadow-md)]"
                    >
                      <Link
                        to="/akun/profil"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13.5px] text-ink transition-colors duration-200 hover:bg-cream-deep"
                      >
                        <Icon icon="mdi:account-outline" width={17} /> Profil Saya
                      </Link>
                      <Link
                        to="/akun/profil?tab=pesanan"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13.5px] text-ink transition-colors duration-200 hover:bg-cream-deep"
                      >
                        <Icon icon="mdi:receipt-text-outline" width={17} /> Pesanan Saya
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 border-none bg-transparent px-3.5 py-2.5 text-left text-[13.5px] text-ink transition-colors duration-200 hover:bg-cream-deep"
                      >
                        <Icon icon="mdi:logout" width={17} /> Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ButtonLink
                  to="/masuk"
                  variant="outline"
                  size="sm"
                  className="hidden border-brand! text-brand! hover:bg-brand-tint! sm:inline-flex"
                >
                  Masuk
                </ButtonLink>
                <ButtonLink to="/daftar" variant="primary" size="sm" className="px-3! md:px-4!">
                  Daftar
                </ButtonLink>
              </div>
            )}

            <Button
              variant="ghost"
              icon={open ? "mdi:close" : "mdi:menu"}
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
              className="ml-1 h-auto! w-auto! border-none! px-0! py-0! text-2xl text-ink md:hidden! [&_svg]:h-6 [&_svg]:w-6"
            />
          </div>
        </div>

        <ul
          className={`${
            open ? "flex animate-fade-slide-down" : "hidden"
          } m-0 mt-4 list-none items-start gap-2 p-0 md:mt-2 md:flex md:flex-row md:items-center md:gap-6`}
        >
          <li>
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink to="/kategori" className={navLinkClass} onClick={() => setOpen(false)}>
              Catalog
            </NavLink>
          </li>
          <li className="mt-2 w-full border-t border-line pt-2 sm:hidden">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}