export const BRAND_NAME = "LPKS Borneo Flasher Indonesia";
export const BRAND_SHORT = "Borneo Flasher";
export const WHATSAPP_NUMBER = "6285377767777";
export const WHATSAPP_TEXT =
  "Halo admin, saya ingin tahu lebih lanjut tentang jadwal dan biaya kelas training.";
export const PHONE_DISPLAY = "0853-7776-7777";
export const EMAIL = "info@borneoflasher.id";
export const ADDRESS =
  "Banjarsari, RT.001/010, Dusun 1, Penggung, Kec. Boyolali, Kabupaten Boyolali, Jawa Tengah 57316";

export const SOCIALS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  tiktok: "https://tiktok.com",
};

export const waLink = (text?: string) =>
  `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
    text || WHATSAPP_TEXT
  )}`;
