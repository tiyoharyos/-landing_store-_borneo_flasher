import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import banner1 from "@/assets/img/banner1.png";
import banner2 from "@/assets/img/banner4.png";
import banner3 from "@/assets/img/banner3.png";

// Buat array baru menggunakan gambar yang di-import
const BANNER_LIST = [
  { image: banner1, title: "Banner 1", subtitle: "Deskripsi Banner 1" },
  { image: banner2, title: "Banner 2", subtitle: "Deskripsi Banner 2" },
  { image: banner3, title: "Banner 3", subtitle: "Deskripsi Banner 3" },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % BANNER_LIST.length), 4500);
    return () => clearInterval(t);
  }, []);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + BANNER_LIST.length) % BANNER_LIST.length);

  return (
    <div className="relative rounded-[20px] overflow-hidden bg-cream-deep aspect-[1400/500]">
      {BANNER_LIST.map((b, i) => (
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
        className="absolute top-1/2 -translate-y-1/2 left-3 w-[34px] h-[34px] rounded-full bg-white/85 border-none flex items-center justify-center cursor-pointer"
        onClick={() => go(-1)}
        aria-label="Sebelumnya"
      >
        <Icon icon="mdi:chevron-left" width={22} />
      </button>
      <button
        className="absolute top-1/2 -translate-y-1/2 right-3 w-[34px] h-[34px] rounded-full bg-white/85 border-none flex items-center justify-center cursor-pointer "
        onClick={() => go(1)}
        aria-label="Berikutnya"
      >
        <Icon icon="mdi:chevron-right" width={22} />
      </button>

      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {BANNER_LIST.map((_, i) => (
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