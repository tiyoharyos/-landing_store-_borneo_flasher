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
    <footer className="site-footer">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <img src={logoLpks} alt="LPKS Borneo Flasher" className="h-10 w-auto" />
            <p className="mt-4 text-[14px] leading-relaxed" style={{ color: "#bcb1a6" }}>
              Awali kesuksesan belajarmu bersama LPKS Borneo Flasher Indonesia —
              dari nol sampai mahir, dibimbing sampai siap kerja.
            </p>
            <div className="flex gap-2 mt-5">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.key}
                  href={SOCIALS[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social"
                  aria-label={s.key}
                >
                  <Icon icon={s.icon} width={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="font-display font-bold text-white mb-3 text-[15px]">Menu</p>
            <div className="flex flex-col gap-2 text-[14px]" style={{ color: "#bcb1a6" }}>
              <Link to="/">Beranda</Link>
              <Link to="/kategori/alat-tools">Alat & Tools</Link>
              <Link to="/kategori/sparepart-iphone">Sparepart iPhone</Link>
              <Link to="/keranjang">Keranjang</Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-display font-bold text-white mb-3 text-[15px]">Kontak</p>
            <div className="flex flex-col gap-2.5 text-[14px]" style={{ color: "#bcb1a6" }}>
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
            <p className="font-display font-bold text-white mb-3 text-[15px]">Alamat</p>
            <p className="flex items-start gap-2 text-[14px] leading-relaxed" style={{ color: "#bcb1a6" }}>
              <Icon icon="mdi:map-marker-outline" className="flex-shrink-0 mt-0.5" />
              {ADDRESS}
            </p>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row justify-between items-center gap-3 mt-10 pt-6 text-[13px]"
          style={{ borderTop: "1px solid rgba(231,221,209,0.15)", color: "#8a8078" }}
        >
          <p>Copyright © 2026 LPKS Borneo Flasher Indonesia. All rights reserved.</p>
        </div>
      </div>

      <a
        href={waLink()}
        className="wa-float"
        target="_blank"
        rel="noreferrer"
        title="Hubungi Admin"
      >
        <Icon icon="ic:baseline-whatsapp" />
      </a>
    </footer>
  );
}
