import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import ButtonLink from "@/components/ui/ButtonLink";
import FadeIn from "@/components/FadeIn";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center p-6 gap-2 bg-cream">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Icon icon="mdi:tools" width={64} className="text-brand" />
      </motion.div>
      <FadeIn delay={0.1} className="flex flex-col items-center gap-2">
        <h1 className="font-display font-extrabold text-[28px] mt-2 text-ink">404 — Halaman Tidak Ditemukan</h1>
        <p className="text-muted">
          Halaman yang kamu cari sudah pindah atau belum tersedia.
        </p>
        <ButtonLink to="/" className="mt-2">
          Kembali ke Beranda
        </ButtonLink>
      </FadeIn>
    </div>
  );
}
