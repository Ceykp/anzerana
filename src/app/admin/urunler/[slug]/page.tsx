"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  categories,
  getProductBySlug,
  type ProductBadge,
  type ProductVariant,
} from "@/lib/products";

const badgeOptions: Array<ProductBadge | ""> = [
  "",
  "premium",
  "doğal",
  "yöresel",
  "çok-satan",
  "özel-seçki",
];

type AdminProductEditPageProps = {
  params: Promise<{ slug: string }>;
};

export default function AdminProductEditPage({
  params,
}: AdminProductEditPageProps) {
  const { data: session, status } = useSession();
  const { slug } = use(params);

  const product = useMemo(() => getProductBySlug(slug), [slug]);

  const productWithStock = product as
    | (typeof product & {
        stockQuantity?: number;
        trackStock?: boolean;
        allowBackorder?: boolean;
        lowStockThreshold?: number;
      })
    | undefined;

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice ?? "",
  );
  const [badge, setBadge] = useState<ProductBadge | "">(product?.badge ?? "");
  const [featured, setFeatured] = useState(Boolean(product?.featured));
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? "",
  );
  const [longDescription, setLongDescription] = useState(
    product?.longDescription ?? "",
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants ?? [],
  );

  const [stockQuantity, setStockQuantity] = useState(
    productWithStock?.stockQuantity ?? 0,
  );
  const [trackStock, setTrackStock] = useState(
    Boolean(productWithStock?.trackStock),
  );
  const [allowBackorder, setAllowBackorder] = useState(
    Boolean(productWithStock?.allowBackorder),
  );
  const [lowStockThreshold, setLowStockThreshold] = useState(
    productWithStock?.lowStockThreshold ?? 3,
  );

  const [successMessage, setSuccessMessage] = useState("");

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: string,
  ) {
    setVariants((prev) =>
      prev.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    );
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      {
        id: `varyant-${prev.length + 1}`,
        label: "",
        price: "",
        href: `/urunler/${slug}`,
      },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((prev) =>
      prev.filter((_, variantIndex) => variantIndex !== index),
    );
  }

  async function uploadImage(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json().catch(() => null);

    setUploading(false);

    if (!response.ok) {
      alert(result?.error ?? "Görsel yüklenemedi.");
      return;
    }

    setImages((prev) => [...prev, result.url]);
  }

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

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-3xl font-semibold text-emerald-950 dark:text-white">
          Ürün Bulunamadı
        </h1>
        <p className="mt-3 text-emerald-900/75 dark:text-slate-300">
          Bu slug ile eşleşen ürün bulunamadı.
        </p>
        <Link
          href="/admin/urunler"
          className="mt-5 inline-flex rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white"
        >
          Ürün Listesine Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
              Admin / Ürün Düzenle
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-white">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-emerald-900/75 dark:text-slate-300">
              /urunler/{product.slug}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/urunler/${product.slug}`}
              target="_blank"
              className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
            >
              Ürünü Gör
            </Link>

            <Link
              href="/admin/urunler"
              className="rounded-full border border-amber-200 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:text-white dark:hover:bg-slate-950"
            >
              Listeye Dön
            </Link>
          </div>
        </div>
      </div>

      {successMessage ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          {successMessage}
        </div>
      ) : null}

      <form
        className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]"
        onSubmit={async (event) => {
          event.preventDefault();

          const cleanVariants = variants
            .filter((variant) => variant.id.trim() && variant.label.trim())
            .map((variant) => ({
              id: variant.id.trim(),
              label: variant.label.trim(),
              price: variant.price?.trim() || null,
              href: variant.href?.trim() || `/urunler/${product.slug}`,
            }));

          const response = await fetch(`/api/admin/products/${product.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              category,
              price,
              compare_at_price: compareAtPrice || null,
              badge: badge || null,
              featured,
              short_description: shortDescription,
              long_description: longDescription,
              images: images.filter(Boolean),
              variants: cleanVariants,
              stock_quantity: Number(stockQuantity || 0),
              track_stock: trackStock,
              allow_backorder: allowBackorder,
              low_stock_threshold: Number(lowStockThreshold || 0),
            }),
          });

          if (!response.ok) {
            const result = await response.json().catch(() => null);

            setSuccessMessage(
              result?.error
                ? `Kayıt hatası: ${result.error}`
                : "Kayıt sırasında bir hata oluştu.",
            );

            return;
          }

          setSuccessMessage("Ürün başarıyla Supabase veritabanına kaydedildi.");
        }}
      >
        <section className="space-y-5">
          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Temel Bilgiler
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-emerald-950 dark:text-white">
                  Ürün Adı
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-emerald-950 dark:text-white">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-emerald-950 dark:text-white">
                  Satış Fiyatı
                </label>
                <input
                  value={price ?? ""}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="₺1.000"
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-emerald-950 dark:text-white">
                  Karşılaştırma Fiyatı
                </label>
                <input
                  value={compareAtPrice ?? ""}
                  onChange={(event) => setCompareAtPrice(event.target.value)}
                  placeholder="₺1.250"
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Stok Yönetimi
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-emerald-950 dark:text-white">
                  Stok Adedi
                </label>
                <input
                  type="number"
                  min={0}
                  value={stockQuantity}
                  onChange={(event) =>
                    setStockQuantity(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-emerald-950 dark:text-white">
                  Düşük Stok Eşiği
                </label>
                <input
                  type="number"
                  min={0}
                  value={lowStockThreshold}
                  onChange={(event) =>
                    setLowStockThreshold(Number(event.target.value))
                  }
                  className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-slate-950 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={trackStock}
                  onChange={(event) => setTrackStock(event.target.checked)}
                  className="mt-1"
                />
                <span>
                  Bu üründe stok takibi yapılsın. Stok bitince müşteri tarafında
                  satış kontrol edilir.
                </span>
              </label>

              <label className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-slate-950 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={allowBackorder}
                  onChange={(event) => setAllowBackorder(event.target.checked)}
                  className="mt-1"
                />
                <span>
                  Stok bitse bile sipariş alınmasına izin ver. Bu seçenek
                  kapalıysa stok 0 olduğunda sipariş kabul edilmez.
                </span>
              </label>

              {trackStock && stockQuantity <= lowStockThreshold ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200">
                  Kritik stok uyarısı: Bu ürün belirlediğiniz eşiğin altında.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Açıklamalar
            </h2>

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Kısa Açıklama
            </label>
            <textarea
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            />

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Uzun Açıklama
            </label>
            <textarea
              value={longDescription}
              onChange={(event) => setLongDescription(event.target.value)}
              rows={6}
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
                Varyantlar
              </h2>

              <button
                type="button"
                onClick={addVariant}
                className="rounded-full border border-emerald-900 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
              >
                Varyant Ekle
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {variants.map((variant, index) => (
                <div
                  key={`${variant.id}-${index}`}
                  className="grid gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-3 dark:border-emerald-800 dark:bg-slate-950 sm:grid-cols-[1fr_1fr_1.4fr_auto]"
                >
                  <input
                    value={variant.label}
                    onChange={(event) =>
                      updateVariant(index, "label", event.target.value)
                    }
                    placeholder="Gramaj / Seçenek"
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
                  />

                  <input
                    value={variant.price ?? ""}
                    onChange={(event) =>
                      updateVariant(index, "price", event.target.value)
                    }
                    placeholder="₺1.000"
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
                  />

                  <input
                    value={variant.href ?? ""}
                    onChange={(event) =>
                      updateVariant(index, "href", event.target.value)
                    }
                    placeholder={`/urunler/${product.slug}`}
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit space-y-5 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Yayın Ayarları
            </h2>

            <label className="mt-4 block text-sm font-semibold text-emerald-950 dark:text-white">
              Rozet
            </label>
            <select
              value={badge}
              onChange={(event) =>
                setBadge(event.target.value as ProductBadge | "")
              }
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
            >
              {badgeOptions.map((item) => (
                <option key={item} value={item}>
                  {item || "Rozet Yok"}
                </option>
              ))}
            </select>

            <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-950 dark:text-white">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
              />
              Öne çıkan ürün
            </label>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Ürün Görselleri
            </h2>

            <div className="mt-4 space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  await uploadImage(file);
                  event.target.value = "";
                }}
                className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
              />

              {uploading ? (
                <p className="text-sm text-emerald-900/70 dark:text-slate-300">
                  Görsel yükleniyor...
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => setImages((prev) => [...prev, ""])}
                className="rounded-full border border-emerald-900 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
              >
                Manuel Görsel URL Ekle
              </button>

              <div className="space-y-4">
                {images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3 dark:border-emerald-800 dark:bg-slate-950"
                  >
                    <input
                      value={image}
                      onChange={(event) => {
                        const next = [...images];
                        next[index] = event.target.value;
                        setImages(next);
                      }}
                      placeholder="Görsel URL"
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-slate-900 dark:text-white"
                    />

                    {image ? (
                      <img
                        src={image}
                        alt={`Ürün görseli ${index + 1}`}
                        className="mt-3 h-36 w-36 rounded-2xl border border-amber-200 object-cover dark:border-emerald-800"
                      />
                    ) : null}

                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) =>
                          prev.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      className="mt-3 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                    >
                      Görseli Sil
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3 text-xs text-emerald-900/70 dark:border-emerald-800 dark:bg-slate-950 dark:text-slate-300">
                Görsel yüklediğinizde URL otomatik eklenir. Kaydet butonuna
                bastığınızda ürün görselleri Supabase veritabanına işlenir.
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
          >
            Değişiklikleri Kaydet
          </button>
        </aside>
      </form>
    </div>
  );
}