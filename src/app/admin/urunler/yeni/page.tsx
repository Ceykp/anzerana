"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ProductBadge } from "@/lib/products";

const badgeOptions: Array<ProductBadge | ""> = [
  "",
  "premium",
  "doğal",
  "yöresel",
  "çok-satan",
  "özel-seçki",
];

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [badge, setBadge] = useState<ProductBadge | "">("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);

    const response = await fetch(
      "/api/admin/products",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id: slug,
          slug,
          name,
          category,
          short_description:
            shortDescription,
          long_description:
            longDescription,
          images: imagePath
            ? [imagePath]
            : [],
          badge:
            badge || null,
          featured,
          price:
            price || null,
          variants: [],
          review_count: 0,
          rating_summary: 0,
          package_contents: [],
          recommended_product_ids:
            [],
        }),
      },
    );

    setLoading(false);

    if (!response.ok) {
      alert(
        "Ürün eklenemedi",
      );
      return;
    }

    alert(
      "Ürün başarıyla oluşturuldu",
    );

    router.push(
      "/admin/urunler",
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 text-emerald-950 dark:text-white">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-amber-700">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-emerald-950">
            Yeni Ürün Ekle
          </h1>
        </div>

        <Link
          href="/admin/urunler"
          className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900"
        >
          Listeye Dön
        </Link>

      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-8 space-y-6"
      >

<div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">

          <h2 className="text-xl font-semibold">
            Temel Bilgiler
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <input
              placeholder="Ürün adı"
              value={name}
              onChange={(e)=>
                setName(
                  e.target.value,
                )
              }
              className="
rounded-xl
border
border-amber-200
bg-white
px-3
py-3
text-emerald-950
outline-none
dark:border-emerald-800
dark:bg-slate-950
dark:text-white
"
            />

            <input
              placeholder="Slug (anzer-bali-980gr)"
              value={slug}
              onChange={(e)=>
                setSlug(
                  e.target.value,
                )
              }
              className="
rounded-xl
border
border-amber-200
bg-white
px-3
py-3
text-emerald-950
outline-none
dark:border-emerald-800
dark:bg-slate-950
dark:text-white
"
            />

            <input
              placeholder="Kategori"
              value={
                category
              }
              onChange={(e)=>
                setCategory(
                  e.target.value,
                )
              }
              className="
rounded-xl
border
border-amber-200
bg-white
px-3
py-3
text-emerald-950
outline-none
dark:border-emerald-800
dark:bg-slate-950
dark:text-white
"
            />

            <input
              placeholder="Fiyat"
              value={price}
              onChange={(e)=>
                setPrice(
                  e.target.value,
                )
              }
              className="
rounded-xl
border
border-amber-200
bg-white
px-3
py-3
text-emerald-950
outline-none
dark:border-emerald-800
dark:bg-slate-950
dark:text-white
"
            />

          </div>

        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">

          <h2 className="text-xl font-semibold">
            Açıklamalar
          </h2>

          <textarea
            rows={3}
            placeholder="Kısa açıklama"
            value={
              shortDescription
            }
            onChange={(e)=>
              setShortDescription(
                e.target.value,
              )
            }
            className="mt-4 w-full rounded-xl border px-3 py-3"
          />

          <textarea
            rows={6}
            placeholder="Uzun açıklama"
            value={
              longDescription
            }
            onChange={(e)=>
              setLongDescription(
                e.target.value,
              )
            }
            className="mt-4 w-full rounded-xl border px-3 py-3"
          />

        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">

          <h2 className="text-xl font-semibold">
            Görsel ve Ayarlar
          </h2>

          <div className="mt-4 space-y-3">
 <input
    type="file"
    accept="image/*"
    onChange={async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

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

      setImagePath(result.url);
    }}
    className="w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
  />

  <input
    placeholder="Görsel URL"
    value={imagePath}
    onChange={(event) => setImagePath(event.target.value)}
    className="w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-sm dark:border-emerald-800 dark:bg-slate-950 dark:text-white"
  />

  {uploading ? (
    <p className="text-sm text-emerald-900/70 dark:text-slate-300">
      Görsel yükleniyor...
    </p>
  ) : null}

  {imagePath ? (
    <img
      src={imagePath}
      alt="Ürün önizleme"
      className="
h-40
w-40
rounded-2xl
border
border-amber-200
object-cover
dark:border-emerald-800
"
    />
  ) : null}
</div>

          <select
            value={badge}
            onChange={(e)=>
              setBadge(
                e.target.value as ProductBadge,
              )
            }
            className="mt-4 w-full rounded-xl border px-3 py-3"
          >

            {badgeOptions.map(
              (
                item,
              ) => (
                <option
                  key={item}
                  value={
                    item
                  }
                >
                  {item ||
                    "Rozet Yok"}
                </option>
              ),
            )}

          </select>

          <label className="mt-4 flex gap-2">

            <input
              type="checkbox"
              checked={
                featured
              }
              onChange={(e)=>
                setFeatured(
                  e.target.checked,
                )
              }
            />

            Öne çıkan ürün

          </label>

        </div>

        <button
          type="submit"
          disabled={
            loading
          }
          className="rounded-full bg-emerald-900 px-6 py-3 font-semibold text-white"
        >
          {loading
            ? "Kaydediliyor..."
            : "Ürünü Oluştur"}
        </button>

      </form>

    </div>
  );
}