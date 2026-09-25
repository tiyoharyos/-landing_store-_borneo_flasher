import api, { type ApiResponse } from "@/lib/axios";


export interface ApiCartItem {
  id_keranjang?: number | string;
  id_cart?: number | string;
  id_product?: number | string;
  id_produk?: number | string;
  nama_produk?: string;
  kode_produk?: string;
  image?: string | null;
  kuantitas?: number;
  id_kategori?: number | string | null;
  nama_kategori?: string;
  harga_normal: number;
  harga_spesial?: number | string | null;
  quantity: number;
  price_used?: number;
  subtotal?: number;
}

export interface ApiCartData {
  items: ApiCartItem[];
  grand_total: number;
}
export async function getCart() {
  const res = await api.get<ApiResponse<ApiCartData>>("Cart");
  return res.data;
}


export async function addToCart(id_product: number | string, quantity = 1) {
  const res = await api.post<ApiResponse<null>>("Cart", { id_product, quantity });
  return res.data;
}


export async function setCartQuantity(id_product: number | string, quantity: number) {
  const res = await api.put<ApiResponse<null>>("Cart", { id_product, quantity });
  return res.data;
}


export async function removeFromCart(id_product: number | string) {
  const res = await api.delete<ApiResponse<null>>("Cart", {
    data: { id_product },
  });
  return res.data;
}

export default {
  getCart,
  addToCart,
  setCartQuantity,
  removeFromCart,
};
