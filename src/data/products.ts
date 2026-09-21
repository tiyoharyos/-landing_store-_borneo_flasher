// ==========================================================
// Tipe & helper produk — Borneo Flasher Store
// Data produk sungguhan diambil dari backend lewat
// src/services/productsService.ts (lihat src/lib/mapProduct.ts
// untuk pemetaan response API -> tipe Product di bawah ini).
// ==========================================================

import { CATEGORIES as LEGACY_CATEGORIES, PRODUCTS as LEGACY_PRODUCTS } from "@/data/mockData";

export type CategoryKey = string;

export type Condition = "Baru" | "Bekas Layak Pakai";

export interface Product {
  id: string;
  slug: string;
  category: CategoryKey;
  // Nama kategori asli dari backend (nama_kategori), dipakai sebagai
  // fallback label kalau ID kategori produk tidak match dengan daftar
  // kategori (mis. produk lama yang belum dikategorikan ulang).
  categoryName?: string;
  name: string;
  // Kode/SKU produk dari backend (kode_produk), mis. "BRG-8588878".
  code?: string;
  description: string;
  // Nama supplier/pemasok produk (field terpisah dari `description`).
  supplier?: string;
  // Lokasi penyimpanan fisik produk di gudang/etalase (lokasi_penyimpanan).
  location?: string;
  image: string;
  price: number;
  priceOriginal?: number;
  stock: number;
  sold: number;
  rating: number;
  condition: Condition;
  weightGram: number;
  // Timestamp dari backend (created_at), format string apa adanya.
  createdAt?: string;
}

export const CATEGORIES = LEGACY_CATEGORIES.map((c) => ({
  key: c.slug,
  label: c.name,
  icon: c.icon,
}));

export const PRODUCTS: Product[] = LEGACY_PRODUCTS.map((p) => ({
  id: p.id,
  slug: p.id,
  category: p.category,
  categoryName: p.category,
  name: p.name,
  code: p.id,
  description: "",
  supplier: undefined,
  location: undefined,
  image: p.image,
  price: p.price,
  priceOriginal: p.priceOriginal,
  stock: p.stock,
  sold: p.sold,
  rating: p.rating,
  condition: "Baru",
  weightGram: 0,
  createdAt: undefined,
}));

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

export const discountPercent = (p: Product) => {
  if (!p.priceOriginal || p.priceOriginal <= p.price) return 0;
  return Math.round(((p.priceOriginal - p.price) / p.priceOriginal) * 100);
};
