import api, { type ApiResponse } from "@/lib/axios";

/**
 * Service untuk endpoint Cart.
 * Semua endpoint butuh Authorization: Bearer <token> (otomatis lewat
 * interceptor di src/lib/axios.ts).
 *
 *   GET    Cart/  -> isi keranjang milik user login + grand_total
 *   POST   Cart/  -> tambah produk ke keranjang (body: { id_product, quantity? })
 *                    kalau produk sudah ada di cart, quantity DITAMBAHKAN (increment)
 *   PUT    Cart/  -> set quantity produk di keranjang (body: { id_product, quantity })
 *                    quantity di sini MENGGANTI (bukan menambah) qty yang lama
 *   DELETE Cart/  -> hapus produk dari keranjang (body: { id_product })
 *
 * Catatan penamaan: endpoint Products/ pakai key "id_produk", tapi endpoint
 * Cart/ (POST/PUT/DELETE) konsisten pakai key "id_product" (lihat controller
 * index_post/index_put/index_delete). Item hasil GET Cart/ kemungkinan besar
 * join ke tabel produk (mengikuti pola Wishlist_model), jadi field join-nya
 * dibuat fleksibel di ApiCartItem.
 */

export interface ApiCartItem {
  id_keranjang?: number | string;
  id_cart?: number | string;
  id_product?: number | string;
  id_produk?: number | string;
  // Field join dari tabel produk (opsional, tergantung query model).
  nama_produk?: string;
  kode_produk?: string;
  image?: string | null;
  kuantitas?: number; // stok produk yang tersedia
  id_kategori?: number | string | null;
  nama_kategori?: string;
  // Harga & qty keranjang.
  harga_normal: number;
  harga_spesial?: number | string | null;
  quantity: number;
  // Ditambahkan oleh controller index_get() di atas.
  price_used?: number;
  subtotal?: number;
}

export interface ApiCartData {
  items: ApiCartItem[];
  grand_total: number;
}

// ---------- GET CART ----------
// GET Cart/

export async function getCart() {
  const res = await api.get<ApiResponse<ApiCartData>>("Cart");
  return res.data;
}

// ---------- ADD TO CART ----------
// POST Cart/  body: { id_product, quantity }

export async function addToCart(id_product: number | string, quantity = 1) {
  const res = await api.post<ApiResponse<null>>("Cart", { id_product, quantity });
  return res.data;
}

// ---------- SET CART QUANTITY ----------
// PUT Cart/  body: { id_product, quantity }
// quantity di sini mengganti (set), bukan menambah.

export async function setCartQuantity(id_product: number | string, quantity: number) {
  const res = await api.put<ApiResponse<null>>("Cart", { id_product, quantity });
  return res.data;
}

// ---------- REMOVE FROM CART ----------
// DELETE Cart/  body: { id_product }

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
