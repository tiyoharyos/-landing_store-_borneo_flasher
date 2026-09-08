import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/FormLayout";

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
      Swal.fire({
        icon: "error",
        title: "Gagal Masuk",
        text: res.message ?? "Login gagal.",
        confirmButtonText: "Oke",
      });
      return;
    }
    await Swal.fire({
      icon: "success",
      title: "Berhasil Masuk",
      text: "Selamat datang kembali!",
      confirmButtonText: "Oke",
    });
    navigate(next);
  };

  return (
    <AuthLayout
      tagline="Servis & Belanja Sparepart Jadi Lebih Mudah"
      taglineSub="Masuk untuk lacak pesanan, simpan alamat, dan checkout lebih cepat."
    >
      <Card noPadding>
        <div className="p-8">
          <CardHeader className="mb-1">
            <div>
              <CardTitle>Masuk ke Akun Kamu</CardTitle>
              <CardSubtitle>
                Masuk dengan akun yang sudah kamu daftarkan & verifikasi.
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

            <p className="text-center text-[13px] text-muted mt-1.5">
              Belum punya akun?{" "}
              <Link to={`/daftar${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand font-bold">
                Daftar di sini
              </Link>
            </p>
          </CardBody>
        </div>
      </Card>
    </AuthLayout>
  );
}