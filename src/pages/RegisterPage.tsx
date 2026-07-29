import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.message ?? "Registrasi gagal.");
      return;
    }
    navigate(next);
  };

  return (
    <div>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-title">Daftar Akun Baru</p>
          <p className="auth-subtitle">
            Ini adalah simulasi registrasi (mock), data disimpan lokal di browser kamu saja.
          </p>

          <label className="auth-label">
            Nama Lengkap
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
          </label>
          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
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
            {loading ? "Memproses..." : "Daftar"}
          </button>

          <p className="auth-footer-text">
            Sudah punya akun?{" "}
            <Link to={`/masuk${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}>
              Masuk di sini
            </Link>
          </p>
        </div>
        <Icon icon="mdi:account-plus-outline" className="auth-decor" width={140} />
      </div>
    </div>
  );
}
