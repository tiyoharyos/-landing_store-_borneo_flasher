export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
  isPrimary: boolean;
}

export type AddressInput = Omit<Address, "id" | "isPrimary">;
