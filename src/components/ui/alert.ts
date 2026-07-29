import Swal, { type SweetAlertIcon } from "sweetalert2";

// ==========================================================
// Alert kit — pembungkus SweetAlert2 dengan tampilan custom
// (mengikuti palet warna & font brand Borneo Flasher).
// Styling diatur lewat class di index.css (bagian "UI KIT: ALERT").
// ==========================================================

const swal = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: "ui-swal-popup",
    title: "ui-swal-title",
    htmlContainer: "ui-swal-text",
    icon: "ui-swal-icon",
    confirmButton: "ui-btn ui-btn-primary ui-btn-md",
    cancelButton: "ui-btn ui-btn-subtle ui-btn-md",
    actions: "ui-swal-actions",
  },
});

interface BasicAlertOptions {
  title: string;
  text?: string;
  confirmText?: string;
}

function fire(icon: SweetAlertIcon, { title, text, confirmText = "Oke" }: BasicAlertOptions) {
  return swal.fire({
    icon,
    title,
    text,
    confirmButtonText: confirmText,
  });
}

export const alertSuccess = (opts: BasicAlertOptions) => fire("success", opts);
export const alertError = (opts: BasicAlertOptions) => fire("error", opts);
export const alertWarning = (opts: BasicAlertOptions) => fire("warning", opts);
export const alertInfo = (opts: BasicAlertOptions) => fire("info", opts);

interface ConfirmOptions {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: SweetAlertIcon;
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
  const res = await swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup: "ui-swal-popup",
      title: "ui-swal-title",
      htmlContainer: "ui-swal-text",
      icon: "ui-swal-icon",
      confirmButton: `ui-btn ${danger ? "ui-btn-danger" : "ui-btn-primary"} ui-btn-md`,
      cancelButton: "ui-btn ui-btn-subtle ui-btn-md",
      actions: "ui-swal-actions",
    },
  });
  return res.isConfirmed;
}

// Toast kecil di pojok kanan atas — untuk notifikasi ringan (tambah ke
// keranjang, item dihapus, dsb) yang tidak butuh interaksi user.
const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  buttonsStyling: false,
  customClass: {
    popup: "ui-swal-toast",
    title: "ui-swal-toast-title",
    icon: "ui-swal-icon",
  },
  didOpen: (el) => {
    el.addEventListener("mouseenter", Swal.stopTimer);
    el.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const toastSuccess = (title: string) => toast.fire({ icon: "success", title });
export const toastError = (title: string) => toast.fire({ icon: "error", title });
export const toastInfo = (title: string) => toast.fire({ icon: "info", title });

// Dialog khusus: minta user login dulu sebelum bisa lanjut (mis. sebelum
// menambahkan produk ke keranjang). Mengembalikan true jika user memilih
// untuk pergi ke halaman masuk.
export async function alertNeedLogin(nextPath?: string): Promise<boolean> {
  const res = await swal.fire({
    icon: "info",
    title: "Masuk dulu, yuk",
    text: "Kamu perlu masuk ke akun untuk menambahkan produk ke keranjang.",
    showCancelButton: true,
    confirmButtonText: "Masuk Sekarang",
    cancelButtonText: "Nanti Saja",
    customClass: {
      popup: "ui-swal-popup",
      title: "ui-swal-title",
      htmlContainer: "ui-swal-text",
      icon: "ui-swal-icon",
      confirmButton: "ui-btn ui-btn-primary ui-btn-md",
      cancelButton: "ui-btn ui-btn-subtle ui-btn-md",
      actions: "ui-swal-actions",
    },
  });
  void nextPath;
  return res.isConfirmed;
}
