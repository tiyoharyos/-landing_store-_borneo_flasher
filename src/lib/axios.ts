import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost/api_borneoacademy/";

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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bf_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export interface ApiResponse<T = unknown> {
  status: number | boolean;
  message: string;
  data: T | null;
}

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