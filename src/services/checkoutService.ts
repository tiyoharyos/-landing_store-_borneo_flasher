import api, { type ApiResponse } from "@/lib/axios";
export interface CheckoutResult {
  id_order: number | string;
  total_price: number;
}

export interface CheckoutPayload {
  id_alamat: number | string;
  shipping_method: string;
  shipping_cost: number;
  payment_method: string;
}

export async function checkout(payload: CheckoutPayload) {
  const res = await api.post<ApiResponse<CheckoutResult>>("Checkout", payload);
  return res.data;
}

export default { checkout };
