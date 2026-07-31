import { Icon } from "@iconify/react";
import { CATEGORIES, type CategorySlug } from "@/data/mockData";

interface Props {
  active: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
}

export default function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className="hidden md:block self-start sticky top-[90px] bg-surface border border-line rounded-2xl p-4">
      <p className="flex items-center gap-2 font-display font-bold text-sm text-muted uppercase tracking-wide mb-2.5">
        <Icon icon="mdi:format-list-bulleted" />
        Kategori
      </p>
      {CATEGORIES.map((c) => (
        <div
          key={c.slug}
          className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-[10px] text-[13.5px] font-semibold cursor-pointer transition-colors ${
            active === c.slug ? "bg-brand-tint text-brand" : "text-ink-soft hover:bg-cream-deep"
          }`}
          onClick={() => onSelect(c.slug)}
        >
          <Icon icon={c.icon} width={17} />
          {c.name}
        </div>
      ))}
    </aside>
  );
}
