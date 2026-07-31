export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
}

export type AddressInput = Omit<Address, "id" | "isPrimary">;

const storageKey = (email: string) => `bf_addresses:${email.trim().toLowerCase()}`;

export function getAddresses(email: string): Address[] {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAddresses(email: string, addresses: Address[]) {
  if (!email) return;
  localStorage.setItem(storageKey(email), JSON.stringify(addresses));
}

const genAddressId = () => `ADR-${Date.now().toString(36)}-${Math.floor(Math.random() * 9000 + 1000)}`;

export function createAddress(email: string, input: AddressInput, makePrimary = false): Address {
  const all = getAddresses(email);
  const address: Address = {
    ...input,
    id: genAddressId(),
    isPrimary: makePrimary || all.length === 0,
  };
  const next = address.isPrimary ? all.map((a) => ({ ...a, isPrimary: false })) : all;
  next.push(address);
  saveAddresses(email, next);
  return address;
}

export function updateAddress(email: string, id: string, input: AddressInput): Address[] {
  const all = getAddresses(email);
  const next = all.map((a) => (a.id === id ? { ...a, ...input } : a));
  saveAddresses(email, next);
  return next;
}

export function deleteAddress(email: string, id: string): Address[] {
  const all = getAddresses(email);
  const wasPrimary = all.find((a) => a.id === id)?.isPrimary;
  let next = all.filter((a) => a.id !== id);
  if (wasPrimary && next.length > 0) {
    next = next.map((a, i) => ({ ...a, isPrimary: i === 0 }));
  }
  saveAddresses(email, next);
  return next;
}

export function setPrimaryAddress(email: string, id: string): Address[] {
  const all = getAddresses(email);
  const next = all.map((a) => ({ ...a, isPrimary: a.id === id }));
  saveAddresses(email, next);
  return next;
}
