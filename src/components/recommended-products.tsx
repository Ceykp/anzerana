import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

type RecommendedProductsProps = {
  products: Product[];
};

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 rounded-3xl border border-amber-100 bg-amber-50/40 p-5 transition-colors duration-300 sm:p-7 dark:border-emerald-900 dark:bg-slate-950/70">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
            Önerilen Ürünler
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-emerald-950 dark:text-white">
            Bunları Da Beğenebilirsiniz
          </h2>
        </div>

        <Link
          href="/urunler"
          className="text-sm font-semibold text-emerald-900 hover:underline dark:text-slate-200 dark:hover:text-amber-300"
        >
          Tüm Ürünleri Gör
        </Link>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
        {products.map((product) => {
          const image = product.images?.[0] ?? "/images/placeholder-product.jpg";

          return (
            <article
              key={product.id}
              className="min-w-[250px] rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md md:min-w-0 dark:border-emerald-900 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-amber-400"
            >
              <Link href={`/urunler/${product.slug}`} className="block">
                <div className="relative h-36 overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white dark:border-emerald-900 dark:from-slate-950 dark:to-emerald-950/60">
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 250px, 33vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                    {product.category}
                  </p>

                  {product.badge ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                      {product.badge}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-2 text-lg font-semibold text-emerald-950 dark:text-white">
                  {product.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
                  {product.shortDescription}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-emerald-950 dark:text-white">
                    {product.price ?? "Fiyat Bilgisi Yakında"}
                  </p>

                  <span className="rounded-full border border-amber-200 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-700 dark:text-slate-100 dark:hover:bg-emerald-900">
                    İncele
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}