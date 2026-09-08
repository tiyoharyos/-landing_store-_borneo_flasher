import api, { type ApiResponse } from "@/lib/axios";

/**
 * Service untuk endpoint Checkout.
 * Butuh Authorization: Bearer <token> (otomatis lewat interceptor di
 * src/lib/axios.ts). Tidak perlu body — backend ambil isi cart user
 * langsung dari tabel cart berdasarkan token, cek stok, buat order +
 * order_items, kurangi stok produk, lalu mengosongkan cart user.
 *
 *   POST Checkout/  -> proses checkout dari isi cart user login
 */

export interface CheckoutResult {
  id_order: number | string;
  total_price: number;
}

export async function checkout() {
  const res = await api.post<ApiResponse<CheckoutResult>>("Checkout");
  return res.data;
}

export default { checkout };
