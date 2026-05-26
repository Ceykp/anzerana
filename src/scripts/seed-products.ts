import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { products } from "../lib/products";

const envPath = path.resolve(process.cwd(), ".env.local");

console.log("CWD:", process.cwd());
console.log("ENV PATH:", envPath);
console.log("ENV EXISTS:", fs.existsSync(envPath));

config({ path: envPath });

console.log("ENV CHECK:", {
  url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  service: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase URL veya SERVICE ROLE KEY eksik.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedProducts() {
  const mappedProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    short_description: product.shortDescription,
    long_description: product.longDescription,
    images: product.images,
    variants: product.variants,
    badge: product.badge ?? null,
    featured: product.featured,
    package_contents: product.packageContents ?? [],
    storage_type: product.storageType ?? null,
    price: product.price ?? null,
    compare_at_price: product.compareAtPrice ?? null,
    rating_summary: product.ratingSummary ?? null,
    review_count: product.reviewCount ?? 0,
    recommended_product_ids: product.recommendedProductIds ?? [],
  }));

  const { data, error } = await supabase
    .from("products")
    .upsert(mappedProducts, { onConflict: "id" })
    .select("id");

  if (error) {
    console.error("Seed hatası:", error);
    process.exit(1);
  }

  console.log(`${data?.length ?? 0} ürün başarıyla aktarıldı.`);
}

seedProducts();