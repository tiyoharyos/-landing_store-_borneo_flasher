import api, { type ApiResponse } from "@/lib/axios";


export interface ApiCategory {
  id_kategori: number | string;
  nama_kategori: string;
  foto?: string | null;
  created_at?: string;
}

export async function getCategories() {
  const res = await api.get<ApiResponse<ApiCategory[]>>("Categories");
  return res.data;
}
export interface CreateCategoryPayload {
  nama_kategori: string;
  foto?: File | null;
}

export async function createCategory(payload: CreateCategoryPayload) {
  const formData = new FormData();
  formData.append("nama_kategori", payload.nama_kategori);

  if (payload.foto) {
    formData.append("foto", payload.foto);
  }

  const res = await api.post<ApiResponse<{ nama_kategori: string }>>(
    "Categories",
    formData
  );
  return res.data;
}

export default {
  getCategories,
  createCategory,
};