// ==========================================================
// MOCK DATA — Seed Akun Demo (Borneo Flasher Store)
// Data awal (alamat & riwayat pesanan) yang otomatis muncul
// begitu akun demo di src/data/users.ts login pertama kali,
// supaya profil terasa "sudah terisi" alih-alih kosong melompong.
// Setelah muncul, data ini tersimpan di localStorage seperti
// biasa dan bisa diubah/dihapus normal lewat UI.
// ==========================================================

import type { AddressInput } from "@/data/addresses";
import type { Order, OrderItemSnapshot, PaymentMethodKey, ShippingMethodKey } from "@/data/orders";
import { PRODUCTS } from "@/data/products";

const emailKey = (email: string) => email.trim().toLowerCase();

function snapshot(productId: string, qty: number): OrderItemSnapshot {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) throw new Error(`[demoSeed] Produk tidak ditemukan: ${productId}`);
  return { productId: p.id, name: p.name, image: p.image, price: p.price, qty };
}

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

interface SeedOrderInput {
  id: string;
  userEmail: string;
  daysAgoCreated: number;
  items: OrderItemSnapshot[];
  address: Order["address"];
  shippingMethod: ShippingMethodKey;
  shippingCost: number;
  paymentMethod: PaymentMethodKey;
  status: Order["status"];
}

function buildOrder(input: SeedOrderInput): Order {
  const subtotal = input.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return {
    id: input.id,
    userEmail: input.userEmail,
    createdAt: daysAgo(input.daysAgoCreated),
    items: input.items,
    address: input.address,
    shippingMethod: input.shippingMethod,
    shippingCost: input.shippingCost,
    paymentMethod: input.paymentMethod,
    subtotal,
    total: subtotal + input.shippingCost,
    status: input.status,
  };
}

// ---------------- Alamat demo ----------------
export const DEMO_ADDRESS_SEED: Record<string, AddressInput[]> = {
  "andi@borneoflasher.id": [
    {
      label: "Rumah",
      recipientName: "Andi Saputra",
      phone: "081234567890",
      fullAddress: "Jl. Melati No. 12, RT 03 / RW 05, Kel. Sungai Pinang",
      city: "Samarinda",
      postalCode: "75117",
    },
    {
      label: "Kantor",
      recipientName: "Andi Saputra",
      phone: "081234567890",
      fullAddress: "Ruko Borneo Trade Center Blok C No. 8, Jl. Ahmad Yani",
      city: "Samarinda",
      postalCode: "75242",
    },
  ],
  "siti@borneoflasher.id": [
    {
      label: "Rumah",
      recipientName: "Siti Rahma",
      phone: "082198765432",
      fullAddress: "Jl. Merdeka Gg. Aster No. 5",
      city: "Balikpapan",
      postalCode: "76114",
    },
  ],
  "admin@borneoflasher.id": [
    {
      label: "Kantor",
      recipientName: "Admin Borneo",
      phone: "085611122233",
      fullAddress: "Jl. Borneo Flasher Institute No. 1",
      city: "Balikpapan",
      postalCode: "76125",
    },
  ],
};

// ---------------- Pesanan demo ----------------
export const DEMO_ORDER_SEED: Record<string, Order[]> = {
  "andi@borneoflasher.id": [
    buildOrder({
      id: "BF-100231",
      userEmail: "andi@borneoflasher.id",
      daysAgoCreated: 1,
      items: [snapshot("diagnostic-cable-dcsd", 2), snapshot("flexy-fpc-iphone-speaker", 1)],
      address: {
        name: "Andi Saputra",
        phone: "081234567890",
        fullAddress: "Jl. Melati No. 12, RT 03 / RW 05, Kel. Sungai Pinang",
        city: "Samarinda",
        postalCode: "75117",
      },
      shippingMethod: "instant",
      shippingCost: 25000,
      paymentMethod: "transfer",
      status: "Diproses",
    }),
    buildOrder({
      id: "BF-100198",
      userEmail: "andi@borneoflasher.id",
      daysAgoCreated: 4,
      items: [snapshot("obeng-mijing-ls11", 1)],
      address: {
        name: "Andi Saputra",
        phone: "081234567890",
        fullAddress: "Ruko Borneo Trade Center Blok C No. 8, Jl. Ahmad Yani",
        city: "Samarinda",
        postalCode: "75242",
      },
      shippingMethod: "reguler",
      shippingCost: 15000,
      paymentMethod: "transfer",
      status: "Dikirim",
    }),
    buildOrder({
      id: "BF-100052",
      userEmail: "andi@borneoflasher.id",
      daysAgoCreated: 21,
      items: [snapshot("bor-mm25000", 1), snapshot("obeng-mijing-ls11", 1)],
      address: {
        name: "Andi Saputra",
        phone: "081234567890",
        fullAddress: "Jl. Melati No. 12, RT 03 / RW 05, Kel. Sungai Pinang",
        city: "Samarinda",
        postalCode: "75117",
      },
      shippingMethod: "kargo",
      shippingCost: 50000,
      paymentMethod: "cod",
      status: "Selesai",
    }),
  ],
  "siti@borneoflasher.id": [
    buildOrder({
      id: "BF-100244",
      userEmail: "siti@borneoflasher.id",
      daysAgoCreated: 2,
      items: [snapshot("botol-tiner-wts001", 5), snapshot("timah-gulung-paragon", 3)],
      address: {
        name: "Siti Rahma",
        phone: "082198765432",
        fullAddress: "Jl. Merdeka Gg. Aster No. 5",
        city: "Balikpapan",
        postalCode: "76114",
      },
      shippingMethod: "reguler",
      shippingCost: 15000,
      paymentMethod: "transfer",
      status: "Diproses",
    }),
    buildOrder({
      id: "BF-100077",
      userEmail: "siti@borneoflasher.id",
      daysAgoCreated: 15,
      items: [snapshot("kaos-offline-hitam-l", 1), snapshot("fixing-tools-pcb-holder", 1)],
      address: {
        name: "Siti Rahma",
        phone: "082198765432",
        fullAddress: "Jl. Merdeka Gg. Aster No. 5",
        city: "Balikpapan",
        postalCode: "76114",
      },
      shippingMethod: "instant",
      shippingCost: 25000,
      paymentMethod: "transfer",
      status: "Selesai",
    }),
  ],
  "admin@borneoflasher.id": [
    buildOrder({
      id: "BF-100260",
      userEmail: "admin@borneoflasher.id",
      daysAgoCreated: 0,
      items: [snapshot("kaca-pembesar-led", 1), snapshot("ragum-ycs-yhkj", 1)],
      address: {
        name: "Admin Borneo",
        phone: "085611122233",
        fullAddress: "Jl. Borneo Flasher Institute No. 1",
        city: "Balikpapan",
        postalCode: "76125",
      },
      shippingMethod: "instant",
      shippingCost: 25000,
      paymentMethod: "transfer",
      status: "Diproses",
    }),
    buildOrder({
      id: "BF-100015",
      userEmail: "admin@borneoflasher.id",
      daysAgoCreated: 30,
      items: [snapshot("multitester-rf4", 1)],
      address: {
        name: "Admin Borneo",
        phone: "085611122233",
        fullAddress: "Jl. Borneo Flasher Institute No. 1",
        city: "Balikpapan",
        postalCode: "76125",
      },
      shippingMethod: "reguler",
      shippingCost: 15000,
      paymentMethod: "transfer",
      status: "Selesai",
    }),
  ],
};

export function getDemoAddressSeed(email: string): AddressInput[] | undefined {
  return DEMO_ADDRESS_SEED[emailKey(email)];
}

export function getDemoOrderSeed(email: string): Order[] | undefined {
  return DEMO_ORDER_SEED[emailKey(email)];
}
