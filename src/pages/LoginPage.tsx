import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/FormLayout";
import FadeIn from "@/components/FadeIn";

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
      eyebrow="AKSES AKUN"
      tagline="Belanja lebih cepat, semua tetap terpantau"
      taglineSub="Satu akun untuk mengelola pesanan, alamat, dan kebutuhan servis di Borneo Flasher Store."
      features={[
        {
          icon: "akar-icons:circle-check",
          title: "Lacak pesanan dengan mudah",
          description: "Pantau status order dan riwayat belanja dari satu tempat.",
        },
        {
          icon: "mdi:map-marker-outline",
          title: "Checkout lebih singkat",
          description: "Simpan alamat pengiriman agar transaksi berikutnya lebih cepat.",
        },
        {
          icon: "mdi:tools",
          title: "Siap untuk kebutuhan servis",
          description: "Akses pengalaman belanja dan servis yang lebih personal.",
        },
      ]}
    >
      <Card noPadding>
        <FadeIn className="p-7 sm:p-8">
          <CardHeader className="mb-1">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Selamat datang kembali</p>
              <CardTitle className="text-[1.2rem]">Masuk ke akun kamu</CardTitle>
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

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="shadow-[var(--shadow-brand)]">
                Masuk ke akun
              </Button>
            </Form>

            <p className="text-center text-[13px] text-muted mt-1.5">
              Belum punya akun?{" "}
              <Link to={`/daftar${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand font-bold">
                Daftar di sini
              </Link>
            </p>
          </CardBody>
        </FadeIn>
      </Card>
    </AuthLayout>
  );
}