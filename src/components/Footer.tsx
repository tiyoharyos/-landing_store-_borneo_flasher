import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import logoLpks from "../assets/img/logo-lpks.png";
import { ADDRESS, EMAIL, PHONE_DISPLAY, SOCIALS, waLink } from "@/config/config";

const SOCIAL_ICONS: { key: keyof typeof SOCIALS; icon: string }[] = [
  { key: "facebook", icon: "mdi:facebook" },
  { key: "instagram", icon: "mdi:instagram" },
  { key: "youtube", icon: "mdi:youtube" },
  { key: "tiktok", icon: "ic:baseline-tiktok" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-line">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <img src={logoLpks} alt="LPKS Borneo Flasher" className="h-10 w-auto" />
            <p className="mt-4 text-[14px] leading-relaxed text-[#bcb1a6]">
              Awali kesuksesan belajarmu bersama LPKS Borneo Flasher Indonesia —
              dari nol sampai mahir, dibimbing sampai siap kerja.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.key}
                  href={SOCIALS[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[rgba(231,221,209,0.25)] text-line transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  aria-label={s.key}
                >
                  <Icon icon={s.icon} width={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="mb-3 font-display text-[15px] font-bold text-white">Menu</p>
            <div className="flex flex-col gap-2 text-[14px] text-[#bcb1a6]">
              <Link to="/">Beranda</Link>
              <Link to="/kategori/alat-tools">Alat & Tools</Link>
              <Link to="/kategori/sparepart-iphone">Sparepart iPhone</Link>
              <Link to="/keranjang">Keranjang</Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="mb-3 font-display text-[15px] font-bold text-white">Kontak</p>
            <div className="flex flex-col gap-2.5 text-[14px] text-[#bcb1a6]">
              <span className="flex items-center gap-2">
                <Icon icon="mdi:phone-outline" />
                {PHONE_DISPLAY}
              </span>
              <span className="flex items-center gap-2">
                <Icon icon="mdi:email-outline" />
                {EMAIL}
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="mb-3 font-display text-[15px] font-bold text-white">Alamat</p>
            <p className="flex items-start gap-2 text-[14px] leading-relaxed text-[#bcb1a6]">
              <Icon icon="mdi:map-marker-outline" className="mt-0.5 shrink-0" />
              {ADDRESS}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[rgba(231,221,209,0.15)] pt-6 text-[13px] text-muted md:flex-row">
          <p>Copyright © 2026 LPKS Borneo Flasher Indonesia. All rights reserved.</p>
        </div>
      </div>

      <a
        href={waLink()}
        className="fixed right-[26px] bottom-[26px] z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-2xl text-white shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
        target="_blank"
        rel="noreferrer"
        title="Hubungi Admin"
      >
        <Icon icon="ic:baseline-whatsapp" />
      </a>
    </footer>
  );
}
