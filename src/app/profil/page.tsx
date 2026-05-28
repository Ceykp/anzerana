"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { formatPrice, useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { products } from "@/lib/products";

const ADDRESS_STORAGE_KEY = "anzerana-profile-address-v1";

const supportLinks = [
  { label: "Sık Sorulan Sorular", href: "/sss" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Ürünleri İncele", href: "/urunler" },
];

const cargoStatusLabels: Record<string, string> = {
  not_shipped: "Henüz Kargoya Verilmedi",
  preparing: "Kargo Hazırlanıyor",
  shipped: "Kargoya Verildi",
  in_transit: "Taşımada",
  delivered: "Teslim Edildi",
  returned: "İade Edildi",
};

type AccountOrder = {
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
  cargo_company: string | null;
  cargo_tracking_code: string | null;
  cargo_tracking_url: string | null;
  created_at: string;
  cargo_status: string | null;
  cargo_created_at: string | null;
  cargo_delivered_at: string | null;
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
  not_shipped: "Henüz Kargoya Verilmedi",
  preparing: "Kargo Hazırlanıyor",
  shipped: "Kargoya Verildi",
  in_transit: "Taşımada",
  delivered: "Teslim Edildi",
  returned: "İade İşlemi",
};

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const { user, updateUser, logout } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    grandTotal,
    hasFreeShipping,
    openCart,
  } = useCart();
  const { ids: wishlistIds, clearWishlist } = useWishlist();

  const activeUser = useMemo(() => {
    if (session?.user) {
      return {
        name: session.user.name ?? "Google Kullanıcısı",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
        provider: "google",
      };
    }

    return user
      ? {
          name: user.name,
          email: user.email,
          image: "",
          provider: user.provider,
        }
      : null;
  }, [session, user]);

  const favoriteProducts = useMemo(
    () =>
      products
        .filter((product) => wishlistIds.includes(product.id))
        .slice(0, 4),
    [wishlistIds],
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [accountOrders, setAccountOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersMessage, setOrdersMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (saved) {
      setSavedAddress(saved);
      setAddress(saved);
    }
  }, []);

  useEffect(() => {
    if (!activeUser) return;
    setName(activeUser.name);
    setEmail(activeUser.email);
  }, [activeUser]);

  useEffect(() => {
    async function loadAccountOrders() {
      const orderEmail = session?.user?.email ?? activeUser?.email ?? "";
    
      if (!orderEmail) {
        setOrdersMessage("Giriş gerekli.");
        return;
      }
    
      const response = await fetch(
        `/api/account/orders?email=${encodeURIComponent(orderEmail)}`,
      );
    
      const result = await response.json().catch(() => null);
    
      if (response.ok) {
        setAccountOrders(result?.orders ?? []);
        setOrdersMessage("");
      } else {
        setOrdersMessage(result?.error ?? "Siparişleriniz yüklenemedi.");
      }
      setOrdersLoading(false);
    }

    loadAccountOrders();
  }, [activeUser?.email]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-3xl border border-amber-100 bg-white p-6 dark:border-emerald-900 dark:bg-slate-900">
          <p className="text-emerald-900/75 dark:text-slate-300">
            Profil yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-semibold text-emerald-950 dark:text-white">
          Profil
        </h1>
        <p className="mt-3 text-emerald-900/75 dark:text-slate-300">
          Profil sayfasını görüntülemek için giriş yapmalısınız.
        </p>
        <Link
          href="/giris-yap"
          className="mt-5 inline-flex rounded-full bg-emerald-900 px-5 py-2 font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  function handleLogout() {
    if (session?.user) {
      signOut({ callbackUrl: "/giris-yap" });
      return;
    }

    logout();
  }

  function handleUpdateUser() {
    if (session?.user) {
      setSuccessMessage(
        "Google ile giriş yapılan hesaplarda ad ve e-posta bilgileri Google hesabından alınır.",
      );
      return;
    }

    updateUser({ name, email });
    setSuccessMessage("Profil bilgileriniz güncellendi.");
  }

  function handleSaveAddress() {
    const cleanAddress = address.trim();
    setSavedAddress(cleanAddress);
    localStorage.setItem(ADDRESS_STORAGE_KEY, cleanAddress);
    setSuccessMessage("Adres bilgileriniz kaydedildi.");
  }

  function handleDeleteAddress() {
    setAddress("");
    setSavedAddress("");
    localStorage.removeItem(ADDRESS_STORAGE_KEY);
    setSuccessMessage("Adres bilgileriniz silindi.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm dark:border-emerald-900 dark:bg-slate-900 dark:shadow-black/20">
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-700 p-6 text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/15 text-2xl font-semibold">
                {activeUser.image ? (
                  <img
                    src={activeUser.image}
                    alt={activeUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  activeUser.name.charAt(0).toUpperCase()
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                  Hesabım
                </p>
                <h1 className="mt-2 text-3xl font-semibold">
                  {activeUser.name}
                </h1>
                <p className="mt-1 text-sm text-white/80">
                  {activeUser.email}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Giriş yöntemi:{" "}
                  {activeUser.provider === "google" ? "Google" : "E-posta"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
            <p className="text-xs text-emerald-900/60 dark:text-slate-400">
              Sepetteki Ürün
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-white">
              {itemCount}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
            <p className="text-xs text-emerald-900/60 dark:text-slate-400">
              Sepet Tutarı
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-white">
              {formatPrice(subtotal)}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
            <p className="text-xs text-emerald-900/60 dark:text-slate-400">
              Favoriler
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-950 dark:text-white">
              {wishlistIds.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
            <p className="text-xs text-emerald-900/60 dark:text-slate-400">
              Kargo Durumu
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-950 dark:text-white">
              {hasFreeShipping ? "Ücretsiz Kargo" : "Standart Kargo"}
            </p>
          </div>
        </div>
      </div>

      {successMessage ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
          <p className="text-sm font-semibold text-emerald-950 dark:text-white">
            Profil Menüsü
          </p>
          <nav className="mt-4 space-y-2">
            {[
              ["Siparişlerim", "#siparisler"],
              ["Sepet Özeti", "#sepet"],
              ["Favorilerim", "#favoriler"],
              ["Kayıtlı Adreslerim", "#adresler"],
              ["Hesap Ayarlarım", "#ayarlar"],
              ["Yardım", "#yardim"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-emerald-900 transition hover:bg-amber-50 dark:text-slate-200 dark:hover:bg-slate-950"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-5">
          <section
            id="siparisler"
            className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
                  Siparişlerim
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
                  Hesabınıza bağlı siparişlerinizi, sipariş numaranızı, ödeme ve
                  kargo durumunu buradan takip edebilirsiniz.
                </p>
              </div>

              <Link
                href="/siparis-takip"
                className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
              >
                Sipariş Takip
              </Link>
            </div>

            {ordersLoading ? (
              <p className="mt-4 text-sm text-emerald-900/75 dark:text-slate-300">
                Siparişler yükleniyor...
              </p>
            ) : null}

            {ordersMessage ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
                {ordersMessage}
              </div>
            ) : null}

            {!ordersLoading && accountOrders.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
                <p className="text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
                  Henüz hesabınıza bağlı bir sipariş bulunmuyor.
                </p>

                <Link
                  href="/urunler"
                  className="mt-4 inline-flex rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
                >
                  Ürünleri İncele
                </Link>
              </div>
            ) : null}

            {accountOrders.length > 0 ? (
              <div className="mt-4 space-y-3">
                {accountOrders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                          Sipariş No
                        </p>

                        <p className="mt-1 text-lg font-semibold text-emerald-950 dark:text-white">
                          {order.order_code ?? `#${order.id.slice(0, 8)}`}
                        </p>

                        <p className="mt-1 text-xs text-emerald-900/60 dark:text-slate-400">
                          {new Date(order.created_at).toLocaleString("tr-TR")}
                        </p>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
                        <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                          <p className="text-xs text-emerald-900/60 dark:text-slate-400">
                            Sipariş
                          </p>
                          <p className="mt-1 text-sm font-semibold text-emerald-950 dark:text-white">
                            {orderStatusLabels[order.order_status] ??
                              order.order_status}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                          <p className="text-xs text-emerald-900/60 dark:text-slate-400">
                            Ödeme
                          </p>
                          <p className="mt-1 text-sm font-semibold text-emerald-950 dark:text-white">
                            {paymentStatusLabels[order.payment_status] ??
                              order.payment_status}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3 dark:bg-slate-900">
                          <p className="text-xs text-emerald-900/60 dark:text-slate-400">
                            Tutar
                          </p>
                          <p className="mt-1 text-sm font-semibold text-emerald-950 dark:text-white">
                            {formatPrice(Number(order.total))}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl bg-white p-3 text-sm dark:bg-slate-900">
                        <p className="font-semibold text-emerald-950 dark:text-white">
                          Teslimat
                        </p>
                        <p className="mt-1 text-emerald-900/70 dark:text-slate-300">
                          {order.shipping_city} / {order.shipping_district}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3 text-sm dark:bg-slate-900">
                        <p className="font-semibold text-emerald-950 dark:text-white">
                          Kargo
                        </p>
                        <p className="mt-1 text-emerald-900/70 dark:text-slate-300">
  {order.cargo_company || "Henüz kargoya verilmedi"}
</p>

<p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
  {cargoStatusLabels[order.cargo_status ?? "not_shipped"] ??
    "Henüz Kargoya Verilmedi"}
</p>

{order.cargo_tracking_code ? (
  <p className="mt-1 text-xs text-emerald-900/60 dark:text-slate-400">
    Takip Kodu: {order.cargo_tracking_code}
  </p>
) : null}
</div>
</div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href="/siparis-takip"
                        className="rounded-full border border-emerald-900 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
                      >
                        Detaylı Takip
                      </Link>

                      {order.cargo_tracking_url ? (
                        <a
                          href={order.cargo_tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
                        >
                          Kargo Takip
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>

          <section
            id="sepet"
            className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
                  Sepet Özeti
                </h2>
                <p className="mt-2 text-sm text-emerald-900/75 dark:text-slate-300">
                  Sepetinizde {itemCount} ürün var. Genel toplam:{" "}
                  {formatPrice(grandTotal)}
                </p>
              </div>
              <button
                type="button"
                onClick={openCart}
                className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
              >
                Sepeti Aç
              </button>
            </div>

            {items.length > 0 ? (
              <div className="mt-4 space-y-2">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/40 p-3 text-sm dark:border-emerald-800 dark:bg-slate-950"
                  >
                    <span className="text-emerald-950 dark:text-slate-200">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-semibold text-emerald-950 dark:text-white">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section
            id="favoriler"
            className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
                Favorilerim
              </h2>
              {wishlistIds.length > 0 ? (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-sm font-semibold text-rose-600 hover:underline"
                >
                  Temizle
                </button>
              ) : null}
            </div>

            {favoriteProducts.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {favoriteProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/urunler/${product.slug}`}
                    className="rounded-2xl border border-amber-100 p-4 transition hover:bg-amber-50 dark:border-emerald-800 dark:hover:bg-slate-950"
                  >
                    <p className="font-semibold text-emerald-950 dark:text-white">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm text-emerald-900/70 dark:text-slate-300">
                      {product.price ?? "Fiyat Yakında"}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
                Henüz favori ürününüz yok.
              </p>
            )}
          </section>

          <section
            id="adresler"
            className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Kayıtlı Adreslerim
            </h2>

            {savedAddress ? (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950">
                <p className="text-sm font-semibold text-emerald-950 dark:text-white">
                  Teslimat Adresi
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
                  {savedAddress}
                </p>
              </div>
            ) : null}

            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={4}
              placeholder="Teslimat adresinizi yazın"
              className="mt-4 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:ring-2 focus:ring-emerald-900/20 dark:border-emerald-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveAddress}
                className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
              >
                Adresi Kaydet
              </button>

              {savedAddress ? (
                <button
                  type="button"
                  onClick={handleDeleteAddress}
                  className="rounded-full border border-rose-200 px-5 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                >
                  Adresi Sil
                </button>
              ) : null}
            </div>
          </section>

          <section
            id="ayarlar"
            className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Hesap Ayarlarım
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-emerald-950 dark:text-white">
                  Ad Soyad
                </label>
                <input
                  value={name}
                  disabled={Boolean(session?.user)}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none disabled:opacity-70 dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-emerald-950 dark:text-white">
                  E-posta
                </label>
                <input
                  value={email}
                  disabled={Boolean(session?.user)}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none disabled:opacity-70 dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleUpdateUser}
              className="mt-4 rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
            >
              Bilgileri Güncelle
            </button>
          </section>

          <section
            id="yardim"
            className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900"
          >
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Yardım
            </h2>
            <p className="mt-2 text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
              Sipariş, kargo, ürün bilgisi veya üyelik işlemleri için destek
              kanallarımızı kullanabilirsiniz.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:text-white dark:hover:bg-slate-950"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}