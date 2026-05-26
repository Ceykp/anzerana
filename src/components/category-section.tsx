import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

type CategorySectionProps = {
  title: string;
  products: Product[];
};

export function CategorySection({ title, products }: CategorySectionProps) {
  if (products.length === 0) {
    return (
      <section aria-label={`${title} kategorisi`} className="mt-12">
        <h2 className="text-2xl font-semibold text-emerald-950">{title}</h2>
        <p className="mt-4 rounded-2xl border border-amber-100 bg-white p-5 text-sm text-emerald-900/75">
          Bu kategoriye ait ürünler yakında güncellenecektir.
        </p>
      </section>
    );
  }

  return (
    <section aria-label={`${title} kategorisi`} className="mt-12">
      <h2 className="text-2xl font-semibold text-emerald-950">{title}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
