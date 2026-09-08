import api, { type ApiResponse } from "@/lib/axios";
import type { ApiProduct } from "@/services/productsService";

/**
 * Service untuk endpoint Wishlist.
 * Semua endpoint butuh Authorization: Bearer <token> (otomatis lewat
 * interceptor di src/lib/axios.ts).
 *
 *   GET    Wishlist/  -> list wishlist milik user login
 *   POST   Wishlist/  -> tambah produk ke wishlist (body: { id_product })
 *   DELETE Wishlist/  -> hapus produk dari wishlist (body: { id_product })
 */

// Bentuk item wishlist belum dikonfirmasi 100% (getByUser_get kemungkinan
// join ke tabel produk). Field id di sini dibuat fleksibel: backend bisa
// saja mengirim "id_produk" (konsisten dengan Products/) atau "id_product"
// (konsisten dengan payload POST/DELETE di atas).
export interface ApiWishlistItem extends Omit<ApiProduct, "id_produk"> {
  id_wishlist?: number | string;
  id_produk?: number | string;
  id_product?: number | string;
}

export async function getWishlist() {
  const res = await api.get<ApiResponse<ApiWishlistItem[]>>("Wishlist");
  return res.data;
}

export async function addToWishlist(id_product: number | string) {
  const res = await api.post<ApiResponse<null>>("Wishlist", { id_product });
  return res.data;
}

export async function removeFromWishlist(id_product: number | string) {
  const res = await api.delete<ApiResponse<null>>("Wishlist", {
    data: { id_product },
  });
  return res.data;
}

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
