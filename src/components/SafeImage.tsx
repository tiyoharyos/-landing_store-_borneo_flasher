import { useState, type ImgHTMLAttributes } from "react";
import { NO_IMAGE } from "@/lib/fallbackImages";

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  /** Gambar pengganti. Default: no_image (produk & kategori). Banner pakai BANNER_NO_IMAGE. */
  fallback?: string;
}

/**
 * <img> yang otomatis menampilkan gambar "no image" kalau:
 *  - src kosong (null / undefined / ""), atau
 *  - gambar gagal dimuat (404, server mati, URL rusak, dll).
 *
 * Default-nya lazy + decoding async (ringan untuk grid produk). Untuk gambar utama di atas
 * layar, override: loading="eager" fetchPriority="high".
 */
export default function SafeImage({ src, fallback = NO_IMAGE, onError, alt = "", ...rest }: SafeImageProps) {
  // Simpan src yang gagal (bukan boolean) supaya otomatis "reset" saat src berubah.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const useFallback = !src || failedSrc === src;

  return (
    <img
      loading="lazy"
      decoding="async"
      {...rest}
      alt={alt}
      src={useFallback ? fallback : src}
      onError={(e) => {
        // Kalau fallback-nya sendiri yang error, jangan diulang (hindari infinite loop).
        if (!useFallback) setFailedSrc(src ?? null);
        onError?.(e);
      }}
    />
  );
}
