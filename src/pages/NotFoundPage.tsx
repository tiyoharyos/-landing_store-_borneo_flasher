import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function NotFoundPage() {
  return (
    <div className="notfound">
      <Icon icon="mdi:tools" width={64} style={{ color: "var(--brand)" }} />
      <h1 className="font-display font-extrabold text-[28px] mt-2">404 — Halaman Tidak Ditemukan</h1>
      <p style={{ color: "var(--muted)" }}>
        Halaman yang kamu cari sudah pindah atau belum tersedia.
      </p>
      <Link
        to="/"
        className="font-mono text-[13px] font-semibold px-6 py-3 rounded-full text-white mt-2"
        style={{ background: "var(--brand)" }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
