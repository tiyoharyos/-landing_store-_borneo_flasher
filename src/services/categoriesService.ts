import api, { type ApiResponse } from "@/lib/axios";

/**
 * Service untuk endpoint Categories.
 * Base URL sudah di-set di src/lib/axios.ts (VITE_API_BASE_URL),
 * jadi path di sini ditulis relatif tanpa leading slash.
 *
 *   GET  Categories/        -> list semua kategori (public)
 *   POST Categories/        -> buat kategori baru (admin only)
 */

export interface ApiCategory {
  id_kategori: number | string;
  nama_kategori: string;
  // Nama file saja (bukan URL lengkap), contoh: "cdb9a77d5f47d2af08a7bb5a441581c6.jpg".
  // Build URL lengkapnya lewat resolveUploadUrl() di "@/lib/uploads".
  foto?: string | null;
  created_at?: string;
}

// ---------- GET ALL CATEGORIES ----------
// GET Categories/
// Response.status = boolean

export async function getCategories() {
  const res = await api.get<ApiResponse<ApiCategory[]>>("Categories");
  return res.data;
}

// ---------- CREATE CATEGORY (admin) ----------
// POST Categories/
// Body: { nama_kategori }
// Sukses = 201, sudah ada = 409

export interface CreateCategoryPayload {
  nama_kategori: string;
}

export async function createCategory(payload: CreateCategoryPayload) {
  const res = await api.post<ApiResponse<{ nama_kategori: string }>>(
    "Categories",
    payload
  );
  return res.data;
}

export default {
  getCategories,
  createCategory,
};
