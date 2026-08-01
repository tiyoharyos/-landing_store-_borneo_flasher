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
      <div className="min-h-[60vh] flex items-center justify-center px-5 py-12 relative overflow-hidden">
        <Card className="w-full max-w-[400px] z-[2]" noPadding>
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

              <div className="mt-1.5 bg-cream-deep rounded-xl px-3.5 py-2.5 flex flex-col gap-0.5 transition-colors duration-200">
                <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-brand-dark mb-0.5">
                  <Icon icon="mdi:information-outline" width={15} /> Akun demo
                </p>
                <p className="font-mono text-[11.5px] text-ink-soft">andi@borneoflasher.id / andi1234</p>
                <p className="font-mono text-[11.5px] text-ink-soft">siti@borneoflasher.id / siti1234</p>
              </div>

              <p className="text-center text-[13px] text-muted mt-1.5">
                Belum punya akun?{" "}
                <Link to={`/daftar${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand font-bold">
                  Daftar di sini
                </Link>
              </p>
            </CardBody>
          </div>
        </Card>
        <Icon icon="mdi:shield-check-outline" className="absolute text-brand-tint right-[-20px] bottom-[-20px] z-[1]" width={140} />
      </div>
    </div>
  );
}
