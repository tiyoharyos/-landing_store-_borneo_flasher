import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/SafeImage";
import { getBanners } from "@/services/bannerService";
import { mapBannersToSlides, type BannerSlide } from "@/lib/mapProduct";
import { BANNER_NO_IMAGE } from "@/lib/fallbackImages";

// Dipakai kalau API banner gagal / kosong, supaya hero section tidak pernah tampil kosong.
const FALLBACK_BANNERS: BannerSlide[] = [
  { id: "fallback-no-image", mediaType: "image", src: BANNER_NO_IMAGE, alt: "Banner tidak tersedia", link: null, order: 1 },
];

interface SlideMediaProps {
  slide: BannerSlide;
  active: boolean;
}

function SlideMedia({ slide, active }: SlideMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

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

  // Video yang gagal dimuat ditampilkan sebagai gambar (poster kalau ada, kalau tidak banner_no_image).
  if (slide.mediaType === "video" && !videoFailed) {
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

  return (
    <SafeImage
      src={slide.mediaType === "video" ? slide.poster : slide.src}
      alt={slide.alt}
      fallback={BANNER_NO_IMAGE}
      className={className}
      style={{ willChange: "opacity" }}
    />
  );
}

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // null = masih memuat; setelah selesai selalu berisi minimal 1 slide.
  const [banners, setBanners] = useState<BannerSlide[] | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchBanners() {
      try {
        const data = await getBanners(); // GET /store/banner
        if (!active) return;
        const slides = mapBannersToSlides(data);
        setBanners(slides.length > 0 ? slides : FALLBACK_BANNERS);
      } catch {
        // API gagal -> tampilkan banner_no_image.
        if (active) setBanners(FALLBACK_BANNERS);
      }
    }

    fetchBanners();
    return () => {
      active = false;
    };
  }, []);

  const slides = banners ?? [];

  useEffect(() => {
    setIndex(0);
  }, [banners]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length);

  // Placeholder saat banner masih dimuat (mencegah "kedip" banner_no_image sebelum data datang).
  if (banners === null) {
    return <div className="rounded-xl bg-cream-deep aspect-[1400/500] border border-line animate-pulse" />;
  }

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

  const showControls = slides.length > 1;

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-cream-deep aspect-[1400/500] border border-line"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map(renderSlide)}

      {showControls && (
        <>
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
