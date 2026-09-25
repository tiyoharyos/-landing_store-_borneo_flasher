import api, { type ApiResponse } from "@/lib/axios";

export type Gender = "L" | "P";

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


export async function verifyAccount(token: string) {
  const res = await api.get<ApiResponse<null>>("Auth/verify", {
    params: { token },
  });
  return res.data;
}

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
