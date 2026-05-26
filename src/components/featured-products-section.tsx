import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";
import { SectionHeading } from "@/components/section-heading";

type FeaturedProductsSectionProps = {
  products: Product[];
};

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const safeProducts = Array.isArray(products) ? products : [];

  // Stabil render için sıralama
  const sortedProducts = [...safeProducts].sort((a, b) =>
    a.name.localeCompare(b.name, "tr")
  );

  if (sortedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHeading
        eyebrow="Öne Çıkanlar"
        title="Öne Çıkan Ürünler"
        description="Anzerana seçkisinden öne çıkan ürünleri keşfedin."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {sortedProducts.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}