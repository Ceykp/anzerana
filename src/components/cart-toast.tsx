"use client";

import { useEffect } from "react";
import { useCart } from "@/context/cart-context";

export function CartToast() {
  const { lastAddedMessage, clearToast } = useCart();

  useEffect(() => {
    if (!lastAddedMessage) return;
    const timeout = setTimeout(clearToast, 2200);
    return () => clearTimeout(timeout);
  }, [lastAddedMessage, clearToast]);

  if (!lastAddedMessage) return null;

  return (
    <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full border border-amber-200 bg-white px-5 py-2 text-sm text-emerald-950 shadow-md">
      {lastAddedMessage}
    </div>
  );
}
