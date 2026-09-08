import { api, type ApiResponse } from "@/lib/axios";

export type Gender = "L" | "P";

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  gender: Gender;
}

export interface RegisterResponseData {
  email: string;
  verification_token: string;
}

export interface VerifyResponseData {
  email?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  id: number | string;
  full_name: string;
  email: string;
  token: string;
}

/**
 * POST Auth/register
 * Endpoint penuh: {API_BASE_URL}Auth/register
 */
export async function registerAccount(payload: RegisterPayload) {
  const { data } = await api.post<ApiResponse<RegisterResponseData>>("Auth/register", payload);
  return data;
}

/**
 * POST Auth/login
 * Endpoint penuh: {API_BASE_URL}Auth/login
 * Catatan: berbeda dari register_post, login_post di backend membalas
 * field `status` sebagai boolean (true/false), bukan kode HTTP-like (200/400/dst).
 */
export async function loginAccount(payload: LoginPayload) {
  const { data } = await api.post<ApiResponse<LoginResponseData>>("Auth/login", payload);
  return data;
}

/**
 * GET Auth/verify?token=xxxx
 * Dipakai kalau nanti kamu bikin halaman verifikasi email.
 */
export async function verifyAccount(token: string) {
  const { data } = await api.get<ApiResponse<VerifyResponseData>>("Auth/verify", {
    params: { token },
  });
  return data;
}

/**
 * Bentuk data user yang dibalas backend di profile_get / setelah profile_put.
 * Sesuaikan field ini kalau kolom di tabel user kamu beda.
 */
export interface ProfileData {
  id: number | string;
  full_name: string;
  email: string;
  gender?: Gender;
  no_hp?: string | null;
  foto?: string | null;
  role?: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  no_hp?: string;
  foto?: string;
}

/**
 * GET Auth/profile
 * Perlu Bearer token (otomatis disisipkan oleh interceptor di src/lib/axios.ts).
 */
export async function getProfile() {
  const { data } = await api.get<ApiResponse<ProfileData>>("Auth/profile");
  return data;
}

/**
 * PUT Auth/profile
 * Hanya field yang diisi yang dikirim (backend mengabaikan field kosong/undefined).
 */
export async function updateProfile(payload: UpdateProfilePayload) {
  const { data } = await api.put<ApiResponse<null>>("Auth/profile", payload);
  return data;
}