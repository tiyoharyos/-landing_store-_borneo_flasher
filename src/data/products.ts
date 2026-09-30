export type CategoryKey = string;
export type Condition = "Baru" | "Bekas Layak Pakai";export interface Category {
  key: CategoryKey;
  label: string;
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  category: CategoryKey;
  categoryName?: string;
  name: string;
  code?: string;
  description: string;
  supplier?: string;
  location?: string;
  image: string;
  price: number;
  priceOriginal?: number;
  stock: number;
  sold: number;
  rating: number;
  condition: Condition;
  weightGram: number;
  createdAt?: string;
}
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