import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Card, CardHeader, CardTitle, CardSubtitle, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { verifyAccount } from "@/services/authService";
import { getApiErrorMessage } from "@/lib/axios";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan di URL.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await verifyAccount(token);
        if (cancelled) return;

        if (res.status) {
          setStatus("success");
          setMessage(res.message || "Email berhasil diverifikasi.");
        } else {
          setStatus("error");
          setMessage(res.message || "Verifikasi gagal.");
        }
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(getApiErrorMessage(err, "Gagal memverifikasi email, coba lagi."));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AuthLayout
      tagline="Satu Langkah Lagi"
      taglineSub="Verifikasi email kamu supaya bisa mulai belanja & servis di Borneo Flasher Store."
    >
      <Card noPadding>
        <div className="p-8 text-center">
          <CardHeader className="mb-1">
            <div>
              <CardTitle>Verifikasi Email</CardTitle>
              <CardSubtitle>Memproses tautan verifikasi akun kamu.</CardSubtitle>
            </div>
          </CardHeader>

          <CardBody>
            <div className="flex flex-col items-center gap-3 py-4">
              {status === "loading" && (
                <>
                  <Icon icon="mdi:loading" width={48} className="text-brand animate-spin" />
                  <p className="text-sm text-muted">Sedang memverifikasi akun kamu...</p>
                </>
              )}

              {status === "success" && (
                <>
                  <Icon icon="mdi:check-circle-outline" width={48} className="text-ok" />
                  <p className="font-bold text-ink">{message}</p>
                  <Button variant="primary" size="lg" fullWidth onClick={() => navigate("/masuk")}>
                    Masuk Sekarang
                  </Button>
                </>
              )}

              {status === "error" && (
                <>
                  <Icon icon="mdi:close-circle-outline" width={48} className="text-warn" />
                  <p className="font-bold text-ink">{message}</p>
                  <p className="text-xs text-muted">
                    Token bisa saja sudah kedaluwarsa (berlaku 1 hari) atau tidak valid.
                    Coba daftar ulang kalau perlu.
                  </p>
                  <Link to="/daftar" className="text-brand font-bold text-[13px] hover:underline">
                    Daftar Ulang
                  </Link>
                </>
              )}
            </div>
          </CardBody>
        </div>
      </Card>
    </AuthLayout>
  );
}