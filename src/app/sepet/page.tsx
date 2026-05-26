"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { WhatsAppCTAButton } from "@/components/whatsapp-cta-button";
import { formatPrice, useCart } from "@/context/cart-context";

const SHIPPING_COST = 200;

export default function SepetPage() {
  const { data: session } = useSession();

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    freeShippingRemaining,
    freeShippingProgress,
    hasFreeShipping,
  } = useCart();

  const shippingCost = items.length > 0 && hasFreeShipping ? 0 : SHIPPING_COST;
  const grandTotal = items.length > 0 ? subtotal + shippingCost : 0;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingDistrict, setShippingDistrict] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddressLoaded, setSavedAddressLoaded] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);

  useEffect(() => {
    async function loadSavedAddress() {
      if (!session?.user?.email || savedAddressLoaded) return;

      const response = await fetch("/api/account/address");
      const result = await response.json().catch(() => null);

      setCustomerEmail(session.user.email ?? "");

      if (result?.address) {
        setCustomerName(result.address.customer_name ?? session.user.name ?? "");
        setCustomerPhone(result.address.customer_phone ?? "");
        setShippingCity(result.address.shipping_city ?? "");
        setShippingDistrict(result.address.shipping_district ?? "");
        setShippingAddress(result.address.shipping_address ?? "");
      } else {
        setCustomerName(session.user.name ?? "");
      }

      setSavedAddressLoaded(true);
    }

    loadSavedAddress();
  }, [session, savedAddressLoaded]);

  useEffect(() => {
    if (session?.user?.email) {
      setCustomerEmail(session.user.email);
    }
  }, [session?.user?.email]);

  const whatsappMessage =
  async function handleCardPayment() {
    setOrderMessage("");
  
    const safeCustomerEmail = session?.user?.email ?? customerEmail.trim();
  
    if (
      !customerName ||
      !safeCustomerEmail ||
      !customerPhone ||
      !shippingCity ||
      !shippingDistrict ||
      !shippingAddress
    ) {
      setOrderMessage(
        "Kartla ödeme için ad soyad, e-posta, telefon ve teslimat adresi zorunludur.",
      );
      return;
    }
  
    setIsStartingPayment(true);
  
    const response = await fetch("/api/payment/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          name: customerName,
          email: safeCustomerEmail,
          phone: customerPhone,
          city: shippingCity,
          district: shippingDistrict,
          address: shippingAddress,
          note: customerNote,
        },
        subtotal,
        shippingFee: shippingCost,
        total: grandTotal,
        items: items.map((item) => ({
          productId: item.productId,
          productSlug: item.productSlug,
          productName: item.productName,
          variantId: item.variantId,
          variantLabel: item.variantLabel,
          unitPrice: item.unitPrice,
          unitPriceText: item.unitPriceText,
          quantity: item.quantity,
          image: item.image,
        })),
      }),
    });
  
    const result = await response.json().catch(() => null);
  
    setIsStartingPayment(false);
  
    if (!response.ok) {
      setOrderMessage(result?.error ?? "Ödeme başlatılamadı.");
      return;
    }
  
    if (!result?.checkoutFormContent) {
      setOrderMessage("Ödeme formu alınamadı.");
      return;
    }
  
    const paymentWindow = window.open("", "_self");
  
    if (!paymentWindow) {
      setOrderMessage("Ödeme sayfası açılamadı.");
      return;
    }
  
    paymentWindow.document.open();
    paymentWindow.document.write(result.checkoutFormContent);
    paymentWindow.document.close();
  }

    items.length > 0
      ? `Merhaba, sepetteki ürünlerim için sipariş oluşturmak istiyorum:\n\n${items
          .map(
            (item) =>
              `- ${item.productName} / ${item.variantLabel} x ${item.quantity}`,
          )
          .join("\n")}\n\nAra Toplam: ${formatPrice(subtotal)}\nKargo: ${
          hasFreeShipping ? "Ücretsiz" : formatPrice(shippingCost)
        }\nGenel Toplam: ${formatPrice(grandTotal)}`
      : "Merhaba, ürünler hakkında bilgi almak istiyorum.";

  if (items.length === 0 && !orderMessage) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-sm dark:border-emerald-900 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
            Anzerana Sepet
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-emerald-950 dark:text-white">
            Sepetiniz Boş
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-900/75 dark:text-slate-300">
            Özel Seçkimizden Ürün Ekleyerek Sepetinizi Oluşturabilirsiniz.
            Anzer Balı, Yöresel Lezzetler Ve Kahvaltı Paketlerini İnceleyin.
          </p>

          <Link
            href="/urunler"
            className="mt-6 inline-flex rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 dark:bg-emerald-700"
          >
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && orderMessage) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">
            Sipariş Alındı
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-emerald-950 dark:text-white">
            Teşekkürler
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-emerald-900/80 dark:text-slate-200">
            {orderMessage}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/profil#siparisler"
              className="inline-flex rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 dark:bg-emerald-700"
            >
              Siparişlerime Git
            </Link>

            <Link
              href="/urunler"
              className="inline-flex rounded-full border border-emerald-900 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
            Sipariş Özeti
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-emerald-950 dark:text-white">
            Sepetim
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-emerald-900/75 dark:text-slate-300">
            Seçtiğiniz ürünleri kontrol edin, teslimat bilgilerinizi girin ve
            siparişinizi güvenli şekilde oluşturun.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="rounded-full border border-rose-200 px-5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
        >
          Sepeti Temizle
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4">
          {items.map((item) => {
            const key = `${item.productId}:${item.variantId}`;
            const lineTotal = item.unitPrice * item.quantity;
            const image = item.image || "/images/placeholder-product.jpg";

            return (
              <article
                key={key}
                className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <Link
                      href={`/urunler/${item.productSlug}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 dark:border-emerald-800 dark:bg-slate-950"
                    >
                      <Image
                        src={image}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div>
                      <Link
                        href={`/urunler/${item.productSlug}`}
                        className="text-lg font-semibold text-emerald-950 hover:underline dark:text-white"
                      >
                        {item.productName}
                      </Link>

                      <p className="mt-1 text-sm text-emerald-900/70 dark:text-slate-300">
                        Seçenek: {item.variantLabel}
                      </p>

                      <p className="mt-1 text-sm font-medium text-emerald-900 dark:text-amber-200">
                        Birim Fiyat: {item.unitPriceText}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm text-emerald-900/60 dark:text-slate-400">
                      Toplam
                    </p>
                    <p className="text-xl font-semibold text-emerald-950 dark:text-white">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-amber-200 bg-amber-50/50 dark:border-emerald-800 dark:bg-slate-950">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm text-emerald-900 dark:text-slate-200"
                      onClick={() => updateQuantity(key, item.quantity - 1)}
                      aria-label="Miktarı Azalt"
                    >
                      -
                    </button>

                    <span className="min-w-8 text-center text-sm font-semibold text-emerald-950 dark:text-white">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      className="px-4 py-2 text-sm text-emerald-900 dark:text-slate-200"
                      onClick={() => updateQuantity(key, item.quantity + 1)}
                      aria-label="Miktarı Artır"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(key)}
                    className="text-sm font-semibold text-rose-600 hover:underline dark:text-rose-300"
                  >
                    Kaldır
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="h-fit rounded-3xl border border-amber-100 bg-white p-5 shadow-sm lg:sticky lg:top-28 dark:border-emerald-900 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
            Sepet Özeti
          </p>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-emerald-800 dark:bg-slate-950">
            {hasFreeShipping ? (
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                Ücretsiz Kargo Hakkı Kazandınız.
              </p>
            ) : (
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                Ücretsiz Kargo İçin {formatPrice(freeShippingRemaining)} Daha
                Ekleyin.
              </p>
            )}

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-900 transition-all duration-500 dark:bg-emerald-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-emerald-900/65 dark:text-slate-400">
              <span>0 TL</span>
              <span>3.500 TL</span>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-amber-100 pt-5 dark:border-emerald-900">
            <div className="flex items-center justify-between">
              <p className="text-sm text-emerald-900/70 dark:text-slate-300">
                Ara Toplam
              </p>
              <p className="text-xl font-semibold text-emerald-950 dark:text-white">
                {formatPrice(subtotal)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-emerald-900/70 dark:text-slate-300">
                Kargo
              </p>
              <p className="text-sm font-semibold text-emerald-950 dark:text-white">
                {hasFreeShipping ? "Ücretsiz" : formatPrice(shippingCost)}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-amber-100 pt-4 dark:border-emerald-900">
              <p className="text-base font-semibold text-emerald-950 dark:text-white">
                Genel Toplam
              </p>
              <p className="text-2xl font-semibold text-emerald-950 dark:text-white">
                {formatPrice(grandTotal)}
              </p>
            </div>
          </div>

          <p className="mt-4 rounded-2xl bg-amber-50/60 p-3 text-xs leading-5 text-emerald-900/70 dark:bg-slate-950 dark:text-slate-300">
            Bu aşamada ödeme alınmaz. Siparişiniz tarafımıza iletilir; stok,
            teslimat ve ödeme bilgileri onay sürecinde netleştirilir.
          </p>

          <form
            className="mt-5 space-y-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950"
            onSubmit={async (event) => {
              event.preventDefault();

              setOrderMessage("");
              setIsSubmittingOrder(true);

              const safeCustomerEmail =
                session?.user?.email ?? customerEmail.trim();

              const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  customerName,
                  customerEmail: safeCustomerEmail,
                  customerPhone,
                  shippingCity,
                  shippingDistrict,
                  shippingAddress,
                  customerNote,
                  subtotal,
                  shippingFee: shippingCost,
                  total: grandTotal,
                  items: items.map((item) => ({
                    productId: item.productId,
                    productSlug: item.productSlug,
                    productName: item.productName,
                    variantId: item.variantId,
                    variantLabel: item.variantLabel,
                    unitPrice: item.unitPrice,
                    unitPriceText: item.unitPriceText,
                    quantity: item.quantity,
                    image: item.image,
                  })),
                }),
              });

              const result = await response.json().catch(() => null);

              setIsSubmittingOrder(false);

              if (!response.ok) {
                setOrderMessage(result?.error ?? "Sipariş oluşturulamadı.");
                return;
              }

              if (session?.user?.email && saveAddress) {
                await fetch("/api/account/address", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    customerName,
                    customerPhone,
                    shippingCity,
                    shippingDistrict,
                    shippingAddress,
                  }),
                });
              }

              clearCart();

              setOrderMessage(
                `Siparişiniz başarıyla oluşturuldu. Sipariş numaranız: ${
                  result.orderCode ?? result.orderId
                }`,
              );
            }}
          >
            <p className="text-sm font-semibold text-emerald-950 dark:text-white">
              Sipariş Bilgileri
            </p>

            {session?.user?.email ? (
              <p className="rounded-xl border border-emerald-100 bg-white p-3 text-xs leading-5 text-emerald-900/70 dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-300">
                {session.user.email} hesabıyla işlem yapıyorsunuz. Siparişiniz
                bu e-posta ile profilinizde görünecek.
              </p>
            ) : (
              <p className="rounded-xl border border-amber-100 bg-white p-3 text-xs leading-5 text-emerald-900/70 dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-300">
                Siparişinizi profilinizde görmek için giriş yapmanız önerilir.
              </p>
            )}

            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Ad Soyad *"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
            />

            <input
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="Telefon *"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
            />

            <input
              value={session?.user?.email ?? customerEmail}
              disabled={Boolean(session?.user?.email)}
              onChange={(event) => setCustomerEmail(event.target.value)}
              placeholder="E-posta"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={shippingCity}
                onChange={(event) => setShippingCity(event.target.value)}
                placeholder="İl *"
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
              />

              <input
                value={shippingDistrict}
                onChange={(event) => setShippingDistrict(event.target.value)}
                placeholder="İlçe *"
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <textarea
              value={shippingAddress}
              onChange={(event) => setShippingAddress(event.target.value)}
              rows={3}
              placeholder="Teslimat adresi *"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
            />

            <textarea
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
              rows={2}
              placeholder="Sipariş notu"
              className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
            />

            {session?.user?.email ? (
              <label className="flex items-start gap-2 rounded-xl border border-amber-100 bg-white p-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(event) => setSaveAddress(event.target.checked)}
                  className="mt-1"
                />
                <span>
                  Bir sonraki sipariş için ad, telefon ve adres bilgilerimi
                  kaydet.
                </span>
              </label>
            ) : null}

<button
  type="button"
  disabled={isStartingPayment || isSubmittingOrder}
  onClick={handleCardPayment}
  className="w-full rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
>
  {isStartingPayment ? "Ödeme Başlatılıyor..." : "Kartla Güvenli Öde"}
</button>
            
            
            <button
              type="submit"
              disabled={isSubmittingOrder}
              className="w-full rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-700"
            >
              {isSubmittingOrder
                ? "Sipariş Oluşturuluyor..."
                : "Sipariş Oluştur"}
            </button>

            {orderMessage ? (
              <p className="rounded-xl bg-white p-3 text-sm font-semibold text-emerald-900 dark:bg-slate-900 dark:text-slate-200">
                {orderMessage}
              </p>
            ) : null}
          </form>

          <div className="mt-5 space-y-3">
            <WhatsAppCTAButton message={whatsappMessage}>
              WhatsApp İle Sipariş Ver
            </WhatsAppCTAButton>

            <Link
              href="/urunler"
              className="block rounded-full border border-emerald-900 px-4 py-2.5 text-center text-sm font-semibold text-emerald-900 hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
            >
              Alışverişe Devam
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}