import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/SafeImage";
import { getBanners } from "@/services/bannerService";
import { mapBannersToSlides, type BannerSlide } from "@/lib/mapProduct";
import { BANNER_NO_IMAGE } from "@/lib/fallbackImages";

const FALLBACK_BANNERS: BannerSlide[] = [
  { id: "fallback-no-image", mediaType: "image", src: BANNER_NO_IMAGE, alt: "Banner tidak tersedia", link: null, order: 1 },
];

const FRAME = "rounded-[30px] bg-gradient-to-br from-cream-deep via-white to-cream border border-line/80 shadow-[var(--shadow-sm)] aspect-[16/7] md:aspect-[1400/500] overflow-hidden";
const AUTOPLAY_MS = 5000;
const SWIPE_MIN_PX = 40;

interface SlideMediaProps {
  slide: BannerSlide;
  active: boolean;
  priority: boolean;
}

function SlideMedia({ slide, active, priority }: SlideMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

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
  const className = "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out " + visibility;

  // Jika tipe video dan link videonya ada, langsung render <video> menggunakan slide.src
  if (slide.mediaType === "video" && slide.src && !videoFailed) {
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
        onError={() => setVideoFailed(true)}
      />
    );
  }

  // Jika gambar / video gagal dimuat
  return (
    <SafeImage
      src={slide.mediaType === "video" ? slide.poster || BANNER_NO_IMAGE : slide.src}
      alt={slide.alt}
      fallback={BANNER_NO_IMAGE}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
      style={{ willChange: "opacity" }}
    />
  );
}

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [banners, setBanners] = useState<BannerSlide[] | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchBanners() {
      try {
        const data = await getBanners(); 
        if (!active) return;
        const slides = mapBannersToSlides(data);
        setBanners(slides.length > 0 ? slides : FALLBACK_BANNERS);
      } catch {
        if (active) setBanners(FALLBACK_BANNERS);
      }
    }
    fetchBanners();
    return () => { active = false; };
  }, []);

  const slides = banners ?? [];
  const count = slides.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || count <= 1) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  if (banners === null) {
    return <div className={FRAME + " animate-pulse"} />;
  }

  const renderSlide = (b: BannerSlide, i: number) => {
    const isActive = i === index;
    const media = <SlideMedia slide={b} active={isActive} priority={i === 0} />;

    if (!b.link) {
      return <div key={b.id} className="absolute inset-0">{media}</div>;
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
      className={"group relative overflow-hidden " + FRAME}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((b, i) => (
        <div key={b.id} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          {renderSlide(b, i)}
        </div>
      ))}

      {count > 1 && (
        <>
          <div className="hidden md:contents">
            <Button
              variant="outline"
              icon="mdi:chevron-left"
              onClick={() => go(-1)}
              aria-label="Sebelumnya"
              className="absolute! top-1/2 -translate-y-1/2 left-3 w-8! h-8! p-0! rounded-full! bg-surface/90! text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
            />
            <Button
              variant="outline"
              icon="mdi:chevron-right"
              onClick={() => go(1)}
              aria-label="Berikutnya"
              className="absolute! top-1/2 -translate-y-1/2 right-3 w-8! h-8! p-0! rounded-full! bg-surface/90! text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
            />
          </div>

          <div className="absolute bottom-3 right-3 flex gap-1.5 z-20">
            {slides.map((b, i) => (
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
        </>
      )}
    </div>
  );
}