import type { CartItemView } from "@/context/CartContext";

export interface ShippingAddress {
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
}

export type ShippingMethodKey = "reguler" | "instant" | "kargo";
export type PaymentMethodKey = "transfer" | "cod";

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItemSnapshot[];
  address: ShippingAddress;
  shippingMethod: ShippingMethodKey;
  shippingCost: number;
  paymentMethod: PaymentMethodKey;
  subtotal: number;
  total: number;
  status: "Menunggu Pembayaran";
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

const genOrderId = () => {
  const rand = Math.floor(Math.random() * 900000 + 100000);
  return `BF-${rand}`;
};

export function createOrder(
  items: CartItemView[],
  address: ShippingAddress,
  shippingMethod: ShippingMethodKey,
  paymentMethod: PaymentMethodKey
): Order {
  const shippingCost = SHIPPING_OPTIONS.find((s) => s.key === shippingMethod)?.cost ?? 0;
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const order: Order = {
    id: genOrderId(),
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

  const all = getOrders();
  all.unshift(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return order;
}

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}
