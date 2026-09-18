import api, { type ApiResponse } from "@/lib/axios";

/**
 * Service untuk endpoint Products.
 * Base URL sudah di-set di src/lib/axios.ts (VITE_API_BASE_URL),
 * jadi path di sini ditulis relatif tanpa leading slash.
 *
 *   GET    Products/          -> list produk (support ?search= & ?id_kategori=)
 *   GET    Products/detail/:id -> detail 1 produk
 *   POST   Products/          -> buat produk baru (admin only)
 *   PUT    Products/          -> update kategori produk (admin only)
 *   DELETE Products/          -> hapus produk (admin only)
 */

export interface ApiProduct {
  id_produk: number | string;
  nama_produk: string;
  kode_produk: string;
  kuantitas: number | string;
  harga_modal: number | string;
  harga_normal: number | string;
  // Harga promo/diskon, bisa null/"" kalau produk tidak sedang didiskon.
  harga_spesial?: number | string | null;
  lokasi_penyimpanan: string;
  supplier: string;
  id_kategori: number | string | null;
  id_sub_kategori?: number | string | null;
  id_supplier?: number | string | null;
  // Beberapa backend CI4 join nama kategori langsung di query list produk.
  // Field ini opsional, dipakai kalau tersedia dari backend.
  nama_kategori?: string | null;
  image: string | null;
  created_at?: string;
  updated_at?: string;
}

// ---------- GET ALL PRODUCTS ----------
// GET Products/?search=...&id_kategori=...
// Dipakai untuk page Home (tanpa filter) & page Kategori (dengan filter).

export interface GetProductsParams {
  search?: string;
  id_kategori?: number | string;
}

export async function getProducts(params: GetProductsParams = {}) {
  const res = await api.get<ApiResponse<ApiProduct[]>>("Products", {
    params: {
      search: params.search || undefined,
      id_kategori: params.id_kategori || undefined,
    },
  });
  return res.data;
}

// ---------- GET PRODUCT DETAIL ----------
// GET Products/detail/:id

export async function getProductDetail(id: number | string) {
  const res = await api.get<ApiResponse<ApiProduct>>(
    `Products/detail/${id}`
  );
  return res.data;
}

// ---------- CREATE PRODUCT (admin) ----------
// POST Products/

export interface CreateProductPayload {
  nama_produk: string;
  kode_produk: string;
  kuantitas: number;
  harga_modal: number;
  harga_normal: number;
  lokasi_penyimpanan: string;
  supplier: string;
  id_kategori?: number | string | null;
  // File asli dari <input type="file" />, bukan string/base64.
  // Opsional -- kalau tidak diisi, produk dibuat tanpa gambar.
  image?: File | null;
}

export async function createProduct(payload: CreateProductPayload) {
  const formData = new FormData();
  formData.append("nama_produk", payload.nama_produk);
  formData.append("kode_produk", payload.kode_produk);
  formData.append("kuantitas", String(payload.kuantitas));
  formData.append("harga_modal", String(payload.harga_modal));
  formData.append("harga_normal", String(payload.harga_normal));
  formData.append("lokasi_penyimpanan", payload.lokasi_penyimpanan);
  formData.append("supplier", payload.supplier);

  if (payload.id_kategori !== undefined && payload.id_kategori !== null) {
    formData.append("id_kategori", String(payload.id_kategori));
  }

  // Field 'image' cuma di-append kalau user beneran pilih file,
  // sesuai pengecekan !empty($_FILES['image']['name']) di backend.
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await api.post<ApiResponse<{ id_produk: number | string }>>(
    "Products",
    formData
    // Sengaja TIDAK set header Content-Type manual -- axios/browser akan
    // otomatis pasang 'multipart/form-data; boundary=...' yang benar
    // begitu mendeteksi data-nya FormData.
  );
  return res.data;
}

// ---------- UPDATE PRODUCT CATEGORY (admin) ----------
// PUT Products/
// Body: { id_produk, id_kategori }

export interface UpdateProductPayload {
  id_produk: number | string;
  id_kategori?: number | string;
}

export async function updateProduct(payload: UpdateProductPayload) {
  const res = await api.put<ApiResponse<null>>("Products", payload);
  return res.data;
}

// ---------- DELETE PRODUCT (admin) ----------
// DELETE Products/
// Body: { id_produk }

export async function deleteProduct(id_produk: number | string) {
  const res = await api.delete<ApiResponse<null>>("Products", {
    data: { id_produk },
  });
  return res.data;
}

export default {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
};