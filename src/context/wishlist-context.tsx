"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type WishlistContextType = {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clearWishlist: () => void;
};

const STORAGE_KEY = "anzerana-wishlist-v1";

const WishlistContext = createContext<WishlistContextType | null>(null);

function normalizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      setIsReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setIds(normalizeIds(parsed));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, isReady]);

  function add(id: string) {
    const cleanId = id.trim();
    if (!cleanId) return;

    setIds((prev) => {
      if (prev.includes(cleanId)) return prev;
      return [...prev, cleanId];
    });
  }

  function remove(id: string) {
    setIds((prev) => prev.filter((item) => item !== id));
  }

  function toggle(id: string) {
    const cleanId = id.trim();
    if (!cleanId) return;

    setIds((prev) =>
      prev.includes(cleanId)
        ? prev.filter((item) => item !== cleanId)
        : [...prev, cleanId],
    );
  }

  function has(id: string) {
    return ids.includes(id);
  }

  function clearWishlist() {
    setIds([]);
  }

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      has,
      add,
      remove,
      toggle,
      clearWishlist,
    }),
    [ids],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}