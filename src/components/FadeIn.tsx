import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_SMOOTH } from "@/lib/motion";

export default function FadeIn({
  children,
  delay = 0,
  y = 12,
  className = "",
  viewport = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  viewport?: boolean;
}) {
  const variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, delay, ease: EASE_SMOOTH },
    },
  };

  const viewportProps = viewport
    ? { whileInView: "show" as const, viewport: { once: true, margin: "-60px", amount: 0.2 } }
    : { animate: "show" as const };

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={variants}
      style={{ willChange: "opacity, transform" }}
      {...viewportProps}
    >
      {children}
    </motion.div>
  );
}
