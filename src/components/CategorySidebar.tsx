import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getCategories, type ApiCategory } from "@/services/categoriesService";

export default function CategorySidebar() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((res) => {
        if (!cancelled) setCategories(res.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className="hidden md:block self-start sticky top-[90px] bg-surface border border-line rounded-xl p-4">
      <p className="font-display font-bold text-sm text-muted uppercase tracking-wide mb-2.5">
        Kategori
      </p>

      {loading ? (
        <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-10 rounded-[10px] bg-cream-deep animate-pulse" />
          ))}
        </ul>
      ) : categories.length === 0 ? (
        <p className="text-[13px] text-muted">Belum ada kategori.</p>
      ) : (
        <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
          {categories.map((c) => (
            <li key={c.id_kategori}>
              <NavLink
                to={`/kategori/${c.id_kategori}`}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2.5 rounded-[10px] text-[13.5px] font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-tint text-brand"
                      : "text-ink-soft hover:bg-cream-deep"
                  }`
                }
              >
                {c.foto ? (
                  <img
                    src={c.foto}
                    alt=""
                    className="w-[18px] h-[18px] rounded object-cover"
                  />
                ) : (
                  <Icon icon="mdi:tag-outline" width={18} />
                )}
                {c.nama_kategori}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}