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

// HP: rasio lebih tinggi supaya banner tidak jadi "strip" tipis. Tablet/desktop: rasio asli 1400x500.
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
      // Banner pertama = elemen terbesar di atas layar (LCP): muat duluan, jangan lazy.
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
  // null = masih memuat; setelah selesai selalu berisi minimal 1 slide.
  const [banners, setBanners] = useState<BannerSlide[] | null>(null);
  // Slide yang sudah pernah "dekat" (aktif / berikutnya). Slide lain belum di-mount,
  // jadi gambar & video-nya tidak diunduh sebelum dibutuhkan.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const touchStart = useRef<{ x: number; y: number } | null>(null);

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
  const count = slides.length;

  useEffect(() => {
    setIndex(0);
  }, [banners]);

  // Tandai slide aktif + slide berikutnya sebagai "boleh dimuat" (preload satu slide ke depan).
  useEffect(() => {
    if (count === 0) return;
    setSeen((prev) => {
      const next = new Set(prev);
      next.add(index);
      next.add((index + 1) % count);
      return next.size === prev.size ? prev : next;
    });
  }, [index, count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setInterval(() => {
      if (document.hidden) return; // tab tidak aktif: jangan geser slide
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);

  // Swipe kiri/kanan di HP. Gerakan yang dominan vertikal dianggap scroll biasa.
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

  // Placeholder saat banner masih dimuat (mencegah "kedip" banner_no_image sebelum data datang).
  if (banners === null) {
    return <div className={FRAME + " animate-pulse"} />;
  }

  const renderSlide = (b: BannerSlide, i: number) => {
    if (!seen.has(i)) return <div key={b.id} />;

    const isActive = i === index;
    const media = <SlideMedia slide={b} active={isActive} priority={i === 0} />;

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
      className={"group relative overflow-hidden " + FRAME}
      // Pause hanya untuk mouse. Di HP, tap memicu "hover" palsu yang bikin carousel berhenti selamanya.
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map(renderSlide)}

      {count > 1 && (
        <>
          {/* Tombol panah hanya untuk md+ (hover). Di HP cukup swipe. */}
          <div className="hidden md:contents">
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
          </div>

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
