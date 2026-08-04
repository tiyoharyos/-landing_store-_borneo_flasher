import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { findUserByEmail, registerMockUser, validateCredentials } from "@/data/users";

export interface User {
  name: string;
  email: string;
  phone?: string;
  /** Foto profil, disimpan sebagai data URL (base64). */
  avatar?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (input: { name: string; phone?: string; avatar?: string | null }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "bf_auth_user";

// Biodata (nama & no. HP) disimpan terpisah per akun supaya tetap ada
// walau user logout lalu login lagi di sesi lain.
const profileKey = (email: string) => `bf_profile:${email.trim().toLowerCase()}`;

function loadProfileOverride(email: string): { name?: string; phone?: string; avatar?: string } {
  try {
    const raw = localStorage.getItem(profileKey(email));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProfileOverride(email: string, data: { name: string; phone?: string; avatar?: string }) {
  localStorage.setItem(profileKey(email), JSON.stringify(data));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  // Mock login: kredensial divalidasi terhadap daftar akun demo di
  // src/data/users.ts (belum ada backend sungguhan).
  const login: AuthContextValue["login"] = async (email, password) => {
    await new Promise((r) => setTimeout(r, 500));
    if (!email.includes("@")) return { ok: false, message: "Format email tidak valid." };
    if (password.length < 4) return { ok: false, message: "Password minimal 4 karakter." };

    const matched = validateCredentials(email, password);
    if (!matched) {
      const exists = findUserByEmail(email);
      return {
        ok: false,
        message: exists ? "Password salah." : "Email belum terdaftar. Coba daftar dulu.",
      };
    }
    const override = loadProfileOverride(matched.email);
    persist({
      name: override.name ?? matched.name,
      email: matched.email,
      phone: override.phone ?? matched.phone,
      avatar: override.avatar,
    });
    return { ok: true };
  };

  const register: AuthContextValue["register"] = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 500));
    if (!name.trim()) return { ok: false, message: "Nama tidak boleh kosong." };
    if (!email.includes("@")) return { ok: false, message: "Format email tidak valid." };
    if (password.length < 4) return { ok: false, message: "Password minimal 4 karakter." };
    if (findUserByEmail(email)) {
      return { ok: false, message: "Email sudah terdaftar. Coba masuk saja." };
    }
    const created = registerMockUser(name.trim(), email.trim(), password);
    persist({ name: created.name, email: created.email });
    return { ok: true };
  };

  const logout = () => persist(null);

  const updateProfile: AuthContextValue["updateProfile"] = ({ name, phone, avatar }) => {
    if (!user) return;
    const nextAvatar = avatar === null ? undefined : avatar !== undefined ? avatar : user.avatar;
    const next: User = { ...user, name: name.trim(), phone: phone?.trim() || undefined, avatar: nextAvatar };
    saveProfileOverride(user.email, { name: next.name, phone: next.phone, avatar: next.avatar });
    persist(next);
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
