// Halaman yang tampil tanpa navbar & footer global (layout auth full-page sendiri).
export const NO_CHROME_ROUTES = ["/masuk", "/daftar", "/verifikasi"];

// Mengelompokkan path ke satu "kunci halaman" yang stabil, dipakai sebagai
// key untuk <Routes> + AnimatePresence di AppRouter. Tujuannya: transisi
// masuk/keluar (dan remount halaman) hanya terjadi saat benar-benar
// berpindah HALAMAN, bukan saat berpindah sub-filter di halaman yang sama
// (mis. ganti kategori di /kategori/:category) — supaya bagian yang tidak
// berubah (sidebar, dsb) tidak ikut ke-reset/animasi ulang.
export function routeGroupKey(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/kategori")) return "kategori";
  return pathname;
}
