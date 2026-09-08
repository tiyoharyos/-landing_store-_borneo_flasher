import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/FormLayout";
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
    // Backend belum kirim email verifikasi sungguhan, jadi untuk sekarang
    // arahkan langsung ke halaman verifikasi memakai token dari response register.
    if (res.verificationToken) {
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
      tagline="Belanja & Servis, Semua Ada di Sini"
      taglineSub="Daftar sekarang dan nikmati kemudahan transaksi di Borneo Flasher Store."
    >
      <Card noPadding>
        <div className="p-8">
          <CardHeader className="mb-1">
            <div>
              <CardTitle>Daftar Akun Baru</CardTitle>
              <CardSubtitle>
                Daftar akun baru untuk mulai belanja & servis di Borneo Flasher Store.
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