import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "../assets/img/logo-lpks.png";
import { navLinkClass } from "@/components/navLinkClass";

export default function NavbarHome() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-cream">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-3.5">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img src={logoLpks} alt="LPKS Borneo Flasher" className="h-10 w-auto" />
        </NavLink>

        <button
          className="text-2xl text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <Icon icon={open ? "mdi:close" : "mdi:menu"} />
        </button>

        <ul
          className={`${
            open ? "flex" : "hidden"
          } absolute top-full left-0 m-0 w-full list-none flex-col items-start gap-1 border-b border-line bg-cream p-4 md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0`}
        >
          <li>
            <NavLink to="/" end onClick={() => setOpen(false)} className={navLinkClass}>
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink to="/kategori" onClick={() => setOpen(false)} className={navLinkClass}>
              Kategori Kelas
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
