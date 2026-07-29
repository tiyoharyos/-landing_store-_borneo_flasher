import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "../assets/img/logo-lpks.png";

export default function NavbarHome() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-navbar">
      <div className="container flex items-center justify-between py-3.5">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img src={logoLpks} alt="LPKS Borneo Flasher" className="h-10 w-auto" />
        </NavLink>

        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          style={{ color: "var(--ink)" }}
        >
          <Icon icon={open ? "mdi:close" : "mdi:menu"} />
        </button>

        <ul
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto bg-[var(--cream)] md:bg-transparent border-b md:border-0 border-[var(--line)] p-4 md:p-0 gap-1 md:gap-8 list-none m-0 items-start md:items-center`}
        >
          <li>
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kategori"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Kategori Kelas
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
