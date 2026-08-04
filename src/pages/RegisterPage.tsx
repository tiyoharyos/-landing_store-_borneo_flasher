import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/FormLayout";
import { alertError, alertSuccess } from "@/components/ui/swal";

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
      alertError({ title: "Gagal Daftar", text: res.message ?? "Registrasi gagal." });
      return;
    }
    await alertSuccess({ title: "Akun Berhasil Dibuat", text: "Selamat datang di Borneo Flasher Store!" });
    navigate(next);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center px-5 py-12 relative overflow-hidden">
        <Card className="w-full max-w-[400px] z-[2]" noPadding>
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
        <Icon icon="mdi:account-plus-outline" className="absolute text-brand-tint right-[-20px] bottom-[-20px] z-[1]" width={140} />
      </div>
    </div>
  );
}
