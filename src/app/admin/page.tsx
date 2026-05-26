"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const cards = [
  {
    title: "Ürün Yönetimi",
    desc: "Ürün ekle, düzenle, fiyat ve stok yönet.",
    href: "/admin/urunler",
  },
  {
    title: "Slider Yönetimi",
    desc: "Ana sayfa slider görsellerini değiştir.",
    href: "/admin/slider",
  },
  {
    title: "Siparişler",
    desc: "Sipariş durumlarını takip et.",
    href: "/admin/siparisler",
  },
  {
    title: "Kullanıcılar",
    desc: "Üye hesaplarını görüntüle.",
    href: "/admin/kullanicilar",
  },
  {
    title: "Yorumlar",
    desc: "Ürün yorumlarını yönet.",
    href: "/admin/yorumlar",
  },
  {
    title: "Site Ayarları",
    desc: "Kargo, banner ve sistem ayarları.",
    href: "/admin/ayarlar",
  },
];

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-emerald-900 dark:text-slate-200">
          Admin paneli yükleniyor...
        </p>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="text-3xl font-semibold text-emerald-950 dark:text-white">
          Yetkisiz Erişim
        </h1>

        <p className="mt-3 text-emerald-900/75 dark:text-slate-300">
          Bu sayfaya erişim izniniz yok.
        </p>

        <Link
          href="/"
          className="mt-5 inline-flex rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900 dark:shadow-black/20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
          Anzerana Yönetim
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-emerald-950 dark:text-white">
          Admin Paneli
        </h1>

        <p className="mt-2 text-sm text-emerald-900/75 dark:text-slate-300">
          Hoş geldin {session.user.name}. Ürünleri, siparişleri ve site
          içeriklerini buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-emerald-900 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-amber-400"
          >
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              {card.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
              {card.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}