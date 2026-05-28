"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/auth-context";

type WishlistContextType = {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clearWishlist: () => void;
};

const STORAGE_KEY_PREFIX = "anzerana-wishlist-v1";

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

function getSafeAccountKey(email?: string | null) {
  if (!email) return "guest";

  return email.trim().toLocaleLowerCase("tr").replace(/[^a-z0-9@._-]/gi, "");
}

function getWishlistStorageKey(accountKey: string) {
  return `${STORAGE_KEY_PREFIX}:${accountKey}`;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user } = useAuth();

  const activeEmail = session?.user?.email ?? user?.email ?? null;
  const accountKey = getSafeAccountKey(activeEmail);
  const storageKey = getWishlistStorageKey(accountKey);

  const [ids, setIds] = useState<string[]>([]);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const raw = localStorage.getItem(storageKey);

    if (!raw) {
      setIds([]);
      setLoadedStorageKey(storageKey);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setIds(normalizeIds(parsed));
    } catch {
      localStorage.removeItem(storageKey);
      setIds([]);
    } finally {
      setLoadedStorageKey(storageKey);
    }
  }, [storageKey, status]);

  useEffect(() => {
    if (loadedStorageKey !== storageKey) return;

    localStorage.setItem(storageKey, JSON.stringify(ids));
  }, [ids, storageKey, loadedStorageKey]);

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
    localStorage.removeItem(storageKey);
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