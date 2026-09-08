import { API_BASE_URL } from "@/lib/axios";

/**
 * ASUMSI PATH UPLOAD.
 *
 * Backend cuma mengirim nama file (mis. "cdb9a77d5f47d2af08a7bb5a441581c6.jpg"),
 * bukan URL lengkap. Untuk produk, path aslinya dikonfirmasi:
 *   http://localhost/api_borneoacademy/upload/store/produk/
 * Untuk kategori masih ASUMSI mengikuti pola yang sama
 * ("upload/store/kategori/") — tolong dikonfirmasi juga.
 *
 * Kalau path kategori ternyata beda, ganti lewat env var
 * VITE_UPLOAD_BASE_URL, atau edit UPLOAD_BASE_URL di bawah ini.
 */
const UPLOAD_BASE_URL =
  import.meta.env.VITE_UPLOAD_BASE_URL ?? `${API_BASE_URL.replace(/\/?$/, "")}/upload/store/`;

export function resolveUploadUrl(
  filename: string | null | undefined,
  folder: "kategori" | "produk" = "kategori"
): string | null {
  if (!filename) return null;
  // Kalau backend suatu saat sudah kirim URL lengkap (http...), pakai langsung.
  if (/^https?:\/\//i.test(filename)) return filename;
  return `${UPLOAD_BASE_URL}${folder}/${filename}`;
}
