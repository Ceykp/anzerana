"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeChip } from "@/components/badge-chip";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

function getProductSignal(productId: string) {
  const seed = productId
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return {
    viewers: (seed % 7) + 3,
    soldToday: (seed % 11) + 4,
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-500 dark:text-amber-300">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden="true">
          {star <= Math.round(rating) ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const isPackageProduct = Boolean(product.packageContents?.length);
  const isPremiumProduct =
    product.category === "Anzer Balı" ||
    product.badge === "premium" ||
    product.badge === "özel-seçki";

  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  const activeVariant =
    product.variants.find((variant) => variant.href === `/urunler/${product.slug}`) ??
    product.variants[0];

  const isFavorite = has(product.id);
  const signal = getProductSignal(product.id);
  const productImage = product.images?.[0] ?? "/images/placeholder-product.jpg";

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:shadow-black/20 ${
        isPremiumProduct
          ? "border-amber-300 bg-gradient-to-br from-white via-amber-50/40 to-white dark:border-amber-500/40 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-950"
          : "border-amber-100 bg-white dark:border-emerald-900 dark:bg-slate-900"
      }`}
    >
      {isPremiumProduct ? (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-amber-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-900 shadow-sm dark:bg-amber-400 dark:text-slate-950">
          Premium
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-label={isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
        className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm shadow-sm transition ${
          isFavorite
            ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/50 dark:bg-rose-950 dark:text-rose-300"
            : "border-amber-100 bg-white text-emerald-900 hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-emerald-900"
        }`}
      >
        ♥
      </button>

      <Link href={`/urunler/${product.slug}`} className="block">
        <div className="relative h-48 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-amber-100/40 dark:border-emerald-900 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/50">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 dark:from-black/40" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
            {product.category}
          </p>

          {product.storageType ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-100">
              Dolap Ürünü
            </span>
          ) : null}
        </div>

        <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-emerald-950 dark:text-white">
          {product.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-900/70 dark:text-slate-300">
          <Stars rating={product.ratingSummary ?? 0} />
          <span className="font-semibold text-emerald-900 dark:text-slate-100">
            {(product.ratingSummary ?? 0).toFixed(1)}
          </span>
          <span>({product.reviewCount ?? 0} Değerlendirme)</span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-emerald-950/75 dark:text-slate-300">
          {product.shortDescription}
        </p>
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
      {product.id === "kahvalti-paketi" ? (
  <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-800 dark:bg-amber-400 dark:text-slate-950">
    Ücretsiz Kargo
  </p>
) : null}
        {product.badge ? <BadgeChip badge={product.badge} /> : null}

        {isPackageProduct ? (
          <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
            Paket Ürünü
          </p>
        ) : null}
      </div>

      {product.variants.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {product.variants.slice(0, 3).map((variant, index) => (
            <span
              key={`${product.id}-${variant.id}-${index}`}
              className="rounded-full border border-amber-100 bg-amber-50/60 px-3 py-1 text-xs font-medium text-emerald-900 dark:border-emerald-800 dark:bg-slate-950 dark:text-slate-200"
            >
              {variant.label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 rounded-2xl border border-amber-100 bg-amber-50/40 p-3 text-xs text-emerald-900/75 dark:border-emerald-900 dark:bg-slate-950/70 dark:text-slate-300">
        <p>
          <span className="font-semibold text-emerald-950 dark:text-white">
            {signal.viewers} Kişi
          </span>{" "}
          Şu An Bu Ürünü İnceliyor
        </p>
        <p>
          Son 24 Saatte{" "}
          <span className="font-semibold text-emerald-950 dark:text-white">
            {signal.soldToday} Kez
          </span>{" "}
          Sepete Eklendi
        </p>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-emerald-900/55 dark:text-slate-400">
            Başlangıç Fiyatı
          </p>
          <p className="text-lg font-semibold text-emerald-950 dark:text-white">
            {activeVariant?.price ?? product.price ?? "Fiyat Bilgisi Yakında"}
          </p>
        </div>

        {product.compareAtPrice ? (
          <p className="text-xs text-emerald-900/45 line-through dark:text-slate-500">
            {product.compareAtPrice}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Link
          href={`/urunler/${product.slug}`}
          className="rounded-full border border-emerald-900 px-4 py-2.5 text-center text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-slate-100 dark:hover:bg-emerald-900"
        >
          İncele
        </Link>

        <button
          type="button"
          onClick={() => {
            if (!activeVariant) return;
            addItem(product, activeVariant);
          }}
          className="rounded-full bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600"
        >
          Sepete Ekle
        </button>
      </div>
    </article>
  );
}