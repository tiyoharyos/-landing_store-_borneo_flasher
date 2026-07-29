import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/products";

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
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bf_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

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

  const addItem: CartContextValue["addItem"] = (productId, qty = 1) => {
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
