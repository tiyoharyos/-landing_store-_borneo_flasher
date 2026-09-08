import type { ApiProduct } from "@/services/productsService";
import type { ApiCategory } from "@/services/categoriesService";
import type { ApiWishlistItem } from "@/services/wishlistService";
import type { Product, CategoryKey } from "@/data/products";
import { resolveUploadUrl } from "@/lib/uploads";

const FALLBACK_IMAGE = "https://picsum.photos/seed/borneo-flasher-fallback/600/600";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/**
 * Backend belum punya field slug/rating/sold/condition/weightGram,
 * jadi field itu diisi nilai default supaya tetap kompatibel dengan
 * ProductCard & komponen lain yang sudah ada.
 *
 * `category` diisi id_kategori (di-cast ke CategoryKey) karena kategori
 * sekarang dinamis dari backend, bukan enum tetap di data/products.ts.
 * Kalau nanti mau filter/label kategori, pakai `mapCategoryLabels`
 * di bawah, jangan andalkan CATEGORIES dari data/products.ts.
 */
export function mapApiProductToProduct(p: ApiProduct): Product {
  return {
    id: String(p.id_produk),
    slug: `${slugify(p.nama_produk)}-${p.id_produk}`,
    category: String(p.id_kategori ?? "tanpa-kategori") as CategoryKey,
    name: p.nama_produk,
    description: p.supplier ? `Supplier: ${p.supplier}` : "",
    image: resolveUploadUrl(p.image, "produk") || FALLBACK_IMAGE,
    price: Number(p.harga_normal) || 0,
    stock: Number(p.kuantitas) || 0,
    sold: 0,
    rating: 0,
    condition: "Baru",
    weightGram: 0,
  };
}

export function mapApiProductsToProducts(list: ApiProduct[]): Product[] {
  return list.map(mapApiProductToProduct);
}

/**
 * Wishlist_model->getByUser_get() diasumsikan join ke tabel produk.
 * Field id produk di respons wishlist belum pasti namanya (id_produk atau
 * id_product), jadi dinormalisasi dulu sebelum dipetakan lewat
 * mapApiProductToProduct.
 */
export function mapApiWishlistToProducts(list: ApiWishlistItem[]): Product[] {
  return list.map((item) =>
    mapApiProductToProduct({
      ...item,
      id_produk: item.id_produk ?? item.id_product ?? "",
    } as ApiProduct)
  );
}

export interface CategoryOption {
  key: string;
  label: string;
  image: string | null;
}

export function mapCategoryOptions(list: ApiCategory[]): CategoryOption[] {
  return list.map((c) => ({
    key: String(c.id_kategori),
    label: c.nama_kategori,
    image: resolveUploadUrl(c.foto, "kategori"),
  }));
}
