"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useTheme } from "@/context/theme-context";
import { navLinks } from "@/lib/site-content";
import { WhatsAppCTAButton } from "@/components/whatsapp-cta-button";
import { products } from "@/lib/products";
import { signOut, useSession } from "next-auth/react";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";

  const activeUser = session?.user
    ? {
        name: session.user.name ?? "Google Kullanıcısı",
        email: session.user.email ?? "",
        provider: "google",
        role: session.user.role,
      }
    : user;
  const { itemCount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const closeAllMenus = () => {
    setSearchOpen(false);
    setAccountOpen(false);
  };

  const searchResults = useMemo(() => {
    const cleanQuery = query.trim().toLocaleLowerCase("tr");

    if (!cleanQuery) return [];

    return products
      .filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.shortDescription,
          product.longDescription,
          product.badge ?? "",
          ...(product.packageContents ?? []),
          ...product.variants.map((variant) => variant.label),
        ]
          .join(" ")
          .toLocaleLowerCase("tr");

        return searchableText.includes(cleanQuery);
      })
      .slice(0, 8);
  }, [query]);

  const popularProducts = useMemo(() => {
    return products
      .filter((product) =>
        [
          "anzer-bali-980gr",
          "premium-kahvalti-paketi",
          "kolot-peyniri-1000gr",
          "elek-alti-cay",
        ].includes(product.id),
      )
      .slice(0, 4);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideSearch =
        searchRef.current && searchRef.current.contains(target);
      const clickedInsideAccount =
        accountRef.current && accountRef.current.contains(target);
      const clickedInsideMobileMenu =
        mobileMenuRef.current && mobileMenuRef.current.contains(target);

      if (!clickedInsideSearch) setSearchOpen(false);
      if (!clickedInsideAccount) setAccountOpen(false);
      if (!clickedInsideMobileMenu) setMobileOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllMenus();
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    closeAllMenus();
    setMobileOpen(false);
    setQuery("");
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100/70 bg-amber-50/95 backdrop-blur transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-amber-100 transition hover:scale-105 dark:bg-slate-900 dark:ring-emerald-800"
          aria-label="Anzerana Ana Sayfa"
        >
          <Image
            src="/images/logo-icon.png"
            alt="Anzerana"
            width={140}
            height={140}
            priority
            className="h-24 w-24 max-w-none object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">
  <nav aria-label="Ana Menü" className="hidden lg:block">
    <ul className="flex items-center gap-2 text-sm">
      {navLinks.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`rounded-full px-3 py-1.5 transition ${
              pathname === item.href
                ? "bg-amber-100 text-emerald-950 dark:bg-emerald-900 dark:text-white"
                : "text-emerald-900 hover:bg-amber-100 dark:text-slate-100 dark:hover:bg-emerald-900/70"
            }`}
          >
            {item.label}
          </Link>
        </li>
      ))}

      {isAdmin ? (
        <li>
          <Link
            href="/admin"
            className={`rounded-full px-3 py-1.5 font-semibold transition ${
              pathname === "/admin"
                ? "bg-emerald-900 text-white"
                : "bg-emerald-900 text-white hover:bg-emerald-800 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
            }`}
          >
            Admin
          </Link>
        </li>
      ) : null}
    </ul>
  </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-white dark:hover:bg-emerald-900"
            aria-label={theme === "dark" ? "Açık Temaya Geç" : "Karanlık Temaya Geç"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <div ref={searchRef} className="relative">
            <button
              type="button"
              className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-white dark:hover:bg-emerald-900"
              onClick={() => {
                setSearchOpen((prev) => {
                  const next = !prev;
                  if (next) {
                    setAccountOpen(false);
                    setMobileOpen(false);
                  }
                  return next;
                });
              }}
            >
              Ara
            </button>

            {searchOpen ? (
              <div className="absolute right-0 mt-2 w-[min(90vw,420px)] rounded-2xl border border-amber-100 bg-white p-4 shadow-xl dark:border-emerald-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2 dark:border-emerald-800 dark:bg-slate-900">
                  <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full bg-transparent text-sm text-emerald-950 outline-none placeholder:text-emerald-900/45 dark:text-white dark:placeholder:text-slate-400"
                    placeholder="Ne Aramak İstiyorsunuz?"
                  />

                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="rounded-full px-2 text-sm text-emerald-900/60 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800"
                      aria-label="Aramayı Temizle"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
                  {!query.trim() ? (
                    <>
                      <p className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                        Popüler Aramalar
                      </p>

                      {popularProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/urunler/${product.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                          className="block rounded-xl border border-amber-100 p-3 text-sm transition hover:bg-amber-50 dark:border-emerald-800 dark:hover:bg-slate-900"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-emerald-950 dark:text-white">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs text-emerald-900/70 dark:text-slate-300">
                                {product.category}
                              </p>
                            </div>
                            <p className="shrink-0 text-xs font-semibold text-emerald-900 dark:text-amber-200">
                              {product.price ?? "Fiyat Yakında"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </>
                  ) : null}

                  {query.trim() && searchResults.length === 0 ? (
                    <div className="rounded-xl bg-amber-50 p-4 text-sm text-emerald-900/75 dark:bg-slate-900 dark:text-slate-300">
                      <p className="font-semibold text-emerald-950 dark:text-white">
                        Sonuç Bulunamadı.
                      </p>
                      <p className="mt-1 text-xs leading-5">
                        Farklı Bir Ürün, Kategori Veya Gramaj Aramayı Deneyin.
                      </p>
                    </div>
                  ) : null}

                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/urunler/${result.slug}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="block rounded-xl border border-amber-100 p-3 text-sm transition hover:bg-amber-50 dark:border-emerald-800 dark:hover:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-emerald-950 dark:text-white">
                            {result.name}
                          </p>
                          <p className="mt-1 text-xs text-emerald-900/70 dark:text-slate-300">
                            {result.category}
                          </p>
                          <p className="mt-1 line-clamp-1 text-xs text-emerald-900/55 dark:text-slate-400">
                            {result.shortDescription}
                          </p>
                        </div>

                        <p className="shrink-0 text-xs font-semibold text-emerald-900 dark:text-amber-200">
                          {result.price ?? "Fiyat Yakında"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/urunler"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="mt-3 block rounded-full border border-emerald-900 px-4 py-2 text-center text-sm font-semibold text-emerald-900 hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
                >
                  Tüm Ürünleri Gör
                </Link>
              </div>
            ) : null}
          </div>

          <div ref={accountRef} className="relative">
            <button
              type="button"
              className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-white dark:hover:bg-emerald-900"
              onClick={() => {
                setAccountOpen((prev) => {
                  const next = !prev;
                  if (next) {
                    setSearchOpen(false);
                    setMobileOpen(false);
                  }
                  return next;
                });
              }}
            >
              Hesap
            </button>

            {accountOpen ? (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-amber-100 bg-white p-3 shadow-lg dark:border-emerald-800 dark:bg-slate-950">
                {activeUser ? (
                  <>
                    <p className="px-2 pb-2 text-sm text-emerald-900/70 dark:text-slate-300">
                    {activeUser.name}
                    </p>

                    {[
  ["Profilim", "/profil"],
  ...(isAdmin ? [["Admin Paneli", "/admin"]] : []),
  ["Siparişlerim", "/profil#siparisler"],
  ["Kayıtlı Adreslerim", "/profil#adresler"],
  ["Ürün Yorumlarım", "/profil#yorumlar"],
  ["Hesap Ayarlarım", "/profil#ayarlar"],
  ["Yardım", "/profil#yardim"],
].map(([label, href]) => (
                      <Link
                        key={label}
                        href={href}
                        className="block rounded-lg px-2 py-2 text-sm text-emerald-900 hover:bg-amber-50 dark:text-slate-100 dark:hover:bg-slate-900"
                        onClick={() => setAccountOpen(false)}
                      >
                        {label}
                      </Link>
                    ))}

<button
  type="button"
  onClick={() => {
    if (session?.user) {
      signOut({ callbackUrl: "/giris-yap" });
      return;
    }

    logout();
    setAccountOpen(false);
  }}
  className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
>
  Çıkış Yap
</button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/giris-yap"
                      className="block rounded-lg px-2 py-2 text-sm text-emerald-900 hover:bg-amber-50 dark:text-slate-100 dark:hover:bg-slate-900"
                      onClick={() => setAccountOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/kayit-ol"
                      className="block rounded-lg px-2 py-2 text-sm text-emerald-900 hover:bg-amber-50 dark:text-slate-100 dark:hover:bg-slate-900"
                      onClick={() => setAccountOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </>
                )}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              closeAllMenus();
              openCart();
            }}
            className="relative rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-white dark:hover:bg-emerald-900"
          >
            Sepet
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-emerald-900 px-1 text-center text-[10px] text-white dark:bg-amber-500 dark:text-slate-950">
                {itemCount}
              </span>
            ) : null}
          </button>

          <div className="hidden xl:block">
            <WhatsAppCTAButton
              message="Merhaba, ürünler ve gramaj seçenekleri hakkında bilgi almak istiyorum."
              className="inline-flex rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              WhatsApp Destek
            </WhatsAppCTAButton>
          </div>

          <div ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => {
                setMobileOpen((prev) => {
                  const next = !prev;
                  if (next) closeAllMenus();
                  return next;
                });
              }}
              className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm text-emerald-900 transition lg:hidden dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
            >
              Menü
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-amber-100 bg-white px-4 py-3 lg:hidden dark:border-emerald-900 dark:bg-slate-950">
          <nav aria-label="Mobil Menü">
            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      pathname === item.href
                        ? "bg-amber-100 text-emerald-950 dark:bg-emerald-900 dark:text-white"
                        : "text-emerald-900 hover:bg-amber-50 dark:text-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}