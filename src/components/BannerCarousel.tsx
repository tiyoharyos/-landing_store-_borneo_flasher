import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { getBanners } from "@/services/bannerService";
import { mapBannersToSlides, type BannerSlide } from "@/lib/mapProduct";

import banner1 from "@/assets/img/banner1.png";
import banner2 from "@/assets/img/banner4.png";
import banner3 from "@/assets/img/banner3.png";

// Dipakai sebagai fallback kalau API banner gagal/kosong, supaya hero
// section tidak pernah tampil kosong.
const FALLBACK_BANNERS: BannerSlide[] = [
  { id: "fallback-1", mediaType: "image", src: banner1, alt: "Promo Borneo Flasher 1", link: null, order: 1 },
  { id: "fallback-2", mediaType: "image", src: banner2, alt: "Promo Borneo Flasher 2", link: null, order: 2 },
  { id: "fallback-3", mediaType: "image", src: banner3, alt: "Promo Borneo Flasher 3", link: null, order: 3 },
];

interface SlideMediaProps {
  slide: BannerSlide;
  active: boolean;
}

function SlideMedia({ slide, active }: SlideMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video hanya diputar saat slide-nya aktif, dan diulang dari awal tiap kali muncul.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  const visibility = active ? "opacity-100" : "opacity-0";
  const className =
    "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out " + visibility;

  if (slide.mediaType === "video") {
    return (
      <video
        ref={videoRef}
        src={slide.src}
        poster={slide.poster}
        className={className}
        style={{ willChange: "opacity" }}
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={slide.src}
      alt={slide.alt}
      className={className}
      style={{ willChange: "opacity" }}
    />
  );
}

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [banners, setBanners] = useState<BannerSlide[]>(FALLBACK_BANNERS);

  useEffect(() => {
    let active = true;

    async function fetchBanners() {
      try {
        const data = await getBanners(); // GET /store/banner
        if (!active) return;
        const slides = mapBannersToSlides(data);
        if (slides.length > 0) setBanners(slides);
      } catch {
        // Diam-diam pakai fallback gambar statis kalau API gagal/kosong.
      }
    }

    fetchBanners();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [banners]);

  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [paused, banners.length]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + banners.length) % banners.length);

  const renderSlide = (b: BannerSlide, i: number) => {
    const isActive = i === index;
    const media = <SlideMedia slide={b} active={isActive} />;

    if (!b.link) {
      return <div key={b.id}>{media}</div>;
    }

    return (
      <a
        key={b.id}
        href={b.link}
        target="_blank"
        rel="noopener noreferrer"
        className={"absolute inset-0 " + (isActive ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!isActive}
      >
        {media}
      </a>
    );
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-cream-deep aspect-[1400/500] border border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map(renderSlide)}

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
        {banners.map((b, i) => (
          <Button
            key={b.id}
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