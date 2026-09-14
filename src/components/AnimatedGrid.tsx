import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_SMOOTH } from "@/lib/motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_SMOOTH } },
};

/**
 * Bungkus grid kartu (produk, dll) supaya muncul halus & bertahap saat masuk
 * viewport. Pakai IntersectionObserver di balik layar (whileInView) + hanya
 * transform/opacity, jadi murah secara render — sekali animasi per elemen,
 * bukan animasi yang terikat ke scroll.
 */
export default function AnimatedGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px", amount: 0.15 }}
      variants={container}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGridItem({ children }: { children: ReactNode }) {
  return <motion.div variants={item}>{children}</motion.div>;
}
