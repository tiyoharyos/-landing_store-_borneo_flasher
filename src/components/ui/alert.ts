import Swal from "sweetalert2";


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
