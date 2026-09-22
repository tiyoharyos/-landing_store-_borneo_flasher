import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import { EASE_POP } from "@/lib/motion";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  /** Lebar maksimum panel, default 480px */
  maxWidth?: number;
}

export default function Modal({ open, onClose, title, children, maxWidth = 480 }: ModalProps) {
  // Kunci scroll body selagi modal terbuka.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-overlay p-3 sm:p-5 overflow-y-auto"
          onMouseDown={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.div
            className="w-full bg-surface border border-line rounded-3xl shadow-[var(--shadow-lg)] my-6 sm:my-0 max-h-[90vh] flex flex-col"
            style={{ maxWidth, willChange: "opacity, transform" }}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ duration: 0.22, ease: EASE_POP }}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line shrink-0">
              <p className="font-display font-extrabold text-[15px] text-ink">{title}</p>
              <Button
                variant="ghost"
                size="sm"
                icon="mdi:close"
                className="w-8! h-8! p-0! rounded-full! shrink-0 text-muted"
                onClick={onClose}
                aria-label="Tutup"
              />
            </div>
            <div className="p-5 overflow-y-auto flex flex-col gap-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
