"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
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
  shipping_address: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  customer_note: string | null;
  created_at: string;
  reservation_expires_at: string | null;
  stock_reserved: boolean;
  stock_committed: boolean;
  stock_released: boolean;
  cargo_company: string | null;
  cargo_tracking_code: string | null;
  cargo_tracking_url: string | null;
  cargo_status: string | null;
  cargo_created_at: string | null;
  cargo_delivered_at: string | null;
};

type OrderItem = {
  id: string;
  product_slug: string;
  product_name: string;
  variant_label: string;
  unit_price: number;
  unit_price_text: string | null;
  quantity: number;
  line_total: number;
  image: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const orderStatusOptions = [
  ["pending", "Beklemede"],
  ["confirmed", "Onaylandı"],
  ["preparing", "Hazırlanıyor"],
  ["shipped", "Kargoya Verildi"],
  ["completed", "Tamamlandı"],
  ["cancelled", "İptal Edildi"],
];

const paymentStatusOptions = [
  ["pending", "Ödeme Bekliyor"],
  ["paid", "Ödendi"],
  ["failed", "Başarısız"],
  ["refunded", "İade Edildi"],
];

const cargoStatusOptions = [
  ["not_shipped", "Henüz Gönderilmedi"],
  ["preparing", "Kargo Hazırlanıyor"],
  ["shipped", "Kargoya Verildi"],
  ["in_transit", "Taşımada"],
  ["delivered", "Teslim Edildi"],
  ["returned", "İade"],
];

function getReservationStatus(order: Order) {
  const isExpired = order.reservation_expires_at
    ? new Date(order.reservation_expires_at).getTime() < Date.now()
    : false;

  if (order.stock_committed) {
    return {
      label: "Stok Kesinleşti",
      detail: "Rezerve edilen stok gerçek stoktan düşüldü.",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
      canRelease: false,
    };
  }

  if (order.stock_released) {
    return {
      label: "Rezerv Serbest",
      detail: "Bu sipariş için ayrılan stok serbest bırakıldı.",
      className:
        "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200",
      canRelease: false,
    };
  }

  if (order.stock_reserved && isExpired) {
    return {
      label: "Rezerv Süresi Doldu",
      detail: "Bu siparişin rezerv süresi dolmuş. Stok serbest bırakılabilir.",
      className:
        "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100",
      canRelease: true,
    };
  }

  if (order.stock_reserved) {
    return {
      label: "Stok Rezerve",
      detail: "Bu sipariş için stok geçici olarak ayrıldı.",
      className:
        "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100",
      canRelease: true,
    };
  }

  return {
    label: "Rezerv Yok",
    detail: "Bu sipariş için aktif stok rezervi yok.",
    className:
      "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200",
    canRelease: false,
  };
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: session, status } = useSession();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [cargoCompany, setCargoCompany] = useState("");
  const [cargoTrackingCode, setCargoTrackingCode] = useState("");
  const [cargoTrackingUrl, setCargoTrackingUrl] = useState("");
  const [cargoStatus, setCargoStatus] = useState("not_shipped");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadOrder() {
    setLoading(true);

    const response = await fetch(`/api/admin/orders/${id}`);
    const result = await response.json().catch(() => null);

    if (response.ok) {
      setOrder(result.order);
      setItems(result.items ?? []);
      setOrderStatus(result.order.order_status);
      setPaymentStatus(result.order.payment_status);
      setCargoCompany(result.order.cargo_company ?? "");
      setCargoTrackingCode(result.order.cargo_tracking_code ?? "");
      setCargoTrackingUrl(result.order.cargo_tracking_url ?? "");
      setCargoStatus(result.order.cargo_status ?? "not_shipped");
    } else {
      setMessageType("error");
      setMessage(result?.error ?? "Sipariş yüklenemedi.");
    }

    setLoading(false);
  }

  async function saveOrderChanges(successMessage: string) {
    if (!order) return;

    setSaving(true);
    setMessage("");
    setMessageType("success");

    const response = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_status: orderStatus,
        payment_status: paymentStatus,
        customer_note: order.customer_note,
        cargo_company: cargoCompany,
        cargo_tracking_code: cargoTrackingCode,
        cargo_tracking_url: cargoTrackingUrl,
        cargo_status: cargoStatus,
      }),
    });

    const result = await response.json().catch(() => null);

    setSaving(false);

    if (!response.ok) {
      setMessageType("error");
      setMessage(result?.error ?? "Sipariş güncellenemedi.");
      return;
    }

    setMessageType("success");
    setMessage(successMessage);

    await loadOrder();
  }

  useEffect(() => {
    if (session?.user?.role === "admin") {
      loadOrder();
    }
  }, [id, session]);

  if (status === "loading" || loading) {
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
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-3xl font-semibold text-emerald-950 dark:text-white">
          Sipariş Bulunamadı
        </h1>
        <p className="mt-3 text-emerald-900/75 dark:text-slate-300">
          {message}
        </p>
      </div>
    );
  }

  const reservationStatus = getReservationStatus(order);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
              Admin / Sipariş Detayı
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-white">
              Sipariş {order.order_code ?? `#${order.id.slice(0, 8)}`}
            </h1>

            <p className="mt-2 text-sm text-emerald-900/75 dark:text-slate-300">
              {new Date(order.created_at).toLocaleString("tr-TR")}
            </p>
          </div>

          <Link
            href="/admin/siparisler"
            className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
          >
            Siparişlere Dön
          </Link>
        </div>
      </div>

      {message ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            messageType === "error"
              ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
              : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Ürünler
            </h2>

            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950"
                >
                  <div className="flex gap-4">
                    <Link
                      href={`/urunler/${item.product_slug}`}
                      target="_blank"
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-amber-100 bg-white dark:border-emerald-800 dark:bg-slate-900"
                    >
                      <Image
                        src={item.image || "/images/placeholder-product.jpg"}
                        alt={item.product_name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1">
                      <p className="font-semibold text-emerald-950 dark:text-white">
                        {item.product_name}
                      </p>
                      <p className="mt-1 text-sm text-emerald-900/70 dark:text-slate-300">
                        {item.variant_label} × {item.quantity}
                      </p>
                      <p className="mt-1 text-sm text-emerald-900/70 dark:text-slate-300">
                        Birim:{" "}
                        {item.unit_price_text ?? formatPrice(item.unit_price)}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-emerald-950 dark:text-white">
                      {formatPrice(Number(item.line_total))}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Teslimat Bilgileri
            </h2>

            <div className="mt-4 space-y-2 text-sm text-emerald-900/75 dark:text-slate-300">
              <p>
                <strong>Ad Soyad:</strong> {order.customer_name}
              </p>
              <p>
                <strong>Telefon:</strong> {order.customer_phone}
              </p>
              <p>
                <strong>E-posta:</strong> {order.customer_email || "-"}
              </p>
              <p>
                <strong>Adres:</strong> {order.shipping_city} /{" "}
                {order.shipping_district} - {order.shipping_address}
              </p>
              <p>
                <strong>Not:</strong> {order.customer_note || "-"}
              </p>
            </div>
          </div>
        </section>

        <aside className="h-fit space-y-5 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Rezerv Durumu
            </h2>

            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/30 p-4 dark:border-emerald-800 dark:bg-slate-950">
              <div
                className={`rounded-2xl border px-4 py-4 ${reservationStatus.className}`}
              >
                <p className="text-sm font-semibold">
                  {reservationStatus.label}
                </p>

                <p className="mt-2 text-sm leading-6 opacity-90">
                  {reservationStatus.detail}
                </p>

                {order.reservation_expires_at ? (
                  <p className="mt-3 text-xs opacity-75">
                    Rezerv Bitişi:{" "}
                    {new Date(order.reservation_expires_at).toLocaleString(
                      "tr-TR",
                    )}
                  </p>
                ) : null}
              </div>
            </div>

            {reservationStatus.canRelease ? (
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  const confirmed = window.confirm(
                    "Bu siparişin stok rezervini serbest bırakmak ve siparişi iptal etmek istediğinize emin misiniz?",
                  );

                  if (!confirmed) return;

                  setSaving(true);
                  setMessage("");
                  setMessageType("success");

                  const response = await fetch(`/api/admin/orders/${order.id}`, {
                    method: "DELETE",
                  });

                  const result = await response.json().catch(() => null);

                  setSaving(false);

                  if (!response.ok) {
                    setMessageType("error");
                    setMessage(
                      result?.error
                        ? `Rezerv hatası: ${result.error}`
                        : "Rezerv serbest bırakılamadı.",
                    );

                    return;
                  }

                  setMessageType("success");
                  setMessage(
                    "Rezerv serbest bırakıldı ve sipariş iptal edildi.",
                  );

                  await loadOrder();
                }}
                className="mt-4 w-full rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-700 dark:hover:bg-rose-600"
              >
                {saving ? "İşleniyor..." : "Rezervi Serbest Bırak"}
              </button>
            ) : null}
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Kargo Bilgileri
            </h2>

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Kargo Firması
            </label>
            <input
              value={cargoCompany}
              onChange={(event) => setCargoCompany(event.target.value)}
              placeholder="Örn. Yurtiçi Kargo"
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            />

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Takip Kodu
            </label>
            <input
              value={cargoTrackingCode}
              onChange={(event) => setCargoTrackingCode(event.target.value)}
              placeholder="Kargo takip kodu"
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            />

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Takip Linki
            </label>
            <input
              value={cargoTrackingUrl}
              onChange={(event) => setCargoTrackingUrl(event.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            />

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Kargo Durumu
            </label>
            <select
              value={cargoStatus}
              onChange={(event) => setCargoStatus(event.target.value)}
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            >
              {cargoStatusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {order.cargo_created_at ? (
              <p className="mt-3 text-xs text-emerald-900/60 dark:text-slate-400">
                Kargo çıkış zamanı:{" "}
                {new Date(order.cargo_created_at).toLocaleString("tr-TR")}
              </p>
            ) : null}

            {order.cargo_delivered_at ? (
              <p className="mt-2 text-xs text-emerald-900/60 dark:text-slate-400">
                Teslim zamanı:{" "}
                {new Date(order.cargo_delivered_at).toLocaleString("tr-TR")}
              </p>
            ) : null}

            <button
              type="button"
              disabled={saving}
              onClick={() => saveOrderChanges("Kargo bilgileri güncellendi.")}
              className="mt-5 w-full rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              {saving ? "Kaydediliyor..." : "Kargo Bilgilerini Kaydet"}
            </button>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Sipariş Durumu
            </h2>

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Sipariş
            </label>
            <select
              value={orderStatus}
              onChange={(event) => setOrderStatus(event.target.value)}
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            >
              {orderStatusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Ödeme
            </label>
            <select
              value={paymentStatus}
              onChange={(event) => setPaymentStatus(event.target.value)}
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            >
              {paymentStatusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveOrderChanges("Sipariş durumu güncellendi.")}
              className="mt-5 w-full rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              {saving ? "Kaydediliyor..." : "Durumu Güncelle"}
            </button>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Tutar
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-emerald-900/70 dark:text-slate-300">
                  Ara Toplam
                </span>
                <strong className="text-emerald-950 dark:text-white">
                  {formatPrice(Number(order.subtotal))}
                </strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-emerald-900/70 dark:text-slate-300">
                  Kargo
                </span>
                <strong className="text-emerald-950 dark:text-white">
                  {Number(order.shipping_fee) === 0
                    ? "Ücretsiz"
                    : formatPrice(Number(order.shipping_fee))}
                </strong>
              </div>

              <div className="flex justify-between border-t border-amber-100 pt-3 text-base dark:border-emerald-900">
                <span className="font-semibold text-emerald-950 dark:text-white">
                  Toplam
                </span>
                <strong className="text-emerald-950 dark:text-white">
                  {formatPrice(Number(order.total))}
                </strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}