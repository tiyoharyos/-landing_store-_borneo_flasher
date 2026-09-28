import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
  text: string;
};

export default function ShareDialog({ open, onClose, url, title, text }: Props) {
  const [copied, setCopied] = useState(false);

  // Tutup dengan tombol Escape + kunci scroll body saat dialog terbuka.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback untuk browser lama / konteks non-HTTPS.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enc = encodeURIComponent;
  const targets = [
    {
      label: "WhatsApp",
      icon: "mdi:whatsapp",
      color: "#25D366",
      href: `https://wa.me/?text=${enc(`${text}\n${url}`)}`,
    },
    {
      label: "Facebook",
      icon: "mdi:facebook",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      label: "X",
      icon: "ri:twitter-x-fill",
      color: "#000000",
      href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`,
    },
    {
      label: "Telegram",
      icon: "mdi:telegram",
      color: "#229ED9",
      href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
    },
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-ink/50 p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Bagikan produk"
            className="w-full sm:max-w-[400px] bg-surface rounded-t-2xl sm:rounded-2xl border border-line p-5"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-extrabold text-[1.05rem] text-ink">Bagikan Produk</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-cream-deep cursor-pointer transition-colors"
              >
                <Icon icon="mdi:close" width={20} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {targets.map((t) => (
                <a
                  key={t.label}
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <span
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-105"
                    style={{ backgroundColor: t.color }}
                  >
                    <Icon icon={t.icon} width={24} />
                  </span>
                  <span className="text-[11.5px] text-ink-soft">{t.label}</span>
                </a>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 border border-line rounded-[10px] bg-cream-deep pl-3 pr-1 py-1">
              <span className="flex-1 min-w-0 truncate text-[12.5px] text-muted">{url}</span>
              <button
                type="button"
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12.5px] font-bold cursor-pointer transition-colors ${
                  copied ? "bg-ok text-white" : "bg-brand text-white hover:opacity-90"
                }`}
              >
                <Icon icon={copied ? "mdi:check" : "mdi:link-variant"} width={16} />
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}