import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { CATEGORIES } from "@/data/products";

export default function CategorySidebar() {
  return (
    <aside className="category-sidebar">
      <p className="category-sidebar-title">Kategori</p>
      <ul>
        {CATEGORIES.map((c) => (
          <li key={c.key}>
            <NavLink
              to={`/kategori/${c.key}`}
              className={({ isActive }) => `category-sidebar-link ${isActive ? "active" : ""}`}
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
