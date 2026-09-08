import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { type Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { getCart, addToCart, setCartQuantity, removeFromCart } from "@/services/cartService";
import { mapApiCartToItems } from "@/lib/mapProduct";
import { getApiErrorMessage } from "@/lib/axios";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/Toast";

export interface CartItemView {
  productId: string;
  qty: number;
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  items: CartItemView[];
  totalItems: number;
  subtotal: number;
  loading: boolean;
  /** Menambahkan produk ke keranjang lewat API. Butuh login — kalau belum
   *  masuk, user akan diarahkan ke halaman login lewat dialog konfirmasi.
   *  Resolve `true` kalau produk berhasil ditambahkan, `false` kalau tidak
   *  (belum login / request gagal — pesan error sudah ditampilkan lewat toast). */
  addItem: (productId: string, qty?: number) => Promise<boolean>;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  refresh: () => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemView[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const loadCart = () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    getCart()
      .then((res) => {
        setItems(mapApiCartToItems(res.data?.items ?? []));
      })
      .catch(() => {
        // Gagal muat keranjang tetap lanjut dengan keranjang kosong,
        // supaya halaman lain tidak ikut error.
      })
      .finally(() => setLoading(false));
  };

  // Ambil keranjang dari backend tiap kali user login. Kalau logout,
  // kosongkan keranjang lokal (server sudah tidak lagi mengembalikan Authorization).
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    let active = true;
    setLoading(true);
    getCart()
      .then((res) => {
        if (!active) return;
        setItems(mapApiCartToItems(res.data?.items ?? []));
      })
      .catch(() => {
        // ignore, biarkan keranjang kosong
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addItem: CartContextValue["addItem"] = async (productId, qty = 1) => {
    if (!user) {
      const res = await Swal.fire({
        icon: "info",
        title: "Masuk dulu, yuk",
        text: "Kamu perlu masuk ke akun untuk menambahkan produk ke keranjang.",
        showCancelButton: true,
        confirmButtonText: "Masuk Sekarang",
        cancelButtonText: "Nanti Saja",
      });
      if (res.isConfirmed) navigate("/masuk?next=/keranjang");
      return false;
    }

    try {
      await addToCart(productId, qty);
      loadCart();
      toast.success("Ditambahkan ke keranjang");
      return true;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Gagal menambahkan ke keranjang."));
      return false;
    }
  };

  const removeItem: CartContextValue["removeItem"] = (productId) => {
    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    removeFromCart(productId).catch((err) => {
      setItems(prevItems);
      toast.error(getApiErrorMessage(err, "Gagal menghapus produk dari keranjang."));
    });
  };

  const setQty: CartContextValue["setQty"] = (productId, qty) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }

    const prevItems = items;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, qty, lineTotal: i.product.price * qty } : i
      )
    );

    setCartQuantity(productId, qty).catch((err) => {
      setItems(prevItems);
      toast.error(getApiErrorMessage(err, "Gagal mengubah jumlah produk."));
    });
  };

  // Tidak ada endpoint bulk-clear di backend, jadi keranjang dikosongkan
  // dengan menghapus item satu per satu (dipakai setelah checkout berhasil).
  const clear = () => {
    const prevItems = items;
    setItems([]);
    Promise.all(prevItems.map((i) => removeFromCart(i.productId))).catch(() => {
      // Best-effort: kalau ada yang gagal dihapus di server, sinkronkan ulang.
      loadCart();
    });
  };

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, subtotal, loading, addItem, removeItem, setQty, refresh: loadCart, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
