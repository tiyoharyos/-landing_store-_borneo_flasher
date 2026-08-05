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
    <div className="relative rounded-[20px] overflow-hidden bg-cream-deep aspect-[1400/500]">
      {BANNERS.map((b, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
          {/* <div className="absolute left-0 bottom-0 w-full px-8 py-6 text-white bg-gradient-to-t from-black/60 to-transparent">
            <p className="font-display font-extrabold text-[clamp(18px,3vw,30px)]">{b.title}</p>
            <p className="text-[clamp(12px,1.5vw,15px)] opacity-90 mt-1">{b.subtitle}</p>
          </div> */}
        </div>
      ))}
      <button
        className="absolute top-1/2 -translate-y-1/2 left-3 w-[34px] h-[34px] rounded-full bg-white/85 border-none flex items-center justify-center cursor-pointer text-ink"
        onClick={() => go(-1)}
        aria-label="Sebelumnya"
      >
        <Icon icon="mdi:chevron-left" width={22} />
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-3 w-[34px] h-[34px] rounded-full bg-white/85 border-none flex items-center justify-center cursor-pointer text-ink"
        onClick={() => go(1)}
        aria-label="Berikutnya"
      >
        <Icon icon="mdi:chevron-right" width={22} />
      </button>
      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`h-[7px] rounded-full bg-white/55 border-none cursor-pointer p-0 transition-all ${
              i === index ? "w-[18px] !bg-white" : "w-[7px]"
            }`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
