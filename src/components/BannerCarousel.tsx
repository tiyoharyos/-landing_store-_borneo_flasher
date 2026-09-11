import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import banner1 from "@/assets/img/banner1.png";
import banner2 from "@/assets/img/banner4.png";
import banner3 from "@/assets/img/banner3.png";

const BANNER_LIST = [
  { image: banner1, alt: "Promo Borneo Flasher 1" },
  { image: banner2, alt: "Promo Borneo Flasher 2" },
  { image: banner3, alt: "Promo Borneo Flasher 3" },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % BANNER_LIST.length), 5000);
    return () => clearInterval(t);
  }, []);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + BANNER_LIST.length) % BANNER_LIST.length);

  return (
    <div className="group relative rounded-xl overflow-hidden bg-cream-deep aspect-[1400/500] border border-line">
      {BANNER_LIST.map((b, i) => (
        <img
          key={i}
          src={b.image}
          alt={b.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <button
        className="absolute top-1/2 -translate-y-1/2 left-3 w-8 h-8 rounded-full bg-surface/90 border border-line flex items-center justify-center cursor-pointer text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={() => go(-1)}
        aria-label="Sebelumnya"
      >
        <Icon icon="mdi:chevron-left" width={18} />
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-3 w-8 h-8 rounded-full bg-surface/90 border border-line flex items-center justify-center cursor-pointer text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={() => go(1)}
        aria-label="Berikutnya"
      >
        <Icon icon="mdi:chevron-right" width={18} />
      </button>

      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {BANNER_LIST.map((_, i) => (
          <button
            key={i}
            className={`h-1.5 rounded-full border-none cursor-pointer p-0 transition-all ${
              i === index ? "w-5 bg-surface" : "w-1.5 bg-surface/50"
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
