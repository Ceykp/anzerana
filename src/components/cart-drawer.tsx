"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, useCart } from "@/context/cart-context";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    freeShippingRemaining,
    freeShippingProgress,
    hasFreeShipping,
  } = useCart();

  const shippingFee = items.length > 0 && !hasFreeShipping ? 200 : 0;
  const total = subtotal + shippingFee;

  return (
    <div
    className={`fixed inset-0 z-[9999] transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
        aria-label="Sepeti Kapat"
      />

      <aside
        className={`absolute right-0 top-0 z-[121] flex h-full w-full max-w-md flex-col border-l border-amber-100 bg-white shadow-2xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-amber-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Anzerana
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-emerald-950">
                Sepetim
              </h2>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="rounded-full border border-amber-100 bg-amber-50 px-3 py-2 text-emerald-900 hover:bg-amber-100"
              aria-label="Sepeti Kapat"
            >
              ✕
            </button>
          </div>

          {items.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
              {hasFreeShipping ? (
                <p className="text-sm font-semibold text-emerald-900">
                  Tebrikler, Ücretsiz Kargo Hakkı Kazandınız.
                </p>
              ) : (
                <p className="text-sm font-semibold text-emerald-900">
                  Ücretsiz Kargo İçin {formatPrice(freeShippingRemaining)} Daha
                  Ekleyin.
                </p>
              )}

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-emerald-900 transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-emerald-900/65">
                <span>0 TL</span>
                <span>3.500 TL</span>
              </div>
            </div>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-5">
            <div className="rounded-3xl border border-amber-100 bg-amber-50/40 p-6 text-center">
              <p className="text-lg font-semibold text-emerald-950">
                Sepetiniz Şu An Boş
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-900/75">
                Seçtiğiniz Ürünleri Ekleyerek Alışverişe Başlayabilirsiniz.
              </p>

              <Link
                href="/urunler"
                onClick={closeCart}
                className="mt-5 inline-flex rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Ürünleri İncele
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto p-5 pb-56">
            {items.map((item) => {
              const key = `${item.productId}:${item.variantId}`;
              const lineTotal = item.unitPrice * item.quantity;
              const image = item.image || "/images/placeholder-product.jpg";

              return (
                <article
                  key={key}
                  className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    <Link
                      href={`/urunler/${item.productSlug}`}
                      onClick={closeCart}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-amber-100 bg-amber-50"
                    >
                      <Image
                        src={image}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/urunler/${item.productSlug}`}
                        onClick={closeCart}
                        className="line-clamp-1 font-semibold text-emerald-950 hover:underline"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-xs text-emerald-900/70">
                        {item.variantLabel}
                      </p>
                      <p className="mt-1 text-sm font-medium text-emerald-900">
                        {item.unitPriceText}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-amber-200 bg-amber-50/50">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-sm text-emerald-900"
                        onClick={() => updateQuantity(key, item.quantity - 1)}
                        aria-label="Miktarı Azalt"
                      >
                        -
                      </button>
                      <span className="min-w-7 text-center text-sm font-semibold text-emerald-950">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-1.5 text-sm text-emerald-900"
                        onClick={() => updateQuantity(key, item.quantity + 1)}
                        aria-label="Miktarı Artır"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-950">
                        {formatPrice(lineTotal)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        className="mt-1 text-xs text-rose-600 hover:underline"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-amber-100 bg-[#fffdf8] p-4 shadow-xl">
          <div className="space-y-2 border-b border-amber-100 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-emerald-900/70">Ara Toplam</p>
              <p className="text-sm font-semibold text-emerald-950">
                {formatPrice(subtotal)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-emerald-900/70">Kargo</p>
              <p className="text-sm font-semibold text-emerald-950">
                {items.length === 0
                  ? formatPrice(0)
                  : hasFreeShipping
                    ? "Ücretsiz"
                    : formatPrice(shippingFee)}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-emerald-950">Toplam</p>
            <p className="text-2xl font-semibold text-emerald-950">
              {formatPrice(total)}
            </p>
          </div>

          <p className="mt-1 text-xs leading-5 text-emerald-900/60">
            Kargo ücreti 3.500 TL altı siparişlerde 200 TL olarak hesaplanır.
          </p>

          <div className="mt-3 flex gap-2">
            <Link
              href="/urunler"
              onClick={closeCart}
              className="flex-1 rounded-full border border-emerald-900 px-4 py-2 text-center text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
            >
              Alışverişe Devam
            </Link>

            <Link
              href="/sepet"
              onClick={closeCart}
              className="flex-1 rounded-full bg-emerald-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Sepete Git
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}