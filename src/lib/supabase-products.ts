import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/products";

type SupabaseProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  long_description: string;
  images: string[] | null;
  variants: Product["variants"] | null;
  badge: Product["badge"] | null;
  featured: boolean;
  package_contents: string[] | null;
  storage_type: string | null;
  price: string | null;
  compare_at_price: string | null;
  rating_summary: number | null;
  review_count: number | null;
  recommended_product_ids: string[] | null;
  stock_quantity: number | null;
  track_stock: boolean | null;
  allow_backorder: boolean | null;
  low_stock_threshold: number | null;
};

function mapProduct(item: SupabaseProduct): Product {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    shortDescription: item.short_description,
    longDescription: item.long_description,
    images: item.images ?? [],
    variants: item.variants ?? [],
    badge: item.badge ?? undefined,
    featured: item.featured,
    packageContents: item.package_contents ?? undefined,
    storageType: item.storage_type ?? undefined,
    price: item.price,
    compareAtPrice: item.compare_at_price,
    ratingSummary: item.rating_summary ?? undefined,
    reviewCount: item.review_count ?? 0,
    recommendedProductIds: item.recommended_product_ids ?? undefined,
    stockQuantity: item.stock_quantity ?? 0,
    trackStock: item.track_stock ?? false,
    allowBackorder: item.allow_backorder ?? false,
    lowStockThreshold: item.low_stock_threshold ?? 3,
  };
}

export async function getProductsFromSupabase() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true });

  if (error || !data) {
    console.error("Supabase ürün listeleme hatası:", error);
    return [];
  }

  return data.map(mapProduct);
}

export async function getProductBySlugFromSupabase(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Supabase ürün detay hatası:", error);
    return null;
  }

  return mapProduct(data);
}