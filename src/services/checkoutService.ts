import api, { type ApiResponse } from "@/lib/axios";
export interface CheckoutResult {
  id_order: number | string;
  total_price: number;
}

export async function checkout() {
  const res = await api.post<ApiResponse<CheckoutResult>>("Checkout");
  return res.data;
}

export default { checkout };
