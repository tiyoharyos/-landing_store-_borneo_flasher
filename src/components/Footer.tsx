import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Logo from "./Logo";
import { ADDRESS, EMAIL, PHONE_DISPLAY, SOCIALS, waLink } from "@/config/config";

const SOCIAL_ICONS: { key: keyof typeof SOCIALS; icon: string }[] = [
  { key: "facebook", icon: "mdi:facebook" },
  { key: "instagram", icon: "mdi:instagram" },
  { key: "youtube", icon: "mdi:youtube" },
  { key: "tiktok", icon: "ic:baseline-tiktok" },
];

export default function Footer() {
  return (
    <footer className="bg-cream-deep text-ink mt-auto relative border-t border-line transition-colors duration-200">
      {/* Padding Y diperkecil saat mobile (py-8) dan kembali normal di desktop (md:py-14) */}
      <div className="container py-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <div className="md:col-span-4">
            <Logo className="mb-4" />
            <p className="mt-4 text-[14px] leading-relaxed text-muted">
              Borneo Flasher Indonesia menghadirkan marketplace terpercaya untuk
              kebutuhan sparepart smartphone, alat servis, dan perlengkapan teknisi
              dengan produk berkualitas serta harga terbaik.
            </p>
            <div className="flex gap-2 mt-5">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.key}
                  href={SOCIALS[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  className="w-[38px] h-[38px] rounded-full border border-line flex items-center justify-center text-ink-soft transition-all duration-200 hover:bg-brand hover:border-brand hover:text-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-brand)]"
                  aria-label={s.key}
                >
                  <Icon icon={s.icon} width={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="font-display font-bold text-ink mb-3 text-[15px]">Menu</p>
            <div className="flex flex-col gap-2 text-[14px] text-muted">
              <Link to="/" className="w-fit transition-colors duration-200 hover:text-brand">Beranda</Link>
              <Link to="/kategori/alat-tools" className="w-fit transition-colors duration-200 hover:text-brand">Alat & Tools</Link>
              <Link to="/kategori/sparepart-iphone" className="w-fit transition-colors duration-200 hover:text-brand">Sparepart iPhone</Link>
              <Link to="/keranjang" className="w-fit transition-colors duration-200 hover:text-brand">Keranjang</Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-display font-bold text-ink mb-3 text-[15px]">Kontak</p>
            <div className="flex flex-col gap-2.5 text-[14px] text-muted">
              <span className="flex items-center gap-2">
                <Icon icon="mdi:phone-outline" className="text-brand" />
                {PHONE_DISPLAY}
              </span>
              <span className="flex items-center gap-2">
                <Icon icon="mdi:email-outline" className="text-brand" />
                {EMAIL}
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-display font-bold text-ink mb-3 text-[15px]">Alamat</p>
            <p className="flex items-start gap-2 text-[14px] leading-relaxed text-muted">
              <Icon icon="mdi:map-marker-outline" className="flex-shrink-0 mt-0.5 text-brand" />
              {ADDRESS}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-10 pt-6 text-[13px] border-t border-line text-muted text-center md:text-left transition-colors duration-200">
          <p>Copyright © 2026 LPKS Borneo Flasher Indonesia. All rights reserved.</p>
        </div>
      </div>

      <a
        href={waLink()}
        className="fixed w-12 h-12 md:w-14 md:h-14 bottom-4 right-4 md:bottom-[26px] md:right-[26px] bg-[#25d366] text-white rounded-full flex items-center justify-center text-xl md:text-2xl shadow-[0_10px_24px_rgba(37,211,102,0.35)] z-[100] transition-all duration-200 ease-out hover:scale-110 hover:shadow-[0_14px_30px_rgba(37,211,102,0.45)] active:scale-100"
        target="_blank"
        rel="noreferrer"
        title="Hubungi Admin"
      >
        <Icon icon="ic:baseline-whatsapp" />
      </a>
    </footer>
  );
}