import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "../assets/img/logo-lpks.png";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/data/products";
import { navLinkClass } from "@/components/navLinkClass";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, subtotal, totalItems, setQty } = useCart();
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
    <nav className="sticky top-0 z-50 border-b border-line bg-cream">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-3">
        <div className="flex items-center gap-[18px]">
          <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <img src={logoLpks} alt="Borneo Flasher Store" className="h-10 w-auto" />
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-1.5 pl-[18px]">
            <Icon icon="mdi:magnify" width={19} className="text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Cari alat, sparepart, atau merchandise..."
              className="h-9 min-w-0 flex-1 border-none bg-transparent text-sm outline-none"
            />
            <button
              onClick={submitSearch}
              className="shrink-0 rounded-full bg-brand px-[1.2rem] py-2 text-[13px] font-bold whitespace-nowrap text-white transition-colors hover:bg-brand-dark"
            >
              Cari
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-3.5">
            <div
              className="relative"
              onMouseEnter={openCartDropdown}
              onMouseLeave={scheduleCloseCartDropdown}
            >
              <Link to="/keranjang" className="relative flex text-ink-soft" aria-label="Keranjang">
                <Icon icon="mdi:cart-outline" width={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 rounded-full bg-brand px-[5px] py-px text-center text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              {cartOpen && (
                <>
                  <div className="absolute top-full -right-2.5 h-3.5 w-[340px]" />
                  <div className="absolute top-[calc(100%+14px)] -right-2.5 z-[80] w-[340px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_45px_-12px_rgba(28,22,19,0.28)] [animation:cart-dropdown-in_0.16s_ease]">
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
                      <div className="flex flex-col items-center px-6 pt-7 pb-8 text-center">
                        <svg
                          className="h-[110px] w-[110px]"
                          viewBox="0 0 140 140"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="70" cy="70" r="68" className="fill-brand-tint" />
                          <g transform="translate(30, 40)">
                            <path
                              d="M8 20 L72 20 L64 62 C63 66 60 68 56 68 L24 68 C20 68 17 66 16 62 Z"
                              className="fill-amber"
                            />
                            <path
                              d="M4 18 H76"
                              className="stroke-brand-dark"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            <path
                              d="M22 18 C22 4 30 -4 40 -4 C50 -4 58 4 58 18"
                              className="stroke-brand-dark"
                              strokeWidth="4"
                              fill="none"
                              strokeLinecap="round"
                            />
                            <line x1="24" y1="28" x2="20" y2="58" className="stroke-brand-dark" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
                            <line x1="40" y1="28" x2="40" y2="58" className="stroke-brand-dark" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
                            <line x1="56" y1="28" x2="60" y2="58" className="stroke-brand-dark" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
                          </g>
                          <g className="stroke-amber-dark" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M108 32 l5 5 M113 32 l-5 5" />
                            <path d="M22 100 l4 4 M26 100 l-4 4" />
                          </g>
                        </svg>
                        <p className="mt-4 font-display text-[14.5px] font-extrabold text-ink">Wah, keranjang belanjamu kosong</p>
                        <p className="mt-1 text-[12.5px] text-muted">Yuk, isi dengan barang-barang impianmu!</p>
                        <Link to="/" onClick={() => setCartOpen(false)} className="mt-[1.1rem]">
                          <Button variant="outline">Mulai Belanja</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="flex max-h-[300px] flex-col overflow-y-auto">
                          {items.map((item) => (
                            <div key={item.productId} className="flex gap-2.5 border-b border-line px-[18px] py-3 last:border-b-0">
                              <Link
                                to={`/produk/${item.product.slug}`}
                                className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-cream-deep"
                                onClick={() => setCartOpen(false)}
                              >
                                <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                              </Link>
                              <div className="min-w-0 flex-1">
                                <Link
                                  to={`/produk/${item.product.slug}`}
                                  className="line-clamp-1 text-[12.75px] font-semibold text-ink"
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
                                  <div className="flex items-center overflow-hidden rounded-[10px] border border-line">
                                    <button
                                      className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center border-none bg-cream-deep"
                                      onClick={() => setQty(item.productId, item.qty - 1)}
                                    >
                                      <Icon icon="mdi:minus" width={14} />
                                    </button>
                                    <span className="w-[30px] text-center text-[13px] font-bold">{item.qty}</span>
                                    <button
                                      className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center border-none bg-cream-deep"
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

                        <div className="border-t border-line px-[18px] pt-3.5 pb-4">
                          <div className="mb-2.5 flex items-center justify-between text-[13px] text-ink-soft">
                            <span>Subtotal</span>
                            <span className="font-mono text-[14.5px] font-extrabold text-ink">{formatRupiah(subtotal)}</span>
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
                  className="flex items-center gap-1 border-none bg-transparent text-[13.5px] font-semibold text-ink-soft"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <Icon icon="mdi:account-circle-outline" width={22} />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                  <Icon icon="mdi:chevron-down" width={16} />
                </button>
                {menuOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 z-[60] min-w-[180px] overflow-hidden rounded-xl border border-line bg-white shadow-[0_12px_30px_-10px_rgba(28,22,19,0.25)]">
                    <Link
                      to="/akun/pesanan"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[13.5px] text-ink transition-colors hover:bg-cream-deep"
                    >
                      <Icon icon="mdi:receipt-text-outline" width={17} /> Pesanan Saya
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/");
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 border-none bg-transparent px-3.5 py-2.5 text-left text-[13.5px] text-ink transition-colors hover:bg-cream-deep"
                    >
                      <Icon icon="mdi:logout" width={17} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/masuk"
                  className="rounded-full border border-brand px-4 py-[0.4rem] text-[13px] font-semibold whitespace-nowrap text-brand"
                >
                  Masuk
                </Link>
                <Link
                  to="/daftar"
                  className="rounded-full bg-brand px-4 py-[0.4rem] text-[13px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-dark"
                >
                  Daftar
                </Link>
              </div>
            )}

            <button
              className="border-none bg-transparent text-2xl text-ink md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              <Icon icon={open ? "mdi:close" : "mdi:menu"} />
            </button>
          </div>
        </div>

        <ul className={`${open ? "flex" : "hidden"} mt-2.5 flex-col gap-1 p-0 md:mt-0 md:flex md:flex-row md:gap-6`}>
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
        </ul>
      </div>
    </nav>
  );
}
