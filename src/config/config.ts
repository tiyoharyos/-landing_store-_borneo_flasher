export const BRAND_NAME = "LPKS Borneo Flasher Indonesia";
export const BRAND_SHORT = "Borneo Flasher";
export const WHATSAPP_NUMBER = "6281273417555";
export const WHATSAPP_TEXT =
  "Halo Admin Borneo Flasher, saya mau tanya-tanya soal produk yang ada di toko ini. Boleh dibantu?";
export const PHONE_DISPLAY = "0812-7341-7555";
export const EMAIL = "info@borneoflasher.id";
export const ADDRESS =
  "Rt 01 Rw 10, Banjarsari, Penggung, Boyolali, Jawa Tengah , Boyolali, Indonesia, Boyolali, Indonesia, 57316";

export const SOCIALS = {
  facebook: "https://www.facebook.com/BorneoFlasherIndonesia?locale=id_ID",
  instagram: "https://www.instagram.com/borneoflasherlpks/",
  youtube: "https://www.youtube.com/@borneoflasher",
  tiktok: "https://www.tiktok.com/@borne0flasher",
};

export const waLink = (text?: string) =>
  `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
    text || WHATSAPP_TEXT
  )}`;
