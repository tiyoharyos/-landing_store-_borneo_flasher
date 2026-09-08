import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getProfile,
  loginAccount,
  registerAccount,
  updateProfile as updateProfileApi,
  type Gender,
  type ProfileData,
} from "@/services/authService";
import { getApiErrorMessage } from "@/lib/axios";

export interface User {
  id?: number | string;
  name: string;
  email: string;
  phone?: string;
  /** Foto profil. Backend menyimpan ini sebagai field `foto` (URL atau data URL base64). */
  avatar?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    gender: Gender
  ) => Promise<{
    ok: boolean;
    message?: string;
    needsVerification?: boolean;
    verificationToken?: string;
  }>;
  logout: () => void;
  updateProfile: (input: {
    name: string;
    phone?: string;
    avatar?: string | null;
  }) => Promise<{ ok: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "bf_auth_user";
// Nama key ini HARUS sama dengan yang dibaca interceptor di src/lib/axios.ts
const TOKEN_KEY = "bf_access_token";

// Ubah bentuk response Auth/profile (full_name, no_hp, foto) jadi bentuk User di FE.
function mapProfileToUser(data: ProfileData): User {
  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    phone: data.no_hp ?? undefined,
    avatar: data.foto ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = (u: User | null, token?: string | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      if (token) localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  // Saat pertama kali app dibuka: kalau ada token tersimpan, validasi & sinkronkan
  // data user dengan GET Auth/profile (backend adalah sumber kebenaran).
  // Kalau token invalid/expired (401), otomatis logout.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    // Tampilkan data cache dulu (biar UI tidak kedip kosong) sambil menunggu validasi.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupted cache
    }

    getProfile()
      .then((res) => {
        if (res.status && res.data) {
          persist(mapProfileToUser(res.data));
        } else {
          persist(null);
        }
      })
      .catch(() => {
        // Interceptor di axios.ts sudah membersihkan localStorage kalau 401.
        // Kalau errornya network error (bukan 401), biarkan data cache dipakai dulu.
        if (!localStorage.getItem(TOKEN_KEY)) persist(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Login sungguhan ke Auth/login (lihat src/services/authService.ts).
  const login: AuthContextValue["login"] = async (email, password) => {
    try {
      const res = await loginAccount({ email, password });

      // PENTING: login_post di backend membalas `status` sebagai boolean
      // (true/false), berbeda dari register_post yang pakai kode HTTP (200/400/dst).
      if (!res.status || !res.data) {
        return { ok: false, message: res.message || "Email atau password salah." };
      }

      // Simpan token dulu supaya request GET Auth/profile berikutnya (interceptor)
      // otomatis terkirim dengan Authorization: Bearer token.
      localStorage.setItem(TOKEN_KEY, res.data.token);

      // Ambil profil lengkap (termasuk no_hp & foto) dari backend.
      try {
        const profileRes = await getProfile();
        if (profileRes.status && profileRes.data) {
          persist(mapProfileToUser(profileRes.data), res.data.token);
          return { ok: true };
        }
      } catch {
        // Kalau gagal, tetap lanjut pakai data minimal dari response login.
      }

      persist(
        { id: res.data.id, name: res.data.full_name, email: res.data.email },
        res.data.token
      );
      return { ok: true };
    } catch (err) {
      return { ok: false, message: getApiErrorMessage(err, "Gagal masuk, coba lagi.") };
    }
  };

  // Register sungguhan ke Auth/register. Backend mewajibkan verifikasi email,
  // jadi setelah sukses user BELUM otomatis login — arahkan ke halaman login.
  const register: AuthContextValue["register"] = async (name, email, password, gender) => {
    try {
      const res = await registerAccount({
        full_name: name.trim(),
        email: email.trim(),
        password,
        gender,
      });

      if (res.status !== 201) {
        return { ok: false, message: res.message || "Registrasi gagal." };
      }

      // Backend saat ini belum kirim email verifikasi sungguhan — token-nya
      // langsung dibalikin di response register. Diteruskan ke UI supaya
      // pengguna bisa langsung diarahkan ke /verifikasi?token=... untuk testing.
      return {
        ok: true,
        message: res.message,
        needsVerification: true,
        verificationToken: res.data?.verification_token,
      };
    } catch (err) {
      return { ok: false, message: getApiErrorMessage(err, "Gagal daftar, coba lagi.") };
    }
  };

  const logout = () => persist(null);

  // Update biodata sungguhan ke PUT Auth/profile. Hanya field yang berubah yang dikirim.
  const updateProfile: AuthContextValue["updateProfile"] = async ({ name, phone, avatar }) => {
    if (!user) return { ok: false, message: "Belum login." };

    try {
      const res = await updateProfileApi({
        full_name: name.trim(),
        no_hp: phone?.trim() || undefined,
        // avatar === null artinya "tidak diubah" (dipakai NameEditModal/PhoneEditModal
        // yang tidak menyentuh foto). undefined juga berarti tidak diubah.
        foto: avatar === null || avatar === undefined ? undefined : avatar,
      });

      if (!res.status) {
        return { ok: false, message: res.message || "Gagal memperbarui profil." };
      }

      const next: User = {
        ...user,
        name: name.trim(),
        phone: phone?.trim() || undefined,
        avatar: avatar === null ? undefined : avatar ?? user.avatar,
      };
      persist(next);
      return { ok: true, message: res.message };
    } catch (err) {
      return { ok: false, message: getApiErrorMessage(err, "Gagal memperbarui profil, coba lagi.") };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
