import { useState } from "react";
import { NavLink } from "react-router-dom";
import logoLpks from "../assets/img/logo-lpks.png";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/Button";
import { navLinkClass } from "@/components/navLinkClass";

export default function NavbarHome() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line/70 bg-cream/70 backdrop-blur-2xl saturate-150 transition-colors duration-200">
      <div className="container relative flex flex-wrap items-center justify-between gap-y-2 px-3.5 py-2.5 sm:px-5 sm:py-3">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img src={logoLpks} alt="LPKS Borneo Flasher" className="h-8 w-auto sm:h-10" />
        </NavLink>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            icon={open ? "mdi:close" : "mdi:menu"}
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            className="h-9! w-9! rounded-full! border-none! p-0! text-ink text-2xl [&_svg]:h-5 [&_svg]:w-5"
            aria-expanded={open}
            aria-controls="home-navigation"
          />
        </div>

        <ul
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-full left-0 z-50 w-full md:w-auto rounded-b-xl border-b border-line bg-cream p-4 shadow-[var(--shadow-sm)] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none gap-1 md:gap-8 list-none m-0 items-start md:items-center`}
          id="home-navigation"
        >
          <li>
            <NavLink to="/" end onClick={() => setOpen(false)} className={navLinkClass}>
              Beranda
            </NavLink>
          </li>
          <li>
            <NavLink to="/kategori" onClick={() => setOpen(false)} className={navLinkClass}>
              Kategori Produk
            </NavLink>
          </li>
          <li className="hidden md:block">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
