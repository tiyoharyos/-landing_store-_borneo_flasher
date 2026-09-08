import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/services/addressService";
import { mapApiAddressesToAddresses, buildAddressPayload } from "@/lib/mapAddress";
import { getApiErrorMessage } from "@/lib/axios";
import type { Address, AddressInput } from "@/data/addresses";
import { useToast } from "@/components/ui/Toast";

interface AddressContextValue {
  addresses: Address[];
  primaryAddress: Address | undefined;
  loading: boolean;
  addAddress: (input: AddressInput, makePrimary?: boolean) => Promise<Address | null>;
  editAddress: (id: string, input: AddressInput, makePrimary?: boolean) => Promise<void>;
  removeAddress: (id: string) => void;
  makePrimary: (id: string) => void;
  refresh: () => void;
}

const AddressContext = createContext<AddressContextValue | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const loadAddresses = () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    setLoading(true);
    getAddresses()
      .then((res) => setAddresses(mapApiAddressesToAddresses(res.data ?? [])))
      .catch(() => {
        // Gagal muat alamat tetap lanjut dengan daftar kosong,
        // supaya halaman lain tidak ikut error.
      })
      .finally(() => setLoading(false));
  };

  // Muat ulang daftar alamat setiap kali akun yang aktif berganti.
  useEffect(() => {
    if (!user) {
      setAddresses([]);
      return;
    }

    let active = true;
    setLoading(true);
    getAddresses()
      .then((res) => {
        if (!active) return;
        setAddresses(mapApiAddressesToAddresses(res.data ?? []));
      })
      .catch(() => {
        // ignore, biarkan daftar kosong
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addAddress: AddressContextValue["addAddress"] = async (input, makePrimary = false) => {
    if (!user) return null;
    try {
      // Alamat pertama otomatis jadi utama, sama seperti perilaku sebelumnya.
      const shouldBePrimary = makePrimary || addresses.length === 0;
      const res = await createAddress(buildAddressPayload(input, shouldBePrimary));
      loadAddresses();
      toast.success("Alamat baru disimpan");
      return { ...input, id: String(res.data?.id_address ?? ""), isPrimary: shouldBePrimary };
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Gagal menyimpan alamat."));
      return null;
    }
  };

  const editAddress: AddressContextValue["editAddress"] = async (id, input, makePrimary) => {
    if (!user) return;
    try {
      await updateAddress(id, buildAddressPayload(input, makePrimary));
      loadAddresses();
      toast.success("Alamat diperbarui");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Gagal memperbarui alamat."));
    }
  };

  const removeAddress: AddressContextValue["removeAddress"] = (id) => {
    const prev = addresses;
    setAddresses((cur) => cur.filter((a) => a.id !== id));
    deleteAddress(id)
      .then(() => toast.info("Alamat dihapus"))
      .catch((err) => {
        setAddresses(prev);
        toast.error(getApiErrorMessage(err, "Gagal menghapus alamat."));
      });
  };

  const makePrimaryFn: AddressContextValue["makePrimary"] = (id) => {
    const target = addresses.find((a) => a.id === id);
    if (!target) return;
    const prev = addresses;
    setAddresses((cur) => cur.map((a) => ({ ...a, isPrimary: a.id === id })));
    updateAddress(id, buildAddressPayload(
      {
        label: target.label,
        recipientName: target.recipientName,
        phone: target.phone,
        fullAddress: target.fullAddress,
        city: target.city,
        province: target.province,
        postalCode: target.postalCode,
      },
      true
    )).catch((err) => {
      setAddresses(prev);
      toast.error(getApiErrorMessage(err, "Gagal menjadikan alamat utama."));
    });
  };

  const primaryAddress = addresses.find((a) => a.isPrimary) ?? addresses[0];

  return (
    <AddressContext.Provider
      value={{
        addresses,
        primaryAddress,
        loading,
        addAddress,
        editAddress,
        removeAddress,
        makePrimary: makePrimaryFn,
        refresh: loadAddresses,
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
