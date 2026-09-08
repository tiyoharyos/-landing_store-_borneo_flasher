import type { ApiProduct } from "@/services/productsService";
import type { ApiCategory } from "@/services/categoriesService";
import type { ApiWishlistItem } from "@/services/wishlistService";
import type { ApiCartItem } from "@/services/cartService";
import type { Product, CategoryKey } from "@/data/products";
import type { CartItemView } from "@/context/CartContext";
import { resolveUploadUrl } from "@/lib/uploads";

const FALLBACK_IMAGE = "https://picsum.photos/seed/borneo-flasher-fallback/600/600";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export function mapApiProductToProduct(p: ApiProduct): Product {
  const hargaNormal = Number(p.harga_normal) || 0;
  const hargaSpesial =
    p.harga_spesial !== null && p.harga_spesial !== undefined && p.harga_spesial !== ""
      ? Number(p.harga_spesial)
      : null;
  const isDiscounted = hargaSpesial !== null && hargaSpesial > 0 && hargaSpesial < hargaNormal;

  return {
    id: String(p.id_produk),
    slug: `${slugify(p.nama_produk)}-${p.id_produk}`,
    category: String(p.id_kategori ?? "tanpa-kategori") as CategoryKey,
    name: p.nama_produk,
    description: p.supplier ? `Supplier: ${p.supplier}` : "",
    image: resolveUploadUrl(p.image, "produk") || FALLBACK_IMAGE,
    price: isDiscounted ? hargaSpesial! : hargaNormal,
    priceOriginal: isDiscounted ? hargaNormal : undefined,
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

export function mapApiWishlistToProducts(list: ApiWishlistItem[]): Product[] {
  return list.map((item) =>
    mapApiProductToProduct({
      ...item,
      id_produk: item.id_produk ?? item.id_product ?? "",
    } as ApiProduct)
  );
}

export function mapApiCartItemToView(item: ApiCartItem): CartItemView {
  const idProduct = String(item.id_product ?? item.id_produk ?? "");
  const hargaNormal = Number(item.harga_normal) || 0;
  const hargaSpesial =
    item.harga_spesial !== null && item.harga_spesial !== undefined && item.harga_spesial !== ""
      ? Number(item.harga_spesial)
      : null;
  const priceUsed = item.price_used !== undefined ? Number(item.price_used) : hargaSpesial ?? hargaNormal;
  const qty = Number(item.quantity) || 0;

  const product = mapApiProductToProduct({
    id_produk: idProduct,
    nama_produk: item.nama_produk ?? "Produk",
    kode_produk: item.kode_produk ?? "",
    kuantitas: item.kuantitas ?? 0,
    harga_modal: 0,
    harga_normal: hargaNormal,
    harga_spesial: hargaSpesial ?? undefined,
    lokasi_penyimpanan: "",
    supplier: "",
    id_kategori: item.id_kategori ?? null,
    nama_kategori: item.nama_kategori,
    image: item.image ?? null,
  } as ApiProduct);

  product.price = priceUsed;
  if (hargaSpesial !== null && hargaSpesial < hargaNormal) {
    product.priceOriginal = hargaNormal;
  }

  return {
    productId: idProduct,
    qty,
    product,
    lineTotal: item.subtotal !== undefined ? Number(item.subtotal) : priceUsed * qty,
  };
}

export function mapApiCartToItems(list: ApiCartItem[]): CartItemView[] {
  return list.map(mapApiCartItemToView);
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