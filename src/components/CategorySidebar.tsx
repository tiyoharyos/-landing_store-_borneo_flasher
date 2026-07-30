import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { CATEGORIES } from "@/data/products";

export default function CategorySidebar() {
  return (
    <aside className="hidden min-[900px]:sticky min-[900px]:top-[90px] min-[900px]:block min-[900px]:self-start min-[900px]:rounded-2xl min-[900px]:border min-[900px]:border-line min-[900px]:bg-white min-[900px]:p-4">
      <p className="mb-2.5 font-display text-sm font-bold tracking-[0.05em] text-muted uppercase">Kategori</p>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {CATEGORIES.map((c) => (
          <li key={c.key}>
            <NavLink
              to={`/kategori/${c.key}`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-[10px] px-[10px] py-[9px] text-[13.5px] font-semibold transition-colors ${
                  isActive ? "bg-brand-tint text-brand" : "text-ink-soft hover:bg-cream-deep"
                }`
              }
            >
              <Icon icon={c.icon} width={18} />
              {c.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
