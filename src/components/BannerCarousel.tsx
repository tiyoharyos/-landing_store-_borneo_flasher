import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { BANNERS } from "@/data/products";

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + BANNERS.length) % BANNERS.length);

  return (
    <div className="relative aspect-[1400/500] overflow-hidden rounded-[20px] bg-cream-deep">
      {BANNERS.map((b, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-[rgba(28,22,19,0.75)] to-transparent px-8 py-6 text-white">
            <p className="font-display text-[clamp(18px,3vw,30px)] font-extrabold">{b.title}</p>
            <p className="mt-1 text-[clamp(12px,1.5vw,15px)] opacity-90">{b.subtitle}</p>
          </div>
        </div>
      ))}
      <button
        className="absolute top-1/2 left-3 flex h-[34px] w-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-[rgba(255,255,255,0.85)] text-ink"
        onClick={() => go(-1)}
        aria-label="Sebelumnya"
      >
        <Icon icon="mdi:chevron-left" width={22} />
      </button>
      <button
        className="absolute top-1/2 right-3 flex h-[34px] w-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-[rgba(255,255,255,0.85)] text-ink"
        onClick={() => go(1)}
        aria-label="Berikutnya"
      >
        <Icon icon="mdi:chevron-right" width={22} />
      </button>
      <div className="absolute right-4 bottom-3 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`h-[7px] cursor-pointer rounded-full border-none p-0 transition-all ${
              i === index ? "w-[18px] rounded-md bg-white" : "w-[7px] bg-[rgba(255,255,255,0.55)]"
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
