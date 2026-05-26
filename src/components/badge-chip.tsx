import type { ProductBadge } from "@/lib/products";

type BadgeChipProps = {
  badge: ProductBadge;
};

const badgeLabelMap: Record<ProductBadge, string> = {
  premium: "Premium Seri",
  doğal: "Doğal Seçki",
  yöresel: "Yöresel Lezzet",
  "çok-satan": "Öne Çıkan Ürün",
  "özel-seçki": "Özel Seçki",
};

export function BadgeChip({ badge }: BadgeChipProps) {
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-800">
      {badgeLabelMap[badge]}
    </span>
  );
}
