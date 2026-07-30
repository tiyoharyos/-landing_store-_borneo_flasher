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
    toastSuccess("Akun berhasil dibuat!");
    navigate(next);
  };

  return (
    <div>
      <Navbar />
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-5 py-12">
        <Card className="z-[2] w-full max-w-[400px]" noPadding>
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

              <p className="mt-1.5 text-center text-sm text-muted">
                Sudah punya akun?{" "}
                <Link
                  to={`/masuk${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
                  className="font-bold text-brand"
                >
                  Masuk di sini
                </Link>
              </p>
            </CardBody>
          </div>
        </Card>
        <Icon icon="mdi:account-plus-outline" className="absolute -right-5 -bottom-5 z-[1] text-brand-tint" width={140} />
      </div>
    </div>
  );
}
