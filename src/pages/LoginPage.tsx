import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.message ?? "Login gagal.");
      return;
    }
    navigate(next);
  };

  return (
    <div>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-title">Masuk ke Akun Kamu</p>
          <p className="auth-subtitle">
            Ini adalah simulasi login (mock), tidak terhubung ke server sungguhan.
          </p>

          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              onKeyUp={(e) => e.key === "Enter" && handleSubmit()}
            />
          </label>
          <label className="auth-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 4 karakter"
              onKeyUp={(e) => e.key === "Enter" && handleSubmit()}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="btn-solid-lg w-full mt-2" onClick={handleSubmit} disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="auth-footer-text">
            Belum punya akun?{" "}
            <Link to={`/daftar${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}>
              Daftar di sini
            </Link>
          </p>
        </div>
        <Icon icon="mdi:shield-check-outline" className="auth-decor" width={140} />
      </div>
    </div>
  );
}
