"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { ProductVariant } from "@/lib/products";

type VariantSelectorProps = {
  variants: ProductVariant[];
  onChange?: (variant: ProductVariant) => void;
};

export function VariantSelector({ variants, onChange }: VariantSelectorProps) {
  const pathname = usePathname();
  const hasSingleVariant = variants.length <= 1;

  const selectedVariant = useMemo(() => {
    return variants.find((variant) => variant.href === pathname) ?? variants[0];
  }, [pathname, variants]);

  return (
    <div className="rounded-2xl border border-amber-100 bg-[#fffdf9] p-4 transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-950/70">
      <p className="text-sm font-medium text-emerald-950 dark:text-white">
        Gramaj / Seçenek
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant, index) => {
          const isSelected = variant.href === pathname;

          if (variant.href && !isSelected) {
            return (
              <Link
                key={`${variant.id}-${index}`}
                href={variant.href}
                onClick={() => onChange?.(variant)}
                className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm text-emerald-900 transition hover:border-emerald-200 hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-amber-400 dark:hover:bg-emerald-900"
              >
                {variant.label}
              </Link>
            );
          }

          return (
            <button
              key={`${variant.id}-${index}`}
              type="button"
              disabled
              className="rounded-full border border-emerald-900 bg-emerald-900 px-4 py-2 text-sm text-white shadow-sm dark:border-amber-400 dark:bg-amber-400 dark:text-slate-950"
              aria-pressed="true"
            >
              {variant.label}
            </button>
          );
        })}
      </div>

      {hasSingleVariant ? (
        <p className="mt-2 text-xs text-emerald-900/70 dark:text-slate-400">
          Bu Ürün Tek Gramaj Seçeneğiyle Sunulmaktadır.
        </p>
      ) : (
        <p className="mt-2 text-xs text-emerald-900/70 dark:text-slate-400">
          Farklı Gramaj Seçeneklerine Tıklayarak İlgili Ürün Sayfasına
          Geçebilirsiniz.
        </p>
      )}

      <p className="mt-3 text-sm font-semibold text-emerald-900 dark:text-amber-200">
        {selectedVariant?.price ?? "Fiyat Bilgisi Çok Yakında Paylaşılacaktır"}
      </p>
    </div>
  );
}