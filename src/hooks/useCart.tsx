import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getProductById, type Product } from "@/data/mockData";

export interface CartLine {
  productId: string;
  qty: number;
}

export interface ResolvedCartLine {
  product: Product;
  qty: number;
  subtotal: number;
}

interface CartContextValue {
  lines: CartLine[];
  resolvedLines: ResolvedCartLine[];
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: string, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bf_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setLines(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persist = (next: CartLine[]) => {
    setLines(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addToCart = (productId: string, qty = 1) => {
    const existing = lines.find((l) => l.productId === productId);
    if (existing) {
      persist(
        lines.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l))
      );
    } else {
      persist([...lines, { productId, qty }]);
    }
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    persist(lines.map((l) => (l.productId === productId ? { ...l, qty } : l)));
  };

  const removeFromCart = (productId: string) => {
    persist(lines.filter((l) => l.productId !== productId));
  };

  const clearCart = () => persist([]);

  const resolvedLines: ResolvedCartLine[] = lines
    .map((l) => {
      const product = getProductById(l.productId);
      if (!product) return null;
      return { product, qty: l.qty, subtotal: product.price * l.qty };
    })
    .filter((l): l is ResolvedCartLine => l !== null);

  const totalItems = resolvedLines.reduce((sum, l) => sum + l.qty, 0);
  const totalPrice = resolvedLines.reduce((sum, l) => sum + l.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        resolvedLines,
        totalItems,
        totalPrice,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
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
