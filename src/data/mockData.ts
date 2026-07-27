// ==========================================================
// MOCK DATA — GadgetShop
// Semua data di file ini menggantikan response API asli
// (dulunya dari https://api.gadgetcare.co.id/v1)
// ==========================================================

export interface Product {
  id: number;
  nama_produk: string;
  stock: number;
  harga_khusus: number;
}

export interface Mitra {
  id: number;
  name: string;
  masking_name: string;
  address: string;
  phone: string;
}

export interface MitraDetail extends Mitra {
  whatsapp: string;
}

export interface Sosmed {
  facebook: string;
  instagram: string;
  whatsapp: string;
}

// -----------------------------
// Produk (dipakai fitur pencarian di halaman utama & halaman mitra)
// -----------------------------
export const PRODUCTS: Product[] = [
  { id: 1, nama_produk: "LCD iPhone 11 Original", stock: 12, harga_khusus: 850000 },
  { id: 2, nama_produk: "LCD iPhone 13 Pro Max OLED", stock: 0, harga_khusus: 2150000 },
  { id: 3, nama_produk: "Baterai Samsung A32 Original", stock: 25, harga_khusus: 175000 },
  { id: 4, nama_produk: "Konektor Charger iPhone X", stock: 40, harga_khusus: 45000 },
  { id: 5, nama_produk: "Kaca Belakang Samsung S21", stock: 8, harga_khusus: 320000 },
  { id: 6, nama_produk: "Tool Kit Service HP 25in1", stock: 60, harga_khusus: 95000 },
  { id: 7, nama_produk: "Lem UV Perekat LCD 50ml", stock: 100, harga_khusus: 38000 },
  { id: 8, nama_produk: "Baterai iPhone 12 Original", stock: 15, harga_khusus: 265000 },
  { id: 9, nama_produk: "Flexible Power Button Xiaomi Redmi Note 10", stock: 30, harga_khusus: 28000 },
  { id: 10, nama_produk: "LCD Xiaomi Redmi Note 11 Fullset", stock: 0, harga_khusus: 610000 },
  { id: 11, nama_produk: "IC Power iPhone 8", stock: 18, harga_khusus: 55000 },
  { id: 12, nama_produk: "Mesin Bor Fleksibel Mata Halus", stock: 22, harga_khusus: 145000 },
  { id: 13, nama_produk: "Solder Uap Blower Digital 858D", stock: 9, harga_khusus: 385000 },
  { id: 14, nama_produk: "Kabel Fleksibel Home Button iPhone 7", stock: 45, harga_khusus: 32000 },
  { id: 15, nama_produk: "Tempered Glass Universal 6.5 inch", stock: 200, harga_khusus: 12000 },
];

// -----------------------------
// Mitra / Partner store
// -----------------------------
export const MITRA_LIST: Mitra[] = [
  {
    id: 1,
    name: "GadgetCare Cikarang",
    masking_name: "gadgetcare-cikarang",
    address: "Jl. Raya Cikarang No. 88, Cikarang Selatan, Bekasi",
    phone: "81234567890",
  },
  {
    id: 2,
    name: "Sparepart Jaya Bandung",
    masking_name: "sparepart-jaya-bandung",
    address: "Jl. Asia Afrika No. 12, Bandung, Jawa Barat",
    phone: "82233445566",
  },
  {
    id: 3,
    name: "Mega Ponsel Surabaya",
    masking_name: "mega-ponsel-surabaya",
    address: "Jl. Diponegoro No. 45, Surabaya, Jawa Timur",
    phone: "85566778899",
  },
  {
    id: 4,
    name: "Service Center Semarang",
    masking_name: "service-center-semarang",
    address: "Jl. Pandanaran No. 21, Semarang, Jawa Tengah",
    phone: "87788990011",
  },
  {
    id: 5,
    name: "Toko Ponsel Medan Jaya",
    masking_name: "ponsel-medan-jaya",
    address: "Jl. Gatot Subroto No. 9, Medan, Sumatera Utara",
    phone: "81122334455",
  },
  {
    id: 6,
    name: "Gadget Store Makassar",
    masking_name: "gadget-store-makassar",
    address: "Jl. Sultan Alauddin No. 3, Makassar, Sulawesi Selatan",
    phone: "89900112233",
  },
  {
    id: 7,
    name: "Solusi Ponsel Yogyakarta",
    masking_name: "solusi-ponsel-yogyakarta",
    address: "Jl. Malioboro No. 7, Yogyakarta",
    phone: "85511223344",
  },
  {
    id: 8,
    name: "Sinar Elektronik Palembang",
    masking_name: "sinar-elektronik-palembang",
    address: "Jl. Sudirman No. 18, Palembang, Sumatera Selatan",
    phone: "82299887766",
  },
];

export const getMitraByMaskingName = (maskingName: string): MitraDetail | null => {
  const mitra = MITRA_LIST.find((m) => m.masking_name === maskingName);
  if (!mitra) return null;
  return { ...mitra, whatsapp: mitra.phone };
};

// -----------------------------
// Sosial media & kontak toko
// -----------------------------
export const SOSMED: Sosmed = {
  facebook: "https://facebook.com/gadgetshop",
  instagram: "https://instagram.com/gadgetshop",
  whatsapp: "81234567890",
};

// -----------------------------
// Helper pencarian produk (simulasi endpoint pencarian + pagination)
// -----------------------------
export interface SearchResult {
  results: Product[];
  total_records: number;
  total_pages: number;
  item_per_page: number;
}

const ITEMS_PER_PAGE = 5;

export const searchProducts = (query: string, page: number): SearchResult => {
  const filtered = PRODUCTS.filter((p) =>
    p.nama_produk.toLowerCase().includes(query.toLowerCase())
  );
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);
  return {
    results: paginated,
    total_records: filtered.length,
    total_pages: Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)),
    item_per_page: ITEMS_PER_PAGE,
  };
};
