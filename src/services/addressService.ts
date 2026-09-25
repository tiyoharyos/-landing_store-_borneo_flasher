import api, { type ApiResponse } from "@/lib/axios";


export interface ApiAddress {
  id_address: number | string;
  id_user?: number | string;
  label: string;
  nama_penerima: string;
  no_hp: string;
  alamat_lengkap: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  is_default: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddressPayload {
  label: string;
  nama_penerima: string;
  no_hp: string;
  alamat_lengkap: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  is_default?: boolean;
}


export async function getAddresses() {
  const res = await api.get<ApiResponse<ApiAddress[]>>("Addresses");
  return res.data;
}


export async function createAddress(payload: AddressPayload) {
  const res = await api.post<ApiResponse<{ id_address: number | string }>>(
    "Addresses",
    payload
  );
  return res.data;
}


export async function updateAddress(id: number | string, payload: Partial<AddressPayload>) {
  const res = await api.put<ApiResponse<null>>(`Addresses/update/${id}`, payload);
  return res.data;
}

export async function deleteAddress(id_address: number | string) {
  const res = await api.delete<ApiResponse<null>>("Addresses", {
    data: { id_address },
  });
  return res.data;
}

export default {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
