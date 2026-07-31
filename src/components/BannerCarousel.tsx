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
    <div className="banner-carousel">
      {BANNERS.map((b, i) => (
        <div key={i} className={`banner-slide ${i === index ? "active" : ""}`}>
          <img src={b.image} alt={b.title} />
          <div className="banner-overlay">
            <p className="banner-title">{b.title}</p>
            <p className="banner-subtitle">{b.subtitle}</p>
          </div>
        </div>
      ))}
      <button className="banner-arrow left" onClick={() => go(-1)} aria-label="Sebelumnya">
        <Icon icon="mdi:chevron-left" width={22} />
      </button>
      <button className="banner-arrow right" onClick={() => go(1)} aria-label="Berikutnya">
        <Icon icon="mdi:chevron-right" width={22} />
      </button>
      <div className="banner-dots">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`banner-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
