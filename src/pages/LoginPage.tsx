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
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-5 py-12">
        <Card className="z-[2] w-full max-w-[400px]" noPadding>
          <div className="p-8">
            <CardHeader className="mb-1">
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

              <div className="mt-1.5 flex flex-col gap-0.5 rounded-xl bg-cream-deep px-3.5 py-2.5">
                <p className="mb-0.5 flex items-center gap-1.5 text-[11.5px] font-bold text-brand-dark">
                  <Icon icon="mdi:information-outline" width={15} /> Akun demo
                </p>
                <p className="font-mono text-[11.5px] text-ink-soft">andi@borneoflasher.id / andi1234</p>
                <p className="font-mono text-[11.5px] text-ink-soft">siti@borneoflasher.id / siti1234</p>
              </div>

              <p className="mt-1.5 text-center text-sm text-muted">
                Belum punya akun?{" "}
                <Link
                  to={`/daftar${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
                  className="font-bold text-brand"
                >
                  Daftar di sini
                </Link>
              </p>
            </CardBody>
          </div>
        </Card>
        <Icon icon="mdi:shield-check-outline" className="absolute -right-5 -bottom-5 z-[1] text-brand-tint" width={140} />
      </div>
    </div>
  );
}
