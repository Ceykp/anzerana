import type { Metadata } from "next";
import { CategorySection } from "@/components/category-section";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/lib/products";
import { getProductsFromSupabase } from "@/lib/supabase-products";

function toAnchorId(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replaceAll(" ", "-");
}

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "Anzerana ürün kategorileri: Anzer Balı, ballar, çaylar, dolap ürünleri ve paketler.",
};

export const dynamic = "force-dynamic";

export default async function UrunlerPage() {
  const products = await getProductsFromSupabase();

  const activeCategories = categories.filter((category) =>
    products.some((product) => product.category === category),
  );

  const flagshipProducts = products.filter(
    (product) => product.category === "Anzer Balı",
  );

  const otherCategories = activeCategories.filter(
    (category) => category !== "Anzer Balı",
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Koleksiyon"
        title="Tüm ürünler"
        description="Anzer Balı odaklı premium seçkiyi kategori bazında inceleyin."
      />

      <nav
        aria-label="Kategori gecisleri"
        className="mt-8 flex flex-wrap gap-2"
      >
        {activeCategories.map((category) => (
          <a
            key={category}
            href={`#${toAnchorId(category)}`}
            className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-amber-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-950"
          >
            {category}
          </a>
        ))}
      </nav>

      {flagshipProducts.length > 0 ? (
        <section
          id={toAnchorId("Anzer Balı")}
          className="mt-10 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8 dark:border-emerald-900 dark:from-slate-900 dark:to-slate-950"
        >
          <SectionHeading
            eyebrow="Anzer Balı"
            title="Anzer Balı"
            description="Markamızın premium odak kategorisi. Coğrafi işaretli ürün çizgisi ayrı bir sunumla listelenir."
          />

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {flagshipProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {otherCategories.map((category) => (
        <section key={category} id={toAnchorId(category)}>
          <CategorySection
            title={category}
            products={products.filter((product) => product.category === category)}
          />
        </section>
      ))}
    </div>
  );
}