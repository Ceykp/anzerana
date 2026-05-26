"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/context/cart-context";

type TrackingOrder = {
  id: string;
  order_code: string | null;
  customer_name: string;
  customer_phone: string;
  shipping_city: string;
  shipping_district: string;
  total: number;
  payment_status: string;
  order_status: string;
  cargo_company: string | null;
  cargo_tracking_code: string | null;
  cargo_tracking_url: string | null;
  created_at: string;
};

type TrackingItem = {
  product_name: string;
  variant_label: string;
  quantity: number;
  line_total: number;
};

const orderStatusLabels: Record<string, string> = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  preparing: "Hazırlanıyor",
  shipped: "Kargoya Verildi",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Ödeme Bekliyor",
  paid: "Ödendi",
  failed: "Başarısız",
  refunded: "İade Edildi",
};

export default function SiparisTakipPage() {
  const [orderCode, setOrderCode] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [items, setItems] = useState<TrackingItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
          Anzerana
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-white">
          Sipariş Takip
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
          Sipariş numaranız ve telefon bilginizle siparişinizin durumunu,
          ödeme bilgisini ve kargo takip detaylarını görüntüleyebilirsiniz.
        </p>

        <form
          className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={async (event) => {
            event.preventDefault();

            setMessage("");
            setOrder(null);
            setItems([]);
            setLoading(true);

            const response = await fetch("/api/order-tracking", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderCode, phone }),
            });

            const result = await response.json().catch(() => null);

            setLoading(false);

            if (!response.ok) {
              setMessage(result?.error ?? "Sipariş bulunamadı.");
              return;
            }

            setOrder(result.order);
            setItems(result.items ?? []);
          }}
        >
          <input
            value={orderCode}
            onChange={(event) => setOrderCode(event.target.value)}
            placeholder="Sipariş No: ANZ-20260524-0001"
            className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
          />

          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Telefon"
            className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60 dark:bg-emerald-700"
          >
            {loading ? "Sorgulanıyor..." : "Sorgula"}
          </button>
        </form>

        {message ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
            {message}
          </div>
        ) : null}
      </div>

      {order ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="space-y-5">
            <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
                Sipariş Özeti
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
                  <p className="text-xs text-emerald-900/60 dark:text-slate-400">
                    Sipariş No
                  </p>
                  <p className="mt-1 font-semibold text-emerald-950 dark:text-white">
                    {order.order_code ?? order.id.slice(0, 8)}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
                  <p className="text-xs text-emerald-900/60 dark:text-slate-400">
                    Tarih
                  </p>
                  <p className="mt-1 font-semibold text-emerald-950 dark:text-white">
                    {new Date(order.created_at).toLocaleString("tr-TR")}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
                  <p className="text-xs text-emerald-900/60 dark:text-slate-400">
                    Sipariş Durumu
                  </p>
                  <p className="mt-1 font-semibold text-emerald-950 dark:text-white">
                    {orderStatusLabels[order.order_status] ??
                      order.order_status}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
                  <p className="text-xs text-emerald-900/60 dark:text-slate-400">
                    Ödeme Durumu
                  </p>
                  <p className="mt-1 font-semibold text-emerald-950 dark:text-white">
                    {paymentStatusLabels[order.payment_status] ??
                      order.payment_status}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
                Ürünler
              </h2>

              <div className="mt-4 space-y-3">
                {items.map((item, index) => (
                  <div
                    key={`${item.product_name}-${index}`}
                    className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-emerald-950 dark:text-white">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-sm text-emerald-900/70 dark:text-slate-300">
                          {item.variant_label} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-emerald-950 dark:text-white">
                        {formatPrice(Number(item.line_total))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="h-fit space-y-5 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
                Kargo Bilgileri
              </h2>

              <div className="mt-4 space-y-3 text-sm text-emerald-900/75 dark:text-slate-300">
                <p>
                  <strong>Alıcı:</strong> {order.customer_name}
                </p>
                <p>
                  <strong>Adres:</strong> {order.shipping_city} /{" "}
                  {order.shipping_district}
                </p>
                <p>
                  <strong>Kargo Firması:</strong>{" "}
                  {order.cargo_company || "Henüz belirlenmedi"}
                </p>
                <p>
                  <strong>Takip Kodu:</strong>{" "}
                  {order.cargo_tracking_code || "-"}
                </p>
              </div>

              {order.cargo_tracking_url ? (
                <a
                  href={order.cargo_tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block rounded-full bg-emerald-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
                >
                  Kargo Takip Sayfasına Git
                </a>
              ) : (
                <p className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/50 p-3 text-xs leading-5 text-emerald-900/75 dark:border-emerald-800 dark:bg-slate-950 dark:text-slate-300">
                  Kargo bilgileri siparişiniz kargoya verildiğinde burada
                  görüntülenecektir.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
                Toplam
              </h2>

              <p className="mt-3 text-3xl font-semibold text-emerald-950 dark:text-white">
                {formatPrice(Number(order.total))}
              </p>

              <Link
                href="/urunler"
                className="mt-5 block rounded-full border border-emerald-900 px-5 py-3 text-center text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
              >
                Ürünlere Dön
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}