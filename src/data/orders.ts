import type { CartItemView } from "@/context/CartContext";
import { getDemoOrderSeed } from "@/data/demoSeed";

export interface ShippingAddress {
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
}

export type ShippingMethodKey = "reguler" | "instant" | "kargo";
export type PaymentMethodKey = "transfer" | "cod";
export type OrderStatus = "Menunggu Pembayaran" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan";

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  /** Email akun yang membuat pesanan, dipakai untuk memfilter "Pesanan Saya" per akun. */
  userEmail: string;
  createdAt: string;
  items: OrderItemSnapshot[];
  address: ShippingAddress;
  shippingMethod: ShippingMethodKey;
  shippingCost: number;
  paymentMethod: PaymentMethodKey;
  subtotal: number;
  total: number;
  status: OrderStatus;
}

const STORAGE_KEY = "bf_orders";

export const SHIPPING_OPTIONS: { key: ShippingMethodKey; label: string; eta: string; cost: number }[] = [
  { key: "reguler", label: "JNE / J&T Reguler", eta: "3-5 hari", cost: 15000 },
  { key: "instant", label: "GoSend / Grab Instant", eta: "Hari ini", cost: 25000 },
  { key: "kargo", label: "Kargo (untuk alat besar)", eta: "5-7 hari", cost: 50000 },
];

export const PAYMENT_OPTIONS: { key: PaymentMethodKey; label: string; desc: string }[] = [
  { key: "transfer", label: "Transfer Bank", desc: "BCA / BNI / BRI / Mandiri (mock)" },
  { key: "cod", label: "Bayar di Tempat (COD)", desc: "Hanya untuk area tertentu (mock)" },
];

/** Kelas warna badge status, dipakai halaman profil/riwayat pesanan. */
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  "Menunggu Pembayaran": "bg-amber/15 text-amber-dark",
  Diproses: "bg-amber/15 text-amber-dark",
  Dikirim: "bg-brand/10 text-brand-dark",
  Selesai: "bg-ok/10 text-ok",
  Dibatalkan: "bg-warn/10 text-warn",
};

const genOrderId = () => {
  const rand = Math.floor(Math.random() * 900000 + 100000);
  return `BF-${rand}`;
};

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// Suntik data demo (kalau ada) begitu akun tersebut belum punya
// pesanan sama sekali, supaya akun demo terasa "sudah dipakai".
function ensureSeeded(all: Order[], emailLower: string): Order[] {
  const hasAny = all.some((o) => o.userEmail?.toLowerCase() === emailLower);
  if (hasAny) return all;
  const seed = getDemoOrderSeed(emailLower);
  if (!seed || seed.length === 0) return all;
  const merged = [...seed, ...all];
  writeAll(merged);
  return merged;
}

export function createOrder(
  items: CartItemView[],
  address: ShippingAddress,
  shippingMethod: ShippingMethodKey,
  paymentMethod: PaymentMethodKey,
  userEmail: string
): Order {
  const shippingCost = SHIPPING_OPTIONS.find((s) => s.key === shippingMethod)?.cost ?? 0;
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const order: Order = {
    id: genOrderId(),
    userEmail,
    createdAt: new Date().toISOString(),
    items: items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      image: i.product.image,
      price: i.product.price,
      qty: i.qty,
    })),
    address,
    shippingMethod,
    shippingCost,
    paymentMethod,
    subtotal,
    total: subtotal + shippingCost,
    status: "Menunggu Pembayaran",
  };

  const all = readAll();
  all.unshift(order);
  writeAll(all);
  return order;
}

/** Ambil pesanan milik satu akun (terbaru dulu), auto-seed data demo kalau kosong. */
export function getOrders(email: string): Order[] {
  if (!email) return [];
  const emailLower = email.trim().toLowerCase();
  const all = ensureSeeded(readAll(), emailLower);
  return all
    .filter((o) => o.userEmail?.toLowerCase() === emailLower)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrderById(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}
