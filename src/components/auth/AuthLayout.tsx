import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "@/assets/img/logo-lpks.png";
import { BRAND_NAME, waLink } from "@/config/config";
import ThemeToggle from "@/components/ThemeToggle";

export interface AuthFeature {
  icon: string;
  title: string;
  description: string;
}

interface AuthLayoutProps {
  tagline: string;
  taglineSub: string;
  eyebrow?: string;
  features?: AuthFeature[];
  children: ReactNode;
}

export default function AuthLayout({ tagline, taglineSub, eyebrow = "BORNEO FLASHER STORE", features = [], children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="fixed right-5 top-5 z-20">
        <ThemeToggle className="border! border-line! bg-surface/80! shadow-sm backdrop-blur-sm" />
      </div>
      <div className="flex-1 flex items-center justify-center px-5 py-8 md:px-8 md:py-12">
        <div className="w-full max-w-[1080px] grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(360px,420px)] overflow-hidden rounded-[30px] border border-line bg-surface shadow-[var(--shadow-lg)]">
          <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-cream-deep px-10 py-10 text-ink dark:bg-[#0d0d0f] lg:px-14">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[34px] border-brand/30" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[1px] border-line/70" />
            <div className="relative z-10">
              <Link to="/" className="inline-flex rounded-2xl border border-line bg-surface px-4 py-3 shadow-sm">
                <img src={logoLpks} alt="Borneo Flasher Store" className="h-10 w-auto object-contain" />
              </Link>
              <p className="mt-12 text-[11px] font-bold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
              <p className="mt-3 max-w-[430px] font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-ink">
                {tagline}
              </p>
              <p className="mt-4 max-w-[390px] text-[14px] leading-6 text-ink-soft">{taglineSub}</p>
            </div>

            {features.length > 0 && (
              <div className="relative z-10 mt-12 grid gap-3">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3 rounded-2xl border border-line bg-surface/70 px-4 py-3 shadow-[var(--shadow-xs)] backdrop-blur-sm">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                      <Icon icon={feature.icon} width={19} />
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-ink">{feature.title}</p>
                      <p className="mt-0.5 text-[11.5px] leading-5 text-muted">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-full px-5 py-7 sm:px-9 sm:py-10">
            <div className="mb-7 flex items-center justify-between md:hidden">
              <Link to="/" className="inline-flex rounded-xl border border-line bg-surface px-3 py-2">
                <img src={logoLpks} alt="Borneo Flasher Store" className="h-8 w-auto object-contain" />
              </Link>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{eyebrow}</span>
            </div>
            {children}
          </div>
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
