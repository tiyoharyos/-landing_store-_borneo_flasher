import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { CATEGORIES } from "@/data/products";

export default function CategorySidebar() {
  return (
    <aside className="hidden md:block self-start sticky top-[90px] bg-surface border border-line rounded-2xl p-4 transition-colors duration-200">
      <p className="font-display font-bold text-sm text-muted uppercase tracking-wide mb-2.5">
        Kategori
      </p>
      <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
        {CATEGORIES.map((c) => (
          <li key={c.key}>
            <NavLink
              to={`/kategori/${c.key}`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2.5 rounded-[10px] text-[13.5px] font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-tint text-brand"
                    : "text-ink-soft hover:bg-cream-deep"
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
