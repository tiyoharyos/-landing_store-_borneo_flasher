import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Card, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { verifyAccount } from "@/services/authService";
import { getApiErrorMessage } from "@/lib/axios";

type VerifyState = "loading" | "success" | "error";

export default function VerifyPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("Memverifikasi email kamu, tunggu sebentar...");
  // StrictMode di dev me-mount komponen 2x; ref ini mencegah request verify terkirim dobel.
  const requestedRef = useRef(false);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;

    if (!token) {
      setState("error");
      setMessage("Link verifikasi tidak valid. Token tidak ditemukan pada URL.");
      return;
    }

    verifyAccount(token)
      .then((res) => {
        if (res.status) {
          setState("success");
          setMessage(res.message || "Email berhasil diverifikasi, kamu sekarang bisa login.");
        } else {
          setState("error");
          setMessage(res.message || "Verifikasi gagal, silakan coba lagi.");
        }
      })
      .catch((err) => {
        setState("error");
        setMessage(getApiErrorMessage(err, "Verifikasi gagal, silakan coba lagi."));
      });
  }, [token]);

  return (
    <AuthLayout
      tagline="Satu Langkah Lagi"
      taglineSub="Verifikasi email kamu supaya akun langsung siap dipakai untuk belanja & servis."
    >
      <Card noPadding>
        <div className="p-8">
          <CardBody className="items-center text-center gap-4">
            {state === "loading" && (
              <>
                <Icon icon="mdi:loading" width={44} className="text-brand animate-spin" />
                <p className="text-[14px] text-ink-soft">{message}</p>
              </>
            )}

            {state === "success" && (
              <>
                <Icon icon="mdi:check-circle-outline" width={48} className="text-ok" />
                <p className="font-display font-extrabold text-lg text-ink">Email Terverifikasi</p>
                <p className="text-[13.75px] text-muted">{message}</p>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate("/masuk")}
                  className="mt-2"
                >
                  Masuk Sekarang
                </Button>
              </>
            )}

            {state === "error" && (
              <>
                <Icon icon="mdi:close-circle-outline" width={48} className="text-warn" />
                <p className="font-display font-extrabold text-lg text-ink">Verifikasi Gagal</p>
                <p className="text-[13.75px] text-muted">{message}</p>
                <Link to="/daftar" className="mt-2 w-full">
                  <Button variant="outline" size="lg" fullWidth>
                    Daftar Ulang
                  </Button>
                </Link>
              </>
            )}
          </CardBody>
        </div>
      </Card>
    </AuthLayout>
  );
}
