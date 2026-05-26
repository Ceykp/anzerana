"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OdemeContent() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");
  const orderId = searchParams.get("orderId");

  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div
        className={`rounded-3xl border p-8 text-center shadow-sm ${
          isSuccess
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
            : "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-[0.22em] ${
            isSuccess
              ? "text-emerald-700 dark:text-emerald-200"
              : "text-rose-700 dark:text-rose-200"
          }`}
        >
          Anzerana Ödeme
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-emerald-950 dark:text-white">
          {isSuccess ? "Ödeme Başarılı" : "Ödeme Tamamlanamadı"}
        </h1>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-900/80 dark:text-slate-200">
          {isSuccess
            ? "Ödemeniz başarıyla alındı ve siparişiniz oluşturuldu."
            : "Ödeme işlemi tamamlanamadı. Kart bilgileriniz, limitiniz veya banka onay süreciniz nedeniyle işlem başarısız olmuş olabilir."}
        </p>

        {isSuccess ? (
          <div className="mx-auto mt-5 max-w-md rounded-2xl border border-emerald-200 bg-white p-4 text-left dark:border-emerald-800 dark:bg-slate-900">
            <p className="text-sm text-emerald-900/70 dark:text-slate-300">
              Sipariş Numaranız
            </p>

            <p className="mt-1 text-xl font-semibold text-emerald-950 dark:text-white">
              {orderCode || orderId || "-"}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {isSuccess ? (
            <Link
              href="/profil#siparisler"
              className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
            >
              Siparişlerime Git
            </Link>
          ) : (
            <Link
              href="/sepet"
              className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
            >
              Sepete Dön
            </Link>
          )}

          <Link
            href="/urunler"
            className="rounded-full border border-emerald-900 px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
          >
            Ürünleri İncele
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OdemePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-16 text-emerald-950 dark:text-white">
          Ödeme sonucu yükleniyor...
        </div>
      }
    >
      <OdemeContent />
    </Suspense>
  );
}