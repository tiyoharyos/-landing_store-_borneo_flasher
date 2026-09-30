import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/FormLayout";
import FadeIn from "@/components/FadeIn";
import Swal from "sweetalert2";
import type { Gender } from "@/services/authService";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender | "">("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!gender) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data",
        text: "Silakan pilih jenis kelamin terlebih dahulu.",
        confirmButtonText: "Oke",
      });
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, gender);
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
    // Auto-verifikasi HANYA untuk testing lokal (npm run dev + VITE_AUTO_VERIFY=true).
    // Di production, pengguna wajib verifikasi lewat link di email.
    const autoVerify = import.meta.env.DEV && import.meta.env.VITE_AUTO_VERIFY === "true";
    if (autoVerify && res.verificationToken) {
      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil",
        text: "Akun kamu akan langsung diverifikasi otomatis.",
        confirmButtonText: "Lanjutkan",
      });
      navigate(`/verifikasi?token=${encodeURIComponent(res.verificationToken)}`);
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Registrasi Berhasil",
      text: res.message ?? "Silakan cek email kamu untuk verifikasi akun sebelum login.",
      confirmButtonText: "Oke",
    });
    navigate(`/masuk${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`);
  };

  return (
    <AuthLayout
      eyebrow="MULAI PERJALANANMU"
      tagline="Satu akun untuk semua kebutuhan servis HP"
      taglineSub="Belanja sparepart HP, peralatan servis, dan merchandise Borneo Flasher dengan lebih mudah."
      features={[
        {
          icon: "mdi:cart-outline",
          title: "Koleksi kebutuhan servis",
          description: "Temukan sparepart HP dan peralatan servis dalam satu toko.",
        },
        {
          icon: "mdi:heart-outline",
          title: "Checkout lebih praktis",
          description: "Simpan alamat dan informasi akun untuk transaksi berikutnya.",
        },
        {
          icon: "mdi:shield-check-outline",
          title: "Belanja dengan tenang",
          description: "Akun terverifikasi membantu menjaga aktivitas belanjamu.",
        },
      ]}
    >
      <Card noPadding>
        <FadeIn className="p-7 sm:p-8">
          <CardHeader className="mb-1">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Mulai belanja</p>
              <CardTitle className="text-[1.2rem]">Buat akun e-commerce</CardTitle>
              <CardSubtitle>
                Daftar untuk membeli sparepart HP, alat servis, dan merchandise Borneo Flasher.
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
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
              />
              <Select
                label="Jenis Kelamin"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                placeholder="Pilih jenis kelamin"
                options={[
                  { value: "L", label: "Laki-laki" },
                  { value: "P", label: "Perempuan" },
                ]}
              />

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="shadow-[var(--shadow-brand)]">
                Daftar dan mulai belanja
              </Button>
            </Form>

            <p className="text-center text-[13px] text-muted mt-1.5">
              Sudah punya akun?{" "}
              <Link to={`/masuk${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand font-bold">
                Masuk di sini
              </Link>
            </p>
          </CardBody>
        </FadeIn>
      </Card>
    </AuthLayout>
  );
}