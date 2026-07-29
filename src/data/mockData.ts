// ==========================================================
// MOCK DATA — Borneo Flasher Store
// Nama produk & harga mengacu ke borneoflasher.com/LandingStore
// (di-parafrase/dirapikan, gambar pakai URL asli sebagai ilustrasi)
// ==========================================================

export interface Category {
  slug: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { slug: "semua", name: "Semua Produk", icon: "mdi:view-grid-outline" },
  { slug: "sparepart-iphone", name: "Sparepart iPhone", icon: "mdi:cellphone-cog" },
  { slug: "sparepart-android", name: "Sparepart Android", icon: "mdi:android" },
  { slug: "tools-service", name: "Tools & Alat Servis", icon: "mdi:tools" },
  { slug: "consumable", name: "Consumable & Bahan Servis", icon: "mdi:flask-outline" },
  { slug: "merchandise", name: "Merchandise", icon: "mdi:tshirt-crew-outline" },
  { slug: "lelang", name: "Barang Lelang / Bekas", icon: "mdi:gavel" },
  { slug: "lainnya", name: "Alat Tulis & Lainnya", icon: "mdi:pencil-outline" },
];

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export interface Product {
  id: string;
  name: string;
  price: number;
  priceOriginal?: number;
  category: Exclude<CategorySlug, "semua">;
  image: string;
  stock: number;
  sold: number;
  rating: number;
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/500/500`;

export const PRODUCTS: Product[] = [
  // ---------- Sparepart iPhone ----------
  { id: "p01", name: "Diagnostic Cable DCSD iPhone", price: 120000, category: "sparepart-iphone", image: img("dcsd-cable"), stock: 14, sold: 88, rating: 4.8 },
  { id: "p02", name: "Flexy FPC iPhone (Flexible Speaker)", price: 195000, priceOriginal: 230000, category: "sparepart-iphone", image: img("flexy-fpc"), stock: 9, sold: 41, rating: 4.7 },
  { id: "p03", name: "Front Camera iPhone 12/12 Pro", price: 50000, category: "sparepart-iphone", image: img("front-cam-ip12"), stock: 22, sold: 130, rating: 4.9 },
  { id: "p04", name: "JC Face ID Dot Projector iPhone 12/12 Pro", price: 150000, category: "sparepart-iphone", image: img("faceid-dot"), stock: 6, sold: 27, rating: 4.6 },
  { id: "p05", name: "Kabel Boot Mechanic S24 Max", price: 235000, category: "sparepart-iphone", image: img("kabel-boot-s24"), stock: 11, sold: 19, rating: 4.5 },
  { id: "p06", name: "Mesin iPhone 11 No Nand", price: 130000, category: "sparepart-iphone", image: img("mesin-ip11"), stock: 5, sold: 64, rating: 4.7 },
  { id: "p07", name: "Mesin iPhone X (No Nand)", price: 150000, priceOriginal: 175000, category: "sparepart-iphone", image: img("mesin-ipx"), stock: 8, sold: 52, rating: 4.6 },
  { id: "p08", name: "CNC With Nand iPhone 12 4G", price: 310000, category: "sparepart-iphone", image: img("cnc-ip12"), stock: 3, sold: 15, rating: 4.9 },
  { id: "p09", name: "Plat BGA iPhone IP14-A16", price: 60000, category: "sparepart-iphone", image: img("plat-bga-ip14"), stock: 30, sold: 210, rating: 4.8 },
  { id: "p10", name: "Mesin iCloud iPhone 13 PM 4G", price: 485000, category: "sparepart-iphone", image: img("icloud-ip13"), stock: 4, sold: 12, rating: 4.9 },
  { id: "p11", name: "Mesin iCloud iPhone 14 4G", price: 495000, category: "sparepart-iphone", image: img("icloud-ip14"), stock: 2, sold: 8, rating: 5.0 },
  { id: "p12", name: "Lock iCloud iPhone 15 Pro (ANP)", price: 525000, category: "sparepart-iphone", image: img("lock-icloud-ip15"), stock: 3, sold: 6, rating: 4.7 },
  { id: "p13", name: "Pretelan iPhone 11 No Nand (ANP)", price: 130000, priceOriginal: 155000, category: "sparepart-iphone", image: img("pretelan-ip11"), stock: 10, sold: 33, rating: 4.6 },
  { id: "p14", name: "Set Camera Depan/IR Cam/Sensor (Face ID)", price: 100000, category: "sparepart-iphone", image: img("faceid-set"), stock: 17, sold: 45, rating: 4.7 },

  // ---------- Sparepart Android ----------
  { id: "p20", name: "Mesin Redmi 5A Utuh (BP)", price: 110000, category: "sparepart-android", image: img("mesin-redmi5a"), stock: 12, sold: 58, rating: 4.6 },
  { id: "p21", name: "Mesin Redmi 9A/9C", price: 110000, category: "sparepart-android", image: img("mesin-redmi9a"), stock: 9, sold: 40, rating: 4.5 },
  { id: "p22", name: "Mesin Oppo A5S", price: 150000, category: "sparepart-android", image: img("mesin-oppo-a5s"), stock: 7, sold: 22, rating: 4.4 },
  { id: "p23", name: "Mesin Vivo Y91", price: 130000, category: "sparepart-android", image: img("mesin-vivo-y91"), stock: 6, sold: 19, rating: 4.5 },
  { id: "p24", name: "Plat BGA Xiaomi Mi 7", price: 60000, category: "sparepart-android", image: img("plat-bga-mi7"), stock: 25, sold: 95, rating: 4.7 },
  { id: "p25", name: "Plat Qualcomm CPU", price: 60000, priceOriginal: 75000, category: "sparepart-android", image: img("plat-qualcomm"), stock: 18, sold: 76, rating: 4.6 },
  { id: "p26", name: "Plat AMOE MT6 MediaTek", price: 60000, category: "sparepart-android", image: img("plat-amoe-mt6"), stock: 20, sold: 61, rating: 4.5 },
  { id: "p27", name: "Mesin HP Tipe Random (Bongkaran)", price: 45000, category: "sparepart-android", image: img("mesin-random"), stock: 40, sold: 150, rating: 4.3 },
  { id: "p28", name: "Plat Universal Servis", price: 60000, category: "sparepart-android", image: img("plat-universal"), stock: 15, sold: 48, rating: 4.6 },

  // ---------- Tools & Alat Servis ----------
  { id: "p30", name: "Bor Fleksibel MM-25000", price: 450000, priceOriginal: 520000, category: "tools-service", image: img("bor-mm25000"), stock: 4, sold: 21, rating: 4.9 },
  { id: "p31", name: "Fixing Tools PCB Holder", price: 300000, category: "tools-service", image: img("pcb-holder"), stock: 6, sold: 30, rating: 4.8 },
  { id: "p32", name: "Multitester RF4 (RF-17N)", price: 400000, category: "tools-service", image: img("multitester-rf4"), stock: 5, sold: 17, rating: 4.9 },
  { id: "p33", name: "Kabel Power Supply Laptop 34in1", price: 425000, category: "tools-service", image: img("psu-laptop-34in1"), stock: 8, sold: 26, rating: 4.7 },
  { id: "p34", name: "Lampu Microscope LED Dimmable", price: 220000, category: "tools-service", image: img("lampu-microscope"), stock: 10, sold: 34, rating: 4.8 },
  { id: "p35", name: "Obeng Mijing LS-11 5in1", price: 170000, category: "tools-service", image: img("obeng-mijing"), stock: 13, sold: 55, rating: 4.7 },
  { id: "p36", name: "Opening Tools Profesional TE-06 3in1", price: 75000, category: "tools-service", image: img("opening-tools"), stock: 20, sold: 70, rating: 4.6 },
  { id: "p37", name: "Blower Youkiloon 858", price: 360000, priceOriginal: 420000, category: "tools-service", image: img("blower-858"), stock: 6, sold: 24, rating: 4.8 },
  { id: "p38", name: "Solder Wemon T23", price: 570000, category: "tools-service", image: img("solder-t23"), stock: 3, sold: 11, rating: 4.9 },
  { id: "p39", name: "PSU Sunshine P-1502A", price: 300000, category: "tools-service", image: img("psu-sunshine"), stock: 7, sold: 20, rating: 4.7 },
  { id: "p40", name: "Ragum YCS YHKJ Bulat", price: 270000, category: "tools-service", image: img("ragum-ycs"), stock: 9, sold: 29, rating: 4.6 },
  { id: "p41", name: "Kamera Forward 4K FW-C03", price: 1500000, category: "tools-service", image: img("camera-forward-4k"), stock: 2, sold: 5, rating: 5.0 },
  { id: "p42", name: "USB Schematics Forward FW-P01", price: 300000, category: "tools-service", image: img("usb-schematics"), stock: 4, sold: 13, rating: 4.8 },
  { id: "p43", name: "Pinset Runcing Bengkok Youkiloon ST-FX-15", price: 75000, category: "tools-service", image: img("pinset-runcing"), stock: 25, sold: 88, rating: 4.7 },
  { id: "p44", name: "Tang Potong Kaigexin K-109", price: 35000, category: "tools-service", image: img("tang-potong"), stock: 30, sold: 102, rating: 4.6 },

  // ---------- Consumable & Bahan Servis ----------
  { id: "p50", name: "Botol Tiner WTS-001 50ml Tanpa Tutup", price: 10000, category: "consumable", image: img("botol-tiner-50ml"), stock: 60, sold: 320, rating: 4.7 },
  { id: "p51", name: "Flux Kingbo RMA-218", price: 135000, category: "consumable", image: img("flux-kingbo"), stock: 22, sold: 90, rating: 4.8 },
  { id: "p52", name: "Lem UV Mr. Yang Green", price: 35000, category: "consumable", image: img("lem-uv-green"), stock: 45, sold: 210, rating: 4.6 },
  { id: "p53", name: "Kawat Jumper GSM Source GS-998 0,01mm", price: 60000, category: "consumable", image: img("kawat-jumper-gsm"), stock: 33, sold: 130, rating: 4.7 },
  { id: "p54", name: "Timah Gulung Paragon 0.8/10m", price: 30000, category: "consumable", image: img("timah-paragon"), stock: 50, sold: 250, rating: 4.8 },
  { id: "p55", name: "Timah Pasta Borneo 25gr", price: 55000, category: "consumable", image: img("timah-pasta-borneo"), stock: 28, sold: 140, rating: 4.9 },
  { id: "p56", name: "Soldering Paste 50/150g", price: 40000, priceOriginal: 48000, category: "consumable", image: img("soldering-paste"), stock: 26, sold: 96, rating: 4.6 },
  { id: "p57", name: "Rosin Kecil", price: 6000, category: "consumable", image: img("rosin-kecil"), stock: 100, sold: 400, rating: 4.5 },
  { id: "p58", name: "Thermal Pasta Suntik HY510", price: 25000, category: "consumable", image: img("thermal-pasta"), stock: 40, sold: 175, rating: 4.7 },
  { id: "p59", name: "Cairan Tiner IPA", price: 50000, category: "consumable", image: img("tiner-ipa"), stock: 24, sold: 100, rating: 4.6 },
  { id: "p60", name: "Isolasi Anti Panas 15mm Jaring", price: 35000, category: "consumable", image: img("isolasi-panas"), stock: 32, sold: 88, rating: 4.5 },

  // ---------- Merchandise ----------
  { id: "p70", name: "Kaos Borneo Flasher Kelas Offline Hitam L", price: 100000, category: "merchandise", image: img("kaos-offline-l"), stock: 15, sold: 62, rating: 4.9 },
  { id: "p71", name: "Kaos Borneo Schematics Hitam L", price: 100000, category: "merchandise", image: img("kaos-schematics-l"), stock: 12, sold: 40, rating: 4.8 },
  { id: "p72", name: "Kaos Polo Alumni Grey L", price: 125000, category: "merchandise", image: img("polo-alumni-grey"), stock: 10, sold: 30, rating: 4.7 },
  { id: "p73", name: "Kemeja Alumni Lengan Pendek L", price: 200000, category: "merchandise", image: img("kemeja-alumni"), stock: 8, sold: 21, rating: 4.8 },
  { id: "p74", name: "Jaket BFI Taslan L", price: 250000, priceOriginal: 290000, category: "merchandise", image: img("jaket-bfi-taslan"), stock: 6, sold: 18, rating: 4.9 },
  { id: "p75", name: "Kaos BFI Logo Putih Depan L", price: 100000, category: "merchandise", image: img("kaos-bfi-putih"), stock: 14, sold: 35, rating: 4.7 },
  { id: "p76", name: "Kaos BFI Consistent L", price: 100000, category: "merchandise", image: img("kaos-bfi-consistent"), stock: 13, sold: 28, rating: 4.6 },

  // ---------- Barang Lelang / Bekas ----------
  { id: "p80", name: "Microscope Universe (Lelang)", price: 1900000, priceOriginal: 2400000, category: "lelang", image: img("microscope-universe"), stock: 1, sold: 3, rating: 4.9 },
  { id: "p81", name: "Microscope Onglai M3-B3 (Lelang)", price: 1800000, priceOriginal: 2300000, category: "lelang", image: img("microscope-onglai"), stock: 1, sold: 2, rating: 4.8 },
  { id: "p82", name: "Blower Sugon 2020D (Lelang)", price: 800000, priceOriginal: 1100000, category: "lelang", image: img("blower-sugon"), stock: 2, sold: 4, rating: 4.7 },
  { id: "p83", name: "Blower Quick 2008 (Lelang)", price: 700000, priceOriginal: 950000, category: "lelang", image: img("blower-quick"), stock: 1, sold: 1, rating: 4.6 },
  { id: "p84", name: "Solder OSS Team T210 (Lelang)", price: 400000, priceOriginal: 600000, category: "lelang", image: img("solder-oss-team"), stock: 2, sold: 5, rating: 4.7 },
  { id: "p85", name: "PSU Yihua 1503D (Lelang)", price: 300000, priceOriginal: 450000, category: "lelang", image: img("psu-yihua"), stock: 1, sold: 2, rating: 4.8 },

  // ---------- Alat Tulis & Lainnya ----------
  { id: "p90", name: "Pulpen Standard", price: 4000, category: "lainnya", image: img("pulpen-standard"), stock: 200, sold: 500, rating: 4.5 },
  { id: "p91", name: "Buku Tulis 38 Lembar", price: 5000, category: "lainnya", image: img("buku-tulis"), stock: 150, sold: 300, rating: 4.6 },
  { id: "p92", name: "Note Book A5", price: 25000, category: "lainnya", image: img("notebook-a5"), stock: 40, sold: 90, rating: 4.7 },
  { id: "p93", name: "Stiker Borneo Flasher Panjang", price: 10000, category: "lainnya", image: img("stiker-panjang"), stock: 80, sold: 220, rating: 4.8 },
  { id: "p94", name: "Kain Microfiber", price: 12000, category: "lainnya", image: img("kain-microfiber"), stock: 60, sold: 140, rating: 4.6 },
];

// -----------------------------
// Banner promo (carousel)
// -----------------------------
export const BANNERS = [
  { image: "https://picsum.photos/seed/promo-banner-1/1200/380", title: "Diskon Sparepart iPhone & Android" },
  { image: "https://picsum.photos/seed/promo-banner-2/1200/380", title: "Tools Servis Lengkap, Harga Bersahabat" },
  { image: "https://picsum.photos/seed/promo-banner-3/1200/380", title: "Merchandise Alumni Borneo Flasher" },
];

// -----------------------------
// Metode pembayaran & pengiriman (mock)
// -----------------------------
export const PAYMENT_METHODS = [
  { key: "bca", name: "Transfer BCA" },
  { key: "bni", name: "Transfer BNI" },
  { key: "bri", name: "Transfer BRI" },
  { key: "mandiri", name: "Transfer Mandiri" },
  { key: "paypal", name: "PayPal" },
];

export const SHIPPING_METHODS = [
  { key: "jne", name: "JNE Reguler", eta: "2-4 hari", price: 15000 },
  { key: "jnt", name: "J&T Express", eta: "2-3 hari", price: 14000 },
  { key: "gosend", name: "GoSend (Instant)", eta: "±60 menit", price: 20000 },
  { key: "grab", name: "GrabExpress", eta: "±60 menit", price: 22000 },
];

// -----------------------------
// Helpers
// -----------------------------
export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export const discountPercent = (p: Product) =>
  p.priceOriginal ? Math.round(100 - (p.price / p.priceOriginal) * 100) : 0;

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id) ?? null;

export const searchAndFilterProducts = (query: string, category: CategorySlug) => {
  const q = query.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const matchCategory = category === "semua" ? true : p.category === category;
    const matchQuery = q ? p.name.toLowerCase().includes(q) : true;
    return matchCategory && matchQuery;
  });
};
