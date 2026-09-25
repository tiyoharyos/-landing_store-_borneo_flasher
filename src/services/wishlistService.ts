import api, { type ApiResponse } from "@/lib/axios";
import type { ApiProduct } from "@/services/productsService";
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
