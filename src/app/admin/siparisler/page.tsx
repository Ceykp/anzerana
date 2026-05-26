"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/context/cart-context";

type Order = {
  id: string;
  order_code: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  shipping_city: string;
  shipping_district: string;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
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

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [releaseMessage, setReleaseMessage] = useState("");
  const [isReleasingExpired, setIsReleasingExpired] = useState(false);

  async function loadOrders() {
    setLoadingOrders(true);

    const response = await fetch("/api/admin/orders");
    const result = await response.json().catch(() => null);

    if (response.ok) {
      setOrders(result?.orders ?? []);
    }

    setLoadingOrders(false);
  }

  useEffect(() => {
    if (session?.user?.role === "admin") {
      loadOrders();
    }
  }, [session]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderCode = order.order_code ?? "";
      const searchable = `${order.id} ${orderCode} ${order.customer_name} ${
        order.customer_phone
      } ${order.customer_email ?? ""} ${order.shipping_city} ${
        order.shipping_district
      }`.toLocaleLowerCase("tr");

      const matchesQuery = searchable.includes(query.toLocaleLowerCase("tr"));

      const matchesStatus =
        statusFilter === "Tümü" || order.order_status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 text-emerald-950 dark:text-white">
        Yükleniyor...
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-3xl font-semibold text-emerald-950 dark:text-white">
          Yetkisiz Erişim
        </h1>
        <p className="mt-3 text-emerald-900/75 dark:text-slate-300">
          Bu sayfaya erişim izniniz yok.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
              Admin / Siparişler
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-white">
              Sipariş Yönetimi
            </h1>

            <p className="mt-2 text-sm text-emerald-900/75 dark:text-slate-300">
              Toplam {orders.length} sipariş listeleniyor.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isReleasingExpired}
              onClick={async () => {
                setReleaseMessage("");
                setIsReleasingExpired(true);

                const response = await fetch(
                  "/api/admin/orders/release-expired",
                  {
                    method: "POST",
                  },
                );

                const result = await response.json().catch(() => null);

                setIsReleasingExpired(false);

                if (!response.ok) {
                  setReleaseMessage(
                    result?.error
                      ? `Rezerv temizleme hatası: ${result.error}`
                      : "Süresi dolan rezervler temizlenemedi.",
                  );

                  return;
                }

                setReleaseMessage(
                  `${result?.releasedCount ?? 0} rezerv serbest bırakıldı.`,
                );

                await loadOrders();
              }}
              className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-700 dark:hover:bg-rose-600"
            >
              {isReleasingExpired
                ? "Temizleniyor..."
                : "Süresi Dolan Rezervleri Temizle"}
            </button>

            <Link
              href="/admin"
              className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
            >
              Admin Panele Dön
            </Link>
          </div>
        </div>

        {releaseMessage ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            {releaseMessage}
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_260px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sipariş no, müşteri, telefon veya şehir ara"
            className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
          >
            <option>Tümü</option>
            <option value="pending">Beklemede</option>
            <option value="confirmed">Onaylandı</option>
            <option value="preparing">Hazırlanıyor</option>
            <option value="shipped">Kargoya Verildi</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <div className="grid grid-cols-[1.35fr_1fr_120px_150px_150px_110px] gap-3 border-b border-amber-100 bg-amber-50/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-300">
          <span>Müşteri</span>
          <span>Adres</span>
          <span>Tutar</span>
          <span>Sipariş</span>
          <span>Ödeme</span>
          <span>İşlem</span>
        </div>

        {loadingOrders ? (
          <div className="p-6 text-sm text-emerald-900/75 dark:text-slate-300">
            Siparişler yükleniyor...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-6 text-sm text-emerald-900/75 dark:text-slate-300">
            Sipariş bulunamadı.
          </div>
        ) : (
          <div className="divide-y divide-amber-100 dark:divide-emerald-900">
            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="grid grid-cols-[1.35fr_1fr_120px_150px_150px_110px] items-center gap-3 px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-semibold text-emerald-950 dark:text-white">
                    {order.customer_name}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    {order.order_code ?? `#${order.id.slice(0, 8)}`}
                  </p>

                  <p className="mt-1 text-xs text-emerald-900/60 dark:text-slate-400">
                    {order.customer_phone}
                  </p>
                </div>

                <p className="text-emerald-900/75 dark:text-slate-300">
                  {order.shipping_city} / {order.shipping_district}
                </p>

                <p className="font-semibold text-emerald-950 dark:text-white">
                  {formatPrice(Number(order.total))}
                </p>

                <span className="w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-400 dark:text-slate-950">
                  {orderStatusLabels[order.order_status] ?? order.order_status}
                </span>

                <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {paymentStatusLabels[order.payment_status] ??
                    order.payment_status}
                </span>

                <Link
                  href={`/admin/siparisler/${order.id}`}
                  className="rounded-full bg-emerald-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
                >
                  Detay
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}