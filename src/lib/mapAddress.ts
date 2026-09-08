import type { ApiAddress, AddressPayload } from "@/services/addressService";
import type { Address, AddressInput } from "@/data/addresses";

export function mapApiAddressToAddress(a: ApiAddress): Address {
  return {
    id: String(a.id_address),
    label: a.label,
    recipientName: a.nama_penerima,
    phone: a.no_hp,
    fullAddress: a.alamat_lengkap,
    city: a.kota,
    province: a.provinsi,
    postalCode: a.kode_pos,
    isPrimary: Number(a.is_default) === 1,
  };
}

export function mapApiAddressesToAddresses(list: ApiAddress[]): Address[] {
  return list.map(mapApiAddressToAddress);
}

export function buildAddressPayload(input: AddressInput, isDefault?: boolean): AddressPayload {
  return {
    label: input.label,
    nama_penerima: input.recipientName,
    no_hp: input.phone,
    alamat_lengkap: input.fullAddress,
    kota: input.city,
    provinsi: input.province,
    kode_pos: input.postalCode,
    ...(isDefault !== undefined ? { is_default: isDefault } : {}),
  };
}
