import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { type Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlistService";
import { mapApiWishlistToProducts } from "@/lib/mapProduct";
import { getApiErrorMessage } from "@/lib/axios";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/Toast";

interface WishlistContextValue {
  ids: string[];
  items: Product[];
  totalItems: number;
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const ids = items.map((p) => p.id);

  // Ambil wishlist dari backend tiap kali user login. Kalau logout,
  // kosongkan wishlist lokal (server sudah tidak lagi mengembalikan Authorization).
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    let active = true;
    setLoading(true);
    getWishlist()
      .then((res) => {
        if (!active) return;
        setItems(mapApiWishlistToProducts(res.data ?? []));
      })
      .catch(() => {
        // Gagal muat wishlist tetap lanjut dengan wishlist kosong,
        // supaya halaman lain tidak ikut error.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const isWishlisted = (productId: string) => ids.includes(productId);

  const toggle: WishlistContextValue["toggle"] = (productId) => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Masuk dulu, yuk",
        text: "Kamu perlu masuk ke akun untuk menambahkan produk ke wishlist.",
        showCancelButton: true,
        confirmButtonText: "Masuk Sekarang",
        cancelButtonText: "Nanti Saja",
      }).then((res) => {
        if (res.isConfirmed) navigate("/masuk?next=/akun/profil");
      });
      return;
    }

    const alreadyWishlisted = isWishlisted(productId);

    if (alreadyWishlisted) {
      // Optimistic update: hapus dulu dari UI, rollback kalau gagal.
      const prevItems = items;
      setItems((prev) => prev.filter((p) => p.id !== productId));
      removeFromWishlist(productId)
        .then(() => toast.info("Dihapus dari wishlist"))
        .catch((err) => {
          setItems(prevItems);
          toast.error(getApiErrorMessage(err, "Gagal menghapus dari wishlist."));
        });
      return;
    }

    addToWishlist(productId)
      .then(() => {
        toast.success("Ditambahkan ke wishlist");
        // Backend cuma balas pesan sukses (tanpa data produk), jadi refresh
        // ulang daftar wishlist supaya data produknya lengkap.
        return getWishlist().then((res) => setItems(mapApiWishlistToProducts(res.data ?? [])));
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err, "Gagal menambahkan ke wishlist."));
      });
  };

  const remove: WishlistContextValue["remove"] = (productId) => {
    const prevItems = items;
    setItems((prev) => prev.filter((p) => p.id !== productId));
    removeFromWishlist(productId).catch((err) => {
      setItems(prevItems);
      toast.error(getApiErrorMessage(err, "Gagal menghapus dari wishlist."));
    });
  };

  const clear = () => setItems([]);

  return (
    <WishlistContext.Provider
      value={{ ids, items, totalItems: ids.length, loading, isWishlisted, toggle, remove, clear }}
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
