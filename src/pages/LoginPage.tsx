import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/FormLayout";
import { alertError, toastSuccess } from "@/components/ui/alert";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      alertError({ title: "Gagal Masuk", text: res.message ?? "Login gagal." });
      return;
    }
    toastSuccess("Berhasil masuk. Selamat datang kembali!");
    navigate(next);
  };

  return (
    <div>
      <Navbar />
      <div className="auth-page">
        <Card className="auth-card-ui" noPadding>
          <div className="auth-card-inner">
            <CardHeader className="auth-card-header">
              <div>
                <CardTitle>Masuk ke Akun Kamu</CardTitle>
                <CardSubtitle>
                  Simulasi login (mock) — coba salah satu akun demo, atau daftar akun baru.
                </CardSubtitle>
              </div>
            </CardHeader>

            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  type="email"
                  icon="mdi:email-outline"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type="password"
                  icon="mdi:lock-outline"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 4 karakter"
                  autoComplete="current-password"
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                  Masuk
                </Button>
              </Form>

              <div className="auth-demo-box">
                <p className="auth-demo-title">
                  <Icon icon="mdi:information-outline" width={15} /> Akun demo
                </p>
                <p className="auth-demo-item">andi@borneoflasher.id / andi1234</p>
                <p className="auth-demo-item">siti@borneoflasher.id / siti1234</p>
              </div>

              <p className="auth-footer-text">
                Belum punya akun?{" "}
                <Link to={`/daftar${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}>
                  Daftar di sini
                </Link>
              </p>
            </CardBody>
          </div>
        </Card>
        <Icon icon="mdi:shield-check-outline" className="auth-decor" width={140} />
      </div>
    </div>
  );
}
