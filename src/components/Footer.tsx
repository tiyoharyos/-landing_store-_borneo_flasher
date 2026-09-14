import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Logo from "./Logo";
import { ExternalButtonLink } from "@/components/ui/ButtonLink";
import { ADDRESS, EMAIL, PHONE_DISPLAY, SOCIALS, waLink } from "@/config/config";

const SOCIAL_ICONS: { key: keyof typeof SOCIALS; icon: string }[] = [
  { key: "facebook", icon: "mdi:facebook" },
  { key: "instagram", icon: "mdi:instagram" },
  { key: "youtube", icon: "mdi:youtube" },
  { key: "tiktok", icon: "ic:baseline-tiktok" },
];

const MAPS_LINK = "https://maps.app.goo.gl/S1aJNh1cRAmLpoqF7";

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
                <ExternalButtonLink
                  key={s.key}
                  href={SOCIALS[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  icon={s.icon}
                  aria-label={s.key}
                  className="w-[38px]! h-[38px]! p-0! rounded-full! hover:bg-brand! hover:border-brand! hover:text-white! hover:-translate-y-0.5 hover:shadow-[var(--shadow-brand)]"
                />
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
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 text-[14px] leading-relaxed text-muted transition-colors duration-200 hover:text-brand"
            >
              <Icon icon="mdi:map-marker-outline" className="flex-shrink-0 mt-0.5 text-brand" />
              {ADDRESS}
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-10 pt-6 text-[13px] border-t border-line text-muted text-center md:text-left transition-colors duration-200">
          <p>Copyright © 2026 LPKS Borneo Flasher Indonesia. All rights reserved.</p>
        </div>
      </div>

      <ExternalButtonLink
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        title="Hubungi Admin"
        variant="primary"
        icon="ic:baseline-whatsapp"
        className="fixed! w-12! h-12! md:w-14! md:h-14! p-0! bottom-4 right-4 md:bottom-[26px] md:right-[26px] bg-[#25d366]! border-[#25d366]! rounded-full! text-xl md:text-2xl shadow-[0_10px_24px_rgba(37,211,102,0.35)] z-[100] hover:scale-110 hover:bg-[#25d366]! hover:border-[#25d366]! hover:shadow-[0_14px_30px_rgba(37,211,102,0.45)] active:scale-100"
      />
    </footer>
  );
}