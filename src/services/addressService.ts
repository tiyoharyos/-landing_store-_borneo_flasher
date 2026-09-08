import api, { type ApiResponse } from "@/lib/axios";

/**
 * Service untuk endpoint Addresses.
 * Semua endpoint butuh Authorization: Bearer <token> (otomatis lewat
 * interceptor di src/lib/axios.ts).
 *
 *   GET    Addresses/         -> list alamat milik user login
 *   POST   Addresses/         -> tambah alamat baru
 *   PUT    Addresses/update/:id -> update alamat (hanya field yang dikirim yang diubah)
 *   DELETE Addresses/         -> hapus alamat (body: { id_address })
 *
 * CATATAN: kode controller index_get() belum dikirim (cuma index_post,
 * update_put, index_delete). GET Addresses/ di bawah ini ASUMSI mengikuti
 * pola yang sama seperti Cart/Wishlist (index_get() mengembalikan array
 * alamat milik user login). Tolong dikonfirmasi ke backend-nya — kalau
 * bentuk field responsnya beda, sesuaikan ApiAddress & mapAddress.ts.
 */

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

// ---------- GET ADDRESSES ----------
// GET Addresses/

export async function getAddresses() {
  const res = await api.get<ApiResponse<ApiAddress[]>>("Addresses");
  return res.data;
}

// ---------- CREATE ADDRESS ----------
// POST Addresses/

export async function createAddress(payload: AddressPayload) {
  const res = await api.post<ApiResponse<{ id_address: number | string }>>(
    "Addresses",
    payload
  );
  return res.data;
}

// ---------- UPDATE ADDRESS ----------
// PUT Addresses/update/:id
// Hanya field yang tidak kosong yang benar-benar diproses backend
// (lihat foreach($fields) di controller), jadi payload boleh partial.

export async function updateAddress(id: number | string, payload: Partial<AddressPayload>) {
  const res = await api.put<ApiResponse<null>>(`Addresses/update/${id}`, payload);
  return res.data;
}

// ---------- DELETE ADDRESS ----------
// DELETE Addresses/  body: { id_address }

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
