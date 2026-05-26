"use client";

import { useState } from "react";
import { VariantSelector } from "@/components/variant-selector";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import type { Product, ProductVariant } from "@/lib/products";

type ProductDetailActionsProps = {
  product: Product;
};

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const defaultVariant =
  product.variants.find((variant) => variant.href === `/urunler/${product.slug}`) ??
  product.variants.find((variant) => variant.id === product.slug) ??
  product.variants[0] ??
  { id: "varsayilan", label: "Standart", price: product.price ?? null };

const [selectedVariant, setSelectedVariant] =
  useState<ProductVariant>(defaultVariant);

  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const stockQuantity = product.stockQuantity ?? 0;
  const trackStock = Boolean(product.trackStock);
  const allowBackorder = Boolean(product.allowBackorder);
  const lowStockThreshold = product.lowStockThreshold ?? 3;

  const isOutOfStock = trackStock && stockQuantity <= 0 && !allowBackorder;
  const isLowStock =
    trackStock &&
    stockQuantity > 0 &&
    stockQuantity <= lowStockThreshold;

  const message = encodeURIComponent(
    `Merhaba, ${product.name} ürünü (${selectedVariant.label}) için bilgi almak istiyorum.`,
  );

  return (
    <div className="mt-8 space-y-5">
      <VariantSelector
        variants={product.variants}
        onChange={setSelectedVariant}
      />

      {trackStock ? (
        <div
          className={`rounded-2xl border p-4 text-sm font-semibold ${
            isOutOfStock
              ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
              : isLowStock
                ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
          }`}
        >
          {isOutOfStock
            ? "Bu ürün şu anda stokta yok."
            : isLowStock
              ? `Sınırlı stok: Son ${stockQuantity} ürün.`
              : `Stokta var: ${stockQuantity} adet.`}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => {
            if (isOutOfStock) return;
            addItem(product, selectedVariant);
          }}
          className="inline-flex rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:bg-emerald-700 dark:hover:bg-emerald-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
        >
          {isOutOfStock ? "Stokta Yok" : "Sepete Ekle"}
        </button>

        <a
          href={`https://wa.me/05400426153?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full border border-emerald-900 px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-900 hover:text-white dark:border-emerald-700 dark:text-slate-100 dark:hover:bg-emerald-800"
        >
          WhatsApp ile Sipariş
        </a>

        <button
          type="button"
          onClick={() => toggle(product.id)}
          className="inline-flex rounded-full border border-amber-200 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:text-slate-100 dark:hover:bg-slate-950"
        >
          {has(product.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        </button>
      </div>
    </div>
  );
}