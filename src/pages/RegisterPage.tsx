import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/FormLayout";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Gagal Daftar",
        text: res.message ?? "Registrasi gagal.",
        confirmButtonText: "Oke",
      });
      return;
    }
    await Swal.fire({
      icon: "success",
      title: "Akun Berhasil Dibuat",
      text: "Selamat datang di Borneo Flasher Store!",
      confirmButtonText: "Oke",
    });
    navigate(next);
  };

  return (
    <AuthLayout
      tagline="Belanja & Servis, Semua Ada di Sini"
      taglineSub="Daftar sekarang dan nikmati kemudahan transaksi di Borneo Flasher Store."
    >
      <Card noPadding>
        <div className="p-8">
          <CardHeader className="mb-1">
            <div>
              <CardTitle>Daftar Akun Baru</CardTitle>
              <CardSubtitle>
                Simulasi registrasi (mock) — data disimpan lokal di sesi browser kamu saja.
              </CardSubtitle>
            </div>
          </CardHeader>

          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Input
                label="Nama Lengkap"
                icon="mdi:account-outline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                autoComplete="name"
              />
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
                autoComplete="new-password"
              />

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                Daftar
              </Button>
            </Form>

            <p className="text-center text-[13px] text-muted mt-1.5">
              Sudah punya akun?{" "}
              <Link to={`/masuk${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand font-bold">
                Masuk di sini
              </Link>
            </p>
          </CardBody>
        </div>
      </Card>
    </AuthLayout>
  );
}
