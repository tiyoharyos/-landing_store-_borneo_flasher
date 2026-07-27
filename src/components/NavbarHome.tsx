import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "@/assets/img/logo.png";

export default function NavbarHome() {
  const [isToggled, setIsToggled] = useState(false);
  const location = useLocation();
  const isMenuRoute = location.pathname.startsWith("/mitra/") && location.pathname !== "/mitra";

  return (
    <div className="sticky top-0 z-50">
      <nav className="navbar">
        <div className="container flex items-center justify-between">
          <NavLink to="/" className="navbar-brand">
            <img src={logo} alt="GadgetShop" />
          </NavLink>

          <button
            className="navbar-toggler md:hidden"
            onClick={() => setIsToggled(!isToggled)}
            aria-label="Toggle navigation"
          >
            <Icon icon={isToggled ? "mdi:close" : "mdi:menu"} />
          </button>

          {!isMenuRoute && (
            <ul
              className={`${
                isToggled ? "flex" : "hidden"
              } md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto bg-[var(--color-main)] md:bg-transparent p-4 md:p-0 gap-1 md:gap-2 list-none m-0`}
            >
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsToggled(false)}
                >
                  <Icon icon="mdi:home" className="me-1 mr-1" />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/mitra"
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setIsToggled(false)}
                >
                  <Icon icon="mdi:store" className="me-1 mr-1" />
                  Mitra Kami
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
