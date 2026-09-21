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
    <footer className="relative mt-auto border-t border-line bg-[#f5f5f7] text-ink transition-colors duration-200 dark:bg-[#111214]">
      <div className="container py-8 md:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <Logo className="mb-4" />
            <p className="mt-4 text-[14px] leading-relaxed text-muted">
              Borneo Flasher Indonesia menghadirkan marketplace terpercaya untuk kebutuhan sparepart
              smartphone, alat servis, dan perlengkapan teknisi dengan produk berkualitas serta harga
              terbaik.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIAL_ICONS.map((s) => (
                <ExternalButtonLink
                  key={s.key}
                  href={SOCIALS[s.key]}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  icon={s.icon}
                  aria-label={s.key}
                  className="h-[38px]! w-[38px]! rounded-full! border-line! bg-white! p-0! text-ink-soft! shadow-sm! hover:-translate-y-0.5 hover:border-brand! hover:bg-brand hover:text-white! hover:shadow-[var(--shadow-brand)]"
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="mb-3 font-display text-[15px] font-bold text-ink">Menu</p>
            <div className="flex flex-col gap-2 text-[14px] text-muted">
              <Link to="/" className="w-fit transition-colors duration-200 hover:text-brand">Beranda</Link>
              <Link to="/kategori/alat-tools" className="w-fit transition-colors duration-200 hover:text-brand">
                Alat & Tools
              </Link>
              <Link to="/kategori/sparepart-iphone" className="w-fit transition-colors duration-200 hover:text-brand">
                Sparepart iPhone
              </Link>
              <Link to="/keranjang" className="w-fit transition-colors duration-200 hover:text-brand">
                Keranjang
              </Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="mb-3 font-display text-[15px] font-bold text-ink">Kontak</p>
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
            <p className="mb-3 font-display text-[15px] font-bold text-ink">Alamat</p>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 text-[14px] leading-relaxed text-muted transition-colors duration-200 hover:text-brand"
            >
              <Icon icon="mdi:map-marker-outline" className="mt-0.5 flex-shrink-0 text-brand" />
              {ADDRESS}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-center text-[13px] text-muted md:flex-row md:text-left">
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
        className="fixed! bottom-4 right-4 z-[100] h-12! w-12! rounded-full! border-[#25d366]! bg-[#25d366]! p-0! text-xl shadow-[0_10px_24px_rgba(37,211,102,0.35)] hover:scale-110 hover:border-[#25d366]! hover:bg-[#25d366]! hover:shadow-[0_14px_30px_rgba(37,211,102,0.45)] active:scale-100 md:bottom-[26px] md:right-[26px] md:h-14! md:w-14! md:text-2xl"
      />
    </footer>
  );
}