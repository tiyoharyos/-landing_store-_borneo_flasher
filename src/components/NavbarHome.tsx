import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "../assets/img/logo-lpks.png";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinkClass } from "@/components/navLinkClass";

export default function NavbarHome() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-cream border-b border-line sticky top-0 z-50 transition-colors">
      <div className="container flex items-center justify-between py-3.5">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img src={logoLpks} alt="LPKS Borneo Flasher" className="h-10 w-auto" />
        </NavLink>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="text-2xl text-ink bg-transparent border-none cursor-pointer transition-colors duration-200"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <Icon icon={open ? "mdi:close" : "mdi:menu"} />
          </button>
        </div>

        <ul
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto bg-cream md:bg-transparent border-b md:border-0 border-line p-4 md:p-0 gap-1 md:gap-8 list-none m-0 items-start md:items-center transition-colors duration-200`}
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
          <li className="hidden md:block">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
