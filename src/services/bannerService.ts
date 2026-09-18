import { resolveUploadFolderUrl } from "@/lib/uploads";

/**
 * Data Banner TIDAK diambil lewat endpoint API JSON (mis. Banner/ di
 * api_borneoacademy) — backend belum/tidak punya endpoint itu (404).
 *
 * Sebagai gantinya, gambar banner diambil LANGSUNG dari folder upload
 * publiknya:
 *
 *   http://localhost/borneo_academy/upload/store/banner/
 *
 * Caranya: fetch folder itu (directory listing bawaan Apache/Nginx),
 * lalu ambil semua nama file gambar dari HTML listing-nya. Base URL
 * folder ini diatur lewat VITE_UPLOAD_BASE_URL di .env (lihat
 * src/lib/uploads.ts) — TIDAK ada request ke api_borneoacademy sama
 * sekali untuk data banner.
 */

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

function parseImageFilenamesFromDirectoryListing(html: string): string[] {
  const seen = new Set<string>();
  const matches = html.matchAll(/href\s*=\s*["']([^"']+)["']/gi);

  for (const m of matches) {
    let href = m[1];
    if (!href || href.startsWith("?") || href.startsWith("/") || href.includes("://")) continue;
    if (href === "../" || href === "..") continue;

    href = decodeURIComponent(href);
    const filename = href.split("/").filter(Boolean).pop();
    if (filename && IMAGE_EXT_RE.test(filename)) seen.add(filename);
  }

  return Array.from(seen);
}

// Ambil nama-nama file gambar langsung dari directory listing folder
// upload/store/banner/.
export async function getBannerFilenamesFromUploadFolder(): Promise<string[]> {
  const folderUrl = resolveUploadFolderUrl("banner");
  const res = await fetch(folderUrl);
  if (!res.ok) throw new Error(`Gagal baca folder banner (${res.status})`);
  const html = await res.text();
  return parseImageFilenamesFromDirectoryListing(html);
}

export default {
  getBannerFilenamesFromUploadFolder,
};
