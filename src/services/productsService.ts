import api, { type ApiResponse } from "@/lib/axios";


export interface ApiProduct {
  id_produk: number | string;
  nama_produk: string;
  kode_produk: string;
  kuantitas: number | string;
  harga_modal: number | string;
  harga_normal: number | string;
  harga_spesial?: number | string | null;
  lokasi_penyimpanan: string;
  supplier: string;
  id_kategori: number | string | null;
  id_sub_kategori?: number | string | null;
  id_supplier?: number | string | null;
  nama_kategori?: string | null;
  image: string | null;
  created_at?: string;
  updated_at?: string;
}

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

export async function getProductDetail(id: number | string) {
  const res = await api.get<ApiResponse<ApiProduct>>(
    `Products/detail/${id}`
  );
  return res.data;
}

// ---------- CREATE PRODUCT (admin) ----------
export interface CreateProductPayload {
  nama_produk: string;
  kode_produk: string;
  kuantitas: number;
  harga_modal: number;
  harga_normal: number;
  lokasi_penyimpanan: string;
  supplier: string;
  id_kategori?: number | string | null;
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
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await api.post<ApiResponse<{ id_produk: number | string }>>(
    "Products",
    formData
  );
  return res.data;
}

// ---------- UPDATE PRODUCT CATEGORY (admin) ----------

export interface UpdateProductPayload {
  id_produk: number | string;
  id_kategori?: number | string;
}

export async function updateProduct(payload: UpdateProductPayload) {
  const res = await api.put<ApiResponse<null>>("Products", payload);
  return res.data;
}

// ---------- DELETE PRODUCT (admin) ----------

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