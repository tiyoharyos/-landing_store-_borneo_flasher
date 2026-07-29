import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { findUserByEmail, registerMockUser, validateCredentials } from "@/data/users";

export interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "bf_auth_user";

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
    persist({ name: matched.name, email: matched.email });
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
