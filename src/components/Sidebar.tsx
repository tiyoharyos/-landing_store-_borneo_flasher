import { Icon } from "@iconify/react";
import { CATEGORIES, type CategorySlug } from "@/data/mockData";

interface Props {
  active: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
}

export default function Sidebar({ active, onSelect }: Props) {
  return (
    <aside className="hidden min-[900px]:sticky min-[900px]:top-[90px] min-[900px]:block min-[900px]:self-start min-[900px]:rounded-2xl min-[900px]:border min-[900px]:border-line min-[900px]:bg-white min-[900px]:p-4">
      <p className="mb-2.5 flex items-center gap-2 font-display text-sm font-bold tracking-[0.05em] text-muted uppercase">
        <Icon icon="mdi:format-list-bulleted" />
        Kategori
      </p>
      {CATEGORIES.map((c) => (
        <div
          key={c.slug}
          className={`flex cursor-pointer items-center gap-2.5 rounded-[10px] px-[10px] py-[9px] text-[13.5px] font-semibold transition-colors ${
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
