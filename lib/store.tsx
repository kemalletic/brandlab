"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  slug: string;
  velicina: string;
  kolicina: number;
}

interface ToastMsg {
  id: number;
  poruka: string;
}

interface StoreCtxValue {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toasts: ToastMsg[];
  hydrated: boolean;
  addToCart: (slug: string, velicina: string) => void;
  updateQty: (slug: string, velicina: string, delta: number) => void;
  removeFromCart: (slug: string, velicina: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  toast: (poruka: string) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreCtxValue | null>(null);

const CART_KEY = "brandlab.cart";
const WISHLIST_KEY = "brandlab.wishlist";

function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const toastId = useRef(0);

  // Hidracija iz localStorage nakon montiranja. Server nema pristup
  // localStorage-u, pa prvi render mora proći s praznom korpom i tek se onda
  // uskladiti — inače se serverski i klijentski HTML razlikuju. Zato je ovdje
  // setState u efektu namjeran, a potrošači čekaju `hydrated` prije prikaza.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setCart(readLocalStorage(CART_KEY, [] as CartItem[]));
    setWishlist(readLocalStorage(WISHLIST_KEY, [] as string[]));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const toast = useCallback((poruka: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, poruka }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addToCart = useCallback(
    (slug: string, velicina: string) => {
      setCart((prev) => {
        const existing = prev.find(
          (i) => i.slug === slug && i.velicina === velicina,
        );
        if (existing) {
          return prev.map((i) =>
            i.slug === slug && i.velicina === velicina
              ? { ...i, kolicina: i.kolicina + 1 }
              : i,
          );
        }
        return [...prev, { slug, velicina, kolicina: 1 }];
      });
      setCartOpen(true);
      toast("Dodano u korpu");
    },
    [toast],
  );

  const updateQty = useCallback(
    (slug: string, velicina: string, delta: number) => {
      setCart((prev) =>
        prev
          .map((i) =>
            i.slug === slug && i.velicina === velicina
              ? { ...i, kolicina: Math.max(1, i.kolicina + delta) }
              : i,
          )
          .filter((i) => i.kolicina > 0),
      );
    },
    [],
  );

  const removeFromCart = useCallback((slug: string, velicina: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.slug === slug && i.velicina === velicina)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (slug: string) => {
      setWishlist((prev) => {
        const has = prev.includes(slug);
        toast(has ? "Uklonjeno iz favorita" : "Dodano u favorite");
        return has ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    [toast],
  );

  const isWishlisted = useCallback(
    (slug: string) => wishlist.includes(slug),
    [wishlist],
  );

  const value = useMemo<StoreCtxValue>(
    () => ({
      cart,
      wishlist,
      cartOpen,
      searchOpen,
      menuOpen,
      toasts,
      hydrated,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      setCartOpen,
      setSearchOpen,
      setMenuOpen,
      toast,
      dismissToast,
    }),
    [
      cart,
      wishlist,
      cartOpen,
      searchOpen,
      menuOpen,
      toasts,
      hydrated,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      toast,
      dismissToast,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreCtxValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore mora biti unutar StoreProvider-a");
  return ctx;
}
