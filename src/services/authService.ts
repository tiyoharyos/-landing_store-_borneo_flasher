import api, { type ApiResponse } from "@/lib/axios";

/**
 * Service untuk endpoint Auth (login, register, verify, profile).
 * Base URL sudah di-set di src/lib/axios.ts (VITE_API_BASE_URL),
 * jadi path di sini ditulis relatif tanpa leading slash, contoh: "Auth/login".
 */

export type Gender = "L" | "P";

// ---------- LOGIN ----------
// POST Auth/login
// Body: { email, password }
// Response.status = boolean (true/false)

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginData {
  id: number | string;
  full_name: string;
  email: string;
  token: string;
}

export async function loginAccount(payload: LoginPayload) {
  const res = await api.post<ApiResponse<LoginData>>("Auth/login", payload);
  return res.data;
}

// ---------- REGISTER ----------
// POST Auth/register
// Body: { full_name, email, password, gender } -> gender harus "L" | "P"
// Response.status = kode HTTP (200/400/409/201/500), sukses = 201

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  gender: Gender;
}

export interface RegisterData {
  email: string;
  verification_token: string;
}

export async function registerAccount(payload: RegisterPayload) {
  const res = await api.post<ApiResponse<RegisterData>>("Auth/register", payload);
  return res.data;
}

// ---------- VERIFY EMAIL ----------
// GET Auth/verify?token=xxx

export async function verifyAccount(token: string) {
  const res = await api.get<ApiResponse<null>>("Auth/verify", {
    params: { token },
  });
  return res.data;
}

// ---------- PROFILE ----------
// GET Auth/profile (butuh Authorization: Bearer <token>, sudah otomatis via interceptor di lib/axios.ts)
// PUT Auth/profile (update biodata)
//
// Catatan: struktur endpoint profile ini mengikuti nama field yang sudah dipakai
// di AuthContext.tsx (full_name, no_hp, foto). Sesuaikan path/nama field di bawah
// ini kalau ternyata implementasi backend Auth/profile kamu berbeda.

export interface ProfileData {
  id: number | string;
  full_name: string;
  email: string;
  gender?: Gender;
  no_hp?: string | null;
  foto?: string | null;
}

export async function getProfile() {
  const res = await api.get<ApiResponse<ProfileData>>("Auth/profile");
  return res.data;
}

export interface UpdateProfilePayload {
  full_name?: string;
  no_hp?: string;
  foto?: string;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const res = await api.put<ApiResponse<ProfileData>>("Auth/profile", payload);
  return res.data;
}

export default {
  loginAccount,
  registerAccount,
  verifyAccount,
  getProfile,
  updateProfile,
};
