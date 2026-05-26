"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { categories, type Product } from "@/lib/products";
import { getProductsFromSupabase } from "@/lib/supabase-products";

function getStockStatus(product: Product) {
  const stockQuantity = product.stockQuantity ?? 0;
  const lowStockThreshold = product.lowStockThreshold ?? 3;
  const trackStock = Boolean(product.trackStock);
  const allowBackorder = Boolean(product.allowBackorder);

  if (!trackStock) {
    return {
      label: "Takip Kapalı",
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
      detail: "-",
    };
  }

  if (stockQuantity <= 0 && !allowBackorder) {
    return {
      label: "Tükendi",
      className:
        "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
      detail: `${stockQuantity} adet`,
    };
  }

  if (stockQuantity <= lowStockThreshold) {
    return {
      label: "Kritik Stok",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
      detail: `${stockQuantity} adet`,
    };
  }

  return {
    label: "Stokta",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    detail: `${stockQuantity} adet`,
  };
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tümü");

  useEffect(() => {
    async function loadProducts() {
      const data = await getProductsFromSupabase();
      setProducts(data);
      setIsLoadingProducts(false);
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = `${product.name} ${product.category} ${product.slug}`
        .toLocaleLowerCase("tr")
        .includes(query.toLocaleLowerCase("tr"));

      const matchesCategory =
        category === "Tümü" || product.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  if (status === "loading") {
    return <div className="mx-auto max-w-6xl px-4 py-14">Yükleniyor...</div>;
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
      <div className="flex flex-col gap-4 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
              Admin / Ürünler
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-white">
              Ürün Yönetimi
            </h1>
            <p className="mt-2 text-sm text-emerald-900/75 dark:text-slate-300">
              Toplam {products.length} ürün Supabase veritabanından listeleniyor.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/urunler/yeni"
              className="rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
            >
              Yeni Ürün Ekle
            </Link>

            <Link
              href="/admin"
              className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
            >
              Admin Panele Dön
            </Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_260px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ürün adı, kategori veya slug ara"
            className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
          >
            <option>Tümü</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <div className="grid grid-cols-[1.35fr_1fr_110px_130px_130px_120px] gap-3 border-b border-amber-100 bg-amber-50/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900 dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-300">
          <span>Ürün</span>
          <span>Kategori</span>
          <span>Fiyat</span>
          <span>Stok</span>
          <span>Durum</span>
          <span>İşlem</span>
        </div>

        {isLoadingProducts ? (
          <div className="p-6 text-sm text-emerald-900/75 dark:text-slate-300">
            Ürünler yükleniyor...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-sm text-emerald-900/75 dark:text-slate-300">
            Ürün bulunamadı.
          </div>
        ) : (
          <div className="divide-y divide-amber-100 dark:divide-emerald-900">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product);

              return (
                <article
                  key={product.id}
                  className="grid grid-cols-[1.35fr_1fr_110px_130px_130px_120px] items-center gap-3 px-5 py-4 text-sm"
                >
                  <div>
                    <p className="font-semibold text-emerald-950 dark:text-white">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-emerald-900/60 dark:text-slate-400">
                      /urunler/{product.slug}
                    </p>
                  </div>

                  <p className="text-emerald-900/75 dark:text-slate-300">
                    {product.category}
                  </p>

                  <p className="font-semibold text-emerald-950 dark:text-white">
                    {product.price ?? "Fiyat Yok"}
                  </p>

                  <div className="flex flex-col gap-1">
                    <span
                      className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${stockStatus.className}`}
                    >
                      {stockStatus.label}
                    </span>

                    <span className="text-xs text-emerald-900/60 dark:text-slate-400">
                      {stockStatus.detail}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {product.featured ? (
                      <span className="w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                        Öne Çıkan
                      </span>
                    ) : (
                      <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Standart
                      </span>
                    )}

                    {product.badge ? (
                      <span className="w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-400 dark:text-slate-950">
                        {product.badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/admin/urunler/${product.slug}`}
                      className="rounded-full bg-emerald-900 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
                    >
                      Düzenle
                    </Link>

                    <Link
                      href={`/urunler/${product.slug}`}
                      target="_blank"
                      className="rounded-full border border-amber-200 px-3 py-2 text-center text-xs font-semibold text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:text-white dark:hover:bg-slate-950"
                    >
                      Gör
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          `${product.name} ürününü silmek istediğinize emin misiniz?`,
                        );

                        if (!confirmed) return;

                        const response = await fetch(
                          `/api/admin/products/${product.id}`,
                          {
                            method: "DELETE",
                          },
                        );

                        if (!response.ok) {
                          alert("Ürün silinirken hata oluştu.");
                          return;
                        }

                        setProducts((prev) =>
                          prev.filter((item) => item.id !== product.id),
                        );
                      }}
                      className="rounded-full border border-rose-200 px-3 py-2 text-center text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                    >
                      Sil
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}