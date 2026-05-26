import { ProductImageGallery } from "@/components/product-image-gallery";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeChip } from "@/components/badge-chip";
import { PackageContents } from "@/components/package-contents";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { RecommendedProducts } from "@/components/recommended-products";
import { ReviewsSection } from "@/components/reviews-section";
import {
  getProductBySlugFromSupabase,
  getProductsFromSupabase,
} from "@/lib/supabase-products";
import type { Product } from "@/lib/products";

type ProductDetailProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromSupabase(slug);

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
      description: "Aradığınız Ürün Kaydı Bulunamadı.",
    };
  }

  return {
    title: product.name,
    description: `${product.shortDescription} | ${product.category}`,
  };
}

async function getRecommendedProducts(product: Product) {
  const products = await getProductsFromSupabase();

  const manualRecommendations = product.recommendedProductIds?.length
    ? products.filter((item) => product.recommendedProductIds?.includes(item.id))
    : [];

  if (manualRecommendations.length > 0) {
    return manualRecommendations.slice(0, 4);
  }

  const sameCategory = products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );

  if (sameCategory.length > 0) return sameCategory.slice(0, 4);

  return products.filter((item) => item.id !== product.id).slice(0, 4);
}

export default async function UrunDetayPage({ params }: ProductDetailProps) {
  const { slug } = await params;
  const product = await getProductBySlugFromSupabase(slug);

  if (!product) notFound();

  const isAnzer = product.category === "Anzer Balı";
  const recommendedProducts = await getRecommendedProducts(product);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <article
        className={`rounded-3xl border p-7 shadow-sm transition-colors duration-300 sm:p-10 dark:shadow-black/30 ${
          isAnzer
            ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-100/40 dark:border-amber-500/40 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-950"
            : "border-amber-200 bg-white dark:border-emerald-900 dark:bg-slate-900"
        }`}
      >
        {isAnzer && (
          <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-100/40 p-6 dark:border-amber-500/30 dark:bg-emerald-950/50">
            <h2 className="text-2xl font-semibold text-emerald-950 dark:text-white">
              Coğrafi İşaretli Anzer Balı
            </h2>
            <p className="mt-2 text-sm leading-6 text-emerald-900/80 dark:text-slate-300">
              Türkiye’nin en nadir ve en değerli bal çeşitlerinden biri olan
              Anzer Balı, sınırlı üretim ve özel florası ile öne çıkar.
              Doğallığı, saflığı ve kalite standardı ile güvenle tercih edilir.
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            priority={isAnzer}
          />

          <section>
            <p className="text-xs uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
              {product.category}
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-emerald-950 dark:text-white">
              {product.name}
            </h1>

            <p className="mt-3 text-lg leading-7 text-emerald-950/85 dark:text-slate-300">
              {product.shortDescription}
            </p>

            <div className="mt-4">
              {product.badge ? <BadgeChip badge={product.badge} /> : null}
            </div>

            <p className="mt-6 leading-8 text-emerald-950/80 dark:text-slate-300">
              {product.longDescription}
            </p>

            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-emerald-800 dark:bg-slate-950/70">
              <p className="text-sm text-emerald-900/80 dark:text-slate-400">
                Fiyat
              </p>
              <p className="mt-1 text-xl font-semibold text-emerald-950 dark:text-white">
                {product.price ?? "Fiyat Bilgisi Yakında"}
              </p>

              {isAnzer && (
                <p className="mt-2 text-xs text-emerald-900/70 dark:text-slate-400">
                  Sınırlı üretim ve özel toplama süreci nedeniyle fiyatlar
                  dönemsel olarak değişiklik gösterebilir.
                </p>
              )}
            </div>

            {product.storageType ? (
              <p className="mt-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                {product.storageType}
              </p>
            ) : null}

            <ProductDetailActions product={product} />
          </section>
        </div>

        <PackageContents items={product.packageContents ?? []} />

        {isAnzer && (
          <section className="mt-8 rounded-2xl border border-amber-200 bg-white p-5 dark:border-amber-500/30 dark:bg-slate-950/70">
            <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
              Neden Anzer Balı?
            </h2>

            <ul className="mt-3 space-y-2 text-sm text-emerald-950/80 dark:text-slate-300">
              <li>✔ Sınırlı üretim ve özel coğrafi alan</li>
              <li>✔ Yüksek rakımda doğal flora</li>
              <li>✔ Doğal ve katkısız üretim</li>
              <li>✔ Güven odaklı tedarik ve paketleme</li>
            </ul>
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-amber-100 bg-white p-5 dark:border-emerald-900 dark:bg-slate-950/70">
          <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
            Ürün Bilgilendirme Notları
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-emerald-950/80 dark:text-slate-300">
            <li>Ürün seçenekleri gramaja göre değişebilir.</li>
            <li>Paket içerikleri tedarik durumuna göre değişebilir.</li>
            <li>WhatsApp üzerinden sipariş verilebilir.</li>
          </ul>
        </section>

        <ReviewsSection
          productSlug={product.slug}
          defaultRating={product.ratingSummary}
          defaultCount={product.reviewCount}
        />

        <RecommendedProducts products={recommendedProducts} />
      </article>
    </div>
  );
}