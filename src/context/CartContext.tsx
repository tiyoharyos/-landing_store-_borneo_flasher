import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS, type Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { alertNeedLogin } from "@/components/ui/alert";

export interface CartLine {
  productId: string;
  qty: number;
}

export interface CartItemView extends CartLine {
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLine[];
  items: CartItemView[];
  totalItems: number;
  subtotal: number;
  /** Menambahkan produk ke keranjang. Butuh login — kalau belum masuk,
   *  user akan diarahkan ke halaman login lewat dialog konfirmasi. */
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bf_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  // Kalau user logout sementara ada isi keranjang, kosongkan supaya
  // keranjang benar-benar "tidak bisa diisi" tanpa akun yang aktif.
  useEffect(() => {
    if (!user && lines.length > 0) {
      setLines([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addItem: CartContextValue["addItem"] = (productId, qty = 1) => {
    if (!user) {
      alertNeedLogin().then((wantsLogin) => {
        if (wantsLogin) navigate("/masuk?next=/keranjang");
      });
      return;
    }
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { productId, qty }];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (productId) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  };

  const setQty: CartContextValue["setQty"] = (productId, qty) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, qty } : l)));
  };

  const clear = () => setLines([]);

  const items: CartItemView[] = lines
    .map((l) => {
      const product = PRODUCTS.find((p) => p.id === l.productId);
      if (!product) return null;
      return { ...l, product, lineTotal: product.price * l.qty };
    })
    .filter((x): x is CartItemView => x !== null);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

  return (
    <CartContext.Provider
      value={{ lines, items, totalItems, subtotal, addItem, removeItem, setQty, clear }}
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
