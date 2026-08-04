import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
  type Address,
  type AddressInput,
} from "@/data/addresses";
import { useToast } from "@/components/ui/Toast";

interface AddressContextValue {
  addresses: Address[];
  primaryAddress: Address | undefined;
  addAddress: (input: AddressInput, makePrimary?: boolean) => Address;
  editAddress: (id: string, input: AddressInput) => void;
  removeAddress: (id: string) => void;
  makePrimary: (id: string) => void;
}

const AddressContext = createContext<AddressContextValue | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const toast = useToast();

  // Muat ulang daftar alamat setiap kali akun yang aktif berganti.
  useEffect(() => {
    setAddresses(user ? getAddresses(user.email) : []);
  }, [user]);

  const addAddress: AddressContextValue["addAddress"] = (input, makePrimary = false) => {
    if (!user) throw new Error("Harus masuk akun dulu untuk menambah alamat.");
    const created = createAddress(user.email, input, makePrimary);
    setAddresses(getAddresses(user.email));
    toast.success("Alamat baru disimpan");
    return created;
  };

  const editAddress: AddressContextValue["editAddress"] = (id, input) => {
    if (!user) return;
    const next = updateAddress(user.email, id, input);
    setAddresses(next);
    toast.success("Alamat diperbarui");
  };

  const removeAddress: AddressContextValue["removeAddress"] = (id) => {
    if (!user) return;
    const next = deleteAddress(user.email, id);
    setAddresses(next);
    toast.info("Alamat dihapus");
  };

  const makePrimaryFn: AddressContextValue["makePrimary"] = (id) => {
    if (!user) return;
    const next = setPrimaryAddress(user.email, id);
    setAddresses(next);
  };

  const primaryAddress = addresses.find((a) => a.isPrimary) ?? addresses[0];

  return (
    <AddressContext.Provider
      value={{
        addresses,
        primaryAddress,
        addAddress,
        editAddress,
        removeAddress,
        makePrimary: makePrimaryFn,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses must be used within AddressProvider");
  return ctx;
}
