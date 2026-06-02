"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import type { Product, ProductVariant } from "@/lib/products";
import { useAuth } from "@/context/auth-context";

export type CartItem = {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  variantId: string;
  variantLabel: string;
  unitPriceText: string;
  unitPrice: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  uniqueItemCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  hasFreeShipping: boolean;
  hasOnlyIntroPackage: boolean;
  shippingCost: number;
  grandTotal: number;
  addItem: (product: Product, variant: ProductVariant) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  incrementItem: (key: string) => void;
  decrementItem: (key: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  lastAddedMessage: string | null;
  clearToast: () => void;
};

const STORAGE_KEY_PREFIX = "anzerana-cart-v1";
const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 200;
const INTRO_PACKAGE_PRODUCT_ID = "kahvalti-paketi";

const CartContext = createContext<CartContextType | null>(null);

function getItemKey(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

function getSafeAccountKey(email?: string | null) {
  if (!email) return "guest";
  return email.trim().toLowerCase().replace(/[^a-z0-9@._-]/gi, "");
}

function getCartStorageKey(accountKey: string) {
  return `${STORAGE_KEY_PREFIX}:${accountKey}`;
}

function parsePrice(priceText?: string | null) {
  if (!priceText) return 0;

  const normalized = priceText
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is CartItem => {
      return (
        item &&
        typeof item === "object" &&
        "productId" in item &&
        "variantId" in item &&
        "quantity" in item
      );
    })
    .map((item) => {
      const unitPriceText =
        typeof item.unitPriceText === "string"
          ? item.unitPriceText
          : "Fiyat Bilgisi Çok Yakında Paylaşılacaktır";

      return {
        productId: String(item.productId),
        productName: String(item.productName ?? "Ürün"),
        productSlug: String(item.productSlug ?? ""),
        image: String(item.image ?? "/images/placeholder-product.jpg"),
        variantId: String(item.variantId),
        variantLabel: String(item.variantLabel ?? "Standart"),
        unitPriceText,
        unitPrice:
          typeof item.unitPrice === "number"
            ? item.unitPrice
            : parsePrice(unitPriceText),
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    });
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCartItemKey(productId: string, variantId: string) {
  return getItemKey(productId, variantId);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user } = useAuth();

  const sessionEmail = session?.user?.email ?? null;
  const localEmail = user?.email ?? null;
  const activeEmail = sessionEmail ?? localEmail;
  const isDatabaseUser = Boolean(sessionEmail);

  const accountKey = getSafeAccountKey(activeEmail);
  const storageKey = getCartStorageKey(accountKey);

  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedMessage, setLastAddedMessage] = useState<string | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    let cancelled = false;

    async function loadCart() {
      setLoadedKey(null);

      if (isDatabaseUser) {
        try {
          const response = await fetch("/api/account/cart", {
            method: "GET",
          });

          const result = await response.json().catch(() => null);

          if (!cancelled) {
            if (response.ok) {
              setItems(normalizeCartItems(result?.items ?? []));
            } else {
              setItems([]);
            }

            setLoadedKey(storageKey);
          }

          return;
        } catch {
          if (!cancelled) {
            setItems([]);
            setLoadedKey(storageKey);
          }

          return;
        }
      }

      const raw = localStorage.getItem(storageKey);

      if (!raw) {
        setItems([]);
        setLoadedKey(storageKey);
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        setItems(normalizeCartItems(parsed));
      } catch {
        localStorage.removeItem(storageKey);
        setItems([]);
      } finally {
        setLoadedKey(storageKey);
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [storageKey, status, isDatabaseUser]);

  useEffect(() => {
    if (loadedKey !== storageKey) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      if (isDatabaseUser) {
        await fetch("/api/account/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items }),
        }).catch(() => null);

        return;
      }

      localStorage.setItem(storageKey, JSON.stringify(items));
    }, 350);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [items, storageKey, loadedKey, isDatabaseUser]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const uniqueItemCount = items.length;

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
      ),
    [items],
  );

  const hasOnlyIntroPackage =
    items.length > 0 &&
    items.every((item) => item.productId === INTRO_PACKAGE_PRODUCT_ID);

  const hasFreeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || hasOnlyIntroPackage;

  const shippingCost = items.length === 0 || hasFreeShipping ? 0 : SHIPPING_COST;
  const grandTotal = subtotal + shippingCost;

  const freeShippingRemaining = hasFreeShipping
    ? 0
    : Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const freeShippingProgress = hasFreeShipping
    ? 100
    : Math.min(Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100), 100);

  function addItem(product: Product, variant: ProductVariant) {
    const key = getItemKey(product.id, variant.id);
    const unitPriceText =
      variant.price ??
      product.price ??
      "Fiyat Bilgisi Çok Yakında Paylaşılacaktır";
    const unitPrice = parsePrice(unitPriceText);

    setItems((prev) => {
      const found = prev.find(
        (item) => getItemKey(item.productId, item.variantId) === key,
      );

      if (found) {
        return prev.map((item) =>
          getItemKey(item.productId, item.variantId) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          image: product.images[0] ?? "/images/placeholder-product.jpg",
          variantId: variant.id,
          variantLabel: variant.label,
          unitPriceText,
          unitPrice,
          quantity: 1,
        },
      ];
    });

    setLastAddedMessage(`${product.name} (${variant.label}) sepete eklendi.`);
    setIsOpen(true);
  }

  function removeItem(key: string) {
    setItems((prev) =>
      prev.filter((item) => getItemKey(item.productId, item.variantId) !== key),
    );
  }

  function updateQuantity(key: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(key);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        getItemKey(item.productId, item.variantId) === key
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  function incrementItem(key: string) {
    setItems((prev) =>
      prev.map((item) =>
        getItemKey(item.productId, item.variantId) === key
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decrementItem(key: string) {
    setItems((prev) =>
      prev
        .map((item) =>
          getItemKey(item.productId, item.variantId) === key
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  async function clearCart() {
    setItems([]);

    if (isDatabaseUser) {
      await fetch("/api/account/cart", {
        method: "DELETE",
      }).catch(() => null);

      return;
    }

    localStorage.removeItem(storageKey);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        uniqueItemCount,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        freeShippingProgress,
        hasFreeShipping,
        hasOnlyIntroPackage,
        shippingCost,
        grandTotal,
        addItem,
        removeItem,
        updateQuantity,
        incrementItem,
        decrementItem,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        lastAddedMessage,
        clearToast: () => setLastAddedMessage(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}