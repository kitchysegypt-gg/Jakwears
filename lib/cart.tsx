import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getVariant } from '@/lib/catalog';

export type CartLine = { variantId: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = 'jakwears.cart.v1';
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (!json) return;
        // Drop lines whose variant is no longer in the bundled catalog.
        const saved = (JSON.parse(json) as CartLine[]).filter((l) => getVariant(l.variantId));
        setLines(saved);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lines)).catch(() => {});
  }, [lines, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const setQuantity = (variantId: string, quantity: number) =>
      setLines((prev) =>
        quantity <= 0
          ? prev.filter((l) => l.variantId !== variantId)
          : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
      );

    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + (getVariant(l.variantId)?.variant.price ?? 0) * l.quantity, 0),
      add: (variantId, quantity = 1) =>
        setLines((prev) =>
          prev.some((l) => l.variantId === variantId)
            ? prev.map((l) => (l.variantId === variantId ? { ...l, quantity: l.quantity + quantity } : l))
            : [...prev, { variantId, quantity }],
        ),
      setQuantity,
      remove: (variantId) => setQuantity(variantId, 0),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
