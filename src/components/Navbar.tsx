import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "../assets/img/logo-lpks.png";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const menuRef = useRef<HTMLDivElement>(null);

  const submitSearch = () => {
    const q = query.trim();
    navigate(q ? `/cari?q=${encodeURIComponent(q)}` : "/cari");
    setOpen(false);
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
            <Link to="/keranjang" className="navbar-cart" aria-label="Keranjang">
              <Icon icon="mdi:cart-outline" width={24} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {user ? (
              <div className="navbar-account" ref={menuRef}>
                <button className="navbar-account-btn" onClick={() => setMenuOpen((v) => !v)}>
                  <Icon icon="mdi:account-circle-outline" width={22} />
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                  <Icon icon="mdi:chevron-down" width={16} />
                </button>
                {menuOpen && (
                  <div className="navbar-account-dropdown">
                    <Link to="/akun/pesanan" onClick={() => setMenuOpen(false)}>
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
            <NavLink to="/kategori/alat-tools" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              Alat & Tools
            </NavLink>
          </li>
          <li>
            <NavLink to="/kategori/sparepart-iphone" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              Sparepart iPhone
            </NavLink>
          </li>
          <li>
            <NavLink to="/kategori/sparepart-android" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              Sparepart Android
            </NavLink>
          </li>
          <li>
            <NavLink to="/kategori/merchandise" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              Merchandise
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
