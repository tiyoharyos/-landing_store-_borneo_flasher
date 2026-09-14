import { Icon } from "@iconify/react";
import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center p-6 gap-2 bg-cream">
      <Icon icon="mdi:tools" width={64} className="text-brand" />
      <h1 className="font-display font-extrabold text-[28px] mt-2 text-ink">404 — Halaman Tidak Ditemukan</h1>
      <p className="text-muted">
        Halaman yang kamu cari sudah pindah atau belum tersedia.
      </p>
      <ButtonLink to="/" className="mt-2">
        Kembali ke Beranda
      </ButtonLink>
    </div>
  );
}
