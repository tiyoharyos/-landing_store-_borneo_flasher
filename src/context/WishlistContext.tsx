import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS, type Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { alertNeedLogin, toastSuccess, toastInfo } from "@/components/ui/alert";

interface WishlistContextValue {
  ids: string[];
  items: Product[];
  totalItems: number;
  isWishlisted: (productId: string) => boolean;
  /** Menambah/menghapus produk dari wishlist. Butuh login — kalau belum
   *  masuk, user akan diarahkan ke halaman login lewat dialog konfirmasi. */
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "bf_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  // Kalau user logout, kosongkan wishlist supaya konsisten dengan keranjang.
  useEffect(() => {
    if (!user && ids.length > 0) {
      setIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isWishlisted = (productId: string) => ids.includes(productId);

  const toggle: WishlistContextValue["toggle"] = (productId) => {
    if (!user) {
      alertNeedLogin().then((wantsLogin) => {
        if (wantsLogin) navigate("/masuk?next=/akun/profil");
      });
      return;
    }
    setIds((prev) => {
      if (prev.includes(productId)) {
        toastInfo("Dihapus dari wishlist");
        return prev.filter((id) => id !== productId);
      }
      toastSuccess("Ditambahkan ke wishlist");
      return [...prev, productId];
    });
  };

  const remove: WishlistContextValue["remove"] = (productId) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  };

  const clear = () => setIds([]);

  const items: Product[] = ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <WishlistContext.Provider
      value={{ ids, items, totalItems: ids.length, isWishlisted, toggle, remove, clear }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
