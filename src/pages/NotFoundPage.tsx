import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <Icon icon="mdi:tools" width={64} className="text-brand" />
      <h1 className="font-display font-extrabold text-[28px] mt-2">404 — Halaman Tidak Ditemukan</h1>
      <p className="text-muted">
        Halaman yang kamu cari sudah pindah atau belum tersedia.
      </p>
      <Link
        to="/"
        className="font-mono text-[13px] font-semibold px-6 py-3 rounded-full text-white mt-2 bg-brand hover:bg-brand-dark transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
