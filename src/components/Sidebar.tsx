import { Icon } from "@iconify/react";
import { CATEGORIES, type CategorySlug } from "@/data/mockData";

interface Props {
  active: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
}

export default function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className="category-sidebar">
      <p className="head">
        <Icon icon="mdi:format-list-bulleted" />
        Kategori
      </p>
      {CATEGORIES.map((c) => (
        <div
          key={c.slug}
          className={`item ${active === c.slug ? "active" : ""}`}
          onClick={() => onSelect(c.slug)}
        >
          <Icon icon={c.icon} width={17} />
          {c.name}
        </div>
      ))}
    </aside>
  );
}
