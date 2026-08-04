import Swal from "sweetalert2";

// ==========================================================
// Alert kit — dialog konfirmasi & notifikasi pakai SweetAlert2
// langsung (tanpa wrapper/mixin custom).
// Untuk toast ringan (tambah ke keranjang, dsb), pakai
// `useToast()` dari "@/components/ui/Toast" alih-alih file ini.
// ==========================================================

interface BasicAlertOptions {
  title: string;
  text?: string;
  confirmText?: string;
}

export const alertSuccess = ({ title, text, confirmText = "Oke" }: BasicAlertOptions) =>
  Swal.fire({ icon: "success", title, text, confirmButtonText: confirmText });

export const alertError = ({ title, text, confirmText = "Oke" }: BasicAlertOptions) =>
  Swal.fire({ icon: "error", title, text, confirmButtonText: confirmText });

export const alertWarning = ({ title, text, confirmText = "Oke" }: BasicAlertOptions) =>
  Swal.fire({ icon: "warning", title, text, confirmButtonText: confirmText });

export const alertInfo = ({ title, text, confirmText = "Oke" }: BasicAlertOptions) =>
  Swal.fire({ icon: "info", title, text, confirmButtonText: confirmText });

interface ConfirmOptions {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  danger?: boolean;
}

export async function confirmDialog({
  title,
  text,
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
  icon = "question",
  danger = false,
}: ConfirmOptions): Promise<boolean> {
  const res = await Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: danger ? "#dc2626" : undefined,
  });
  return res.isConfirmed;
}

// Dialog khusus: minta user login dulu sebelum bisa lanjut (mis. sebelum
// menambahkan produk ke keranjang). Mengembalikan true jika user memilih
// untuk pergi ke halaman masuk.
export async function alertNeedLogin(): Promise<boolean> {
  const res = await Swal.fire({
    icon: "info",
    title: "Masuk dulu, yuk",
    text: "Kamu perlu masuk ke akun untuk menambahkan produk ke keranjang.",
    showCancelButton: true,
    confirmButtonText: "Masuk Sekarang",
    cancelButtonText: "Nanti Saja",
  });
  return res.isConfirmed;
}
