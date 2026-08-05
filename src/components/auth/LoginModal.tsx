import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Form } from "@/components/ui/FormLayout";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";

/**
 * Modal login gaya Tokopedia: muncul sebagai overlay di atas halaman yang
 * sedang dibuka (bukan pindah ke halaman terpisah). Dipasang sekali secara
 * global di App.tsx dan dikendalikan lewat AuthModalContext.
 */
export default function LoginModal() {
  const { login } = useAuth();
  const { isOpen, next, closeLogin } = useAuthModal();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    closeLogin();
  };

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

    resetForm();
    closeLogin();
    navigate(next);
    Swal.fire({
      icon: "success",
      title: "Berhasil Masuk",
      text: "Selamat datang kembali!",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  return (
    <Modal open={isOpen} onClose={handleClose} title="Masuk" maxWidth={400}>
      <p className="text-[12.5px] text-muted -mt-2">
        Simulasi login (mock) — coba salah satu akun demo, atau daftar akun baru.
      </p>

      <Form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          icon="mdi:email-outline"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          autoComplete="email"
          autoFocus
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

      <div className="bg-cream-deep rounded-xl px-3.5 py-2.5 flex flex-col gap-0.5">
        <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-brand-dark mb-0.5">
          <Icon icon="mdi:information-outline" width={15} /> Akun demo
        </p>
        <p className="font-mono text-[11.5px] text-ink-soft">andi@borneoflasher.id / andi1234</p>
        <p className="font-mono text-[11.5px] text-ink-soft">siti@borneoflasher.id / siti1234</p>
      </div>

      <p className="text-center text-[13px] text-muted">
        Belum punya akun?{" "}
        <Link
          to={next !== "/" ? `/daftar?next=${encodeURIComponent(next)}` : "/daftar"}
          className="text-brand font-bold"
          onClick={handleClose}
        >
          Daftar di sini
        </Link>
      </p>
    </Modal>
  );
}
