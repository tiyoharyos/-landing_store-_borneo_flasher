import axios from "axios";

/**
 * Base URL API Borneo Academy.
 * Ubah lewat env var VITE_API_BASE_URL kalau nanti pindah ke domain/staging lain,
 * fallback ke localhost untuk development.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost/api_borneoacademy/";

// Header + value API key, di-set lewat .env (VITE_API_KEY_HEADER & VITE_API_KEY).
// Backend CI4 kamu bisa cek header ini di filter/hook sebelum request masuk ke controller.
const API_KEY_HEADER = import.meta.env.VITE_API_KEY_HEADER ?? "BA-KEY";
const API_KEY = import.meta.env.VITE_API_KEY ?? "";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(API_KEY ? { [API_KEY_HEADER]: API_KEY } : {}),
  },
  timeout: 15000,
});

// Kalau login sudah dapat JWT, token otomatis disisipkan sebagai Bearer token
// di setiap request berikutnya (disimpan di localStorage saat login berhasil).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bf_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kalau token expired/invalid, backend balas 401 lewat jwtauth->validateToken().
// Bersihkan token & data user lokal supaya UI kembali ke state "belum login".
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("bf_access_token");
      localStorage.removeItem("bf_auth_user");
    }
    return Promise.reject(error);
  }
);

// Bentuk umum response dari REST_Controller (_response) di backend CI4 kamu.
export interface ApiResponse<T = unknown> {
  status: number | boolean;
  message: string;
  data: T | null;
}

/**
 * Helper untuk menarik pesan error yang human-readable dari AxiosError,
 * baik ketika backend membalas JSON _response() maupun saat request gagal total
 * (network error / CORS / server down).
 */
export function getApiErrorMessage(error: unknown, fallback = "Terjadi kesalahan, coba lagi."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiResponse> | undefined;
    if (data?.message) return data.message;
    if (error.code === "ECONNABORTED") return "Koneksi ke server timeout, coba lagi.";
    if (!error.response) return "Tidak bisa terhubung ke server. Periksa koneksi kamu.";
  }
  return fallback;
}

export default api;