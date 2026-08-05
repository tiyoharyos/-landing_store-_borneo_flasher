import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import logoLpks from "@/assets/img/logo-lpks.png";
import { BRAND_NAME, waLink } from "@/config/config";

interface AuthLayoutProps {
  tagline: string;
  taglineSub: string;
  children: ReactNode;
}

export default function AuthLayout({ tagline, taglineSub, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 md:py-14">

        <div className="w-full max-w-[980px] flex flex-col md:flex-row items-center md:items-stretch justify-center gap-10 md:gap-16">
          <div className="hidden md:flex flex-col items-center justify-center flex-1 text-center">
            <Link to="/" className="mb-8">
              <img src={logoLpks} alt="Borneo Flasher Store" className="h-auto w-auto" />
            </Link>
            <p className="font-display font-extrabold text-xl text-ink mt-4">{tagline}</p>
            <p className="text-[13.5px] text-muted mt-1.5 max-w-[320px]">{taglineSub}</p>
          </div>
          <div className="w-full max-w-[400px] shrink-0">{children}</div>
        </div>
      </div>

      <div className="py-6 text-center text-[12px] text-muted">
        © 2020–2026, {BRAND_NAME}
        <span className="mx-1.5 text-line">|</span>
        <a
          href={waLink("Halo admin, saya butuh bantuan untuk masuk/daftar akun.")}
          target="_blank"
          rel="noreferrer"
          className="text-brand font-bold hover:underline"
        >
          Butuh Bantuan?
        </a>
      </div>
    </div>
  );
}
