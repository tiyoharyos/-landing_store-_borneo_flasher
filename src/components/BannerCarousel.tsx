import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

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
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % BANNER_LIST.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + BANNER_LIST.length) % BANNER_LIST.length);

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-cream-deep aspect-[1400/500] border border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {BANNER_LIST.map((b, i) => (
        <img
          key={i}
          src={b.image}
          alt={b.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ willChange: "opacity" }}
        />
      ))}

      <Button
        variant="outline"
        icon="mdi:chevron-left"
        onClick={() => go(-1)}
        aria-label="Sebelumnya"
        className="absolute! top-1/2 -translate-y-1/2 left-3 w-8! h-8! p-0! rounded-full! bg-surface/90! text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
      <Button
        variant="outline"
        icon="mdi:chevron-right"
        onClick={() => go(1)}
        aria-label="Berikutnya"
        className="absolute! top-1/2 -translate-y-1/2 right-3 w-8! h-8! p-0! rounded-full! bg-surface/90! text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />

      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {BANNER_LIST.map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5! rounded-full! border-none! p-0! transition-all ${
              i === index ? "w-5! bg-surface!" : "w-1.5! bg-surface/50!"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
