import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

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

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-ink/50 p-3 sm:p-5 overflow-y-auto"
      onMouseDown={onClose}
    >
      <div
        className="w-full bg-surface rounded-2xl shadow-xl my-6 sm:my-0 max-h-[90vh] flex flex-col"
        style={{ maxWidth }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line shrink-0">
          <p className="font-display font-extrabold text-[15px] text-ink">{title}</p>
          <button
            type="button"
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-none bg-transparent text-muted cursor-pointer hover:bg-cream-deep hover:text-ink transition-colors"
            onClick={onClose}
            aria-label="Tutup"
          >
            <Icon icon="mdi:close" width={20} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex flex-col gap-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
