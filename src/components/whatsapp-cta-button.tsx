"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

type WhatsAppCTAButtonProps = {
  message?: string;
  className?: string;
  children?: React.ReactNode;
};

function toNumericValue(priceText: string) {
  const normalized = priceText.replace(/[^\d,]/g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function WhatsAppCTAButton({
  message,
  className,
  children,
}: WhatsAppCTAButtonProps) {
  const { items } = useCart();

  // Sepet toplamı
  const subtotal = items.reduce(
    (sum, item) => sum + toNumericValue(item.unitPriceText) * item.quantity,
    0
  );

  const shipping = subtotal >= 3500 ? 0 : subtotal > 0 ? 200 : 0;
  const total = subtotal + shipping;

  // Ürün listesi oluştur
  const productList = items
    .map(
      (item) =>
        `- ${item.productName} (${item.variantLabel}) x${item.quantity}`
    )
    .join("\n");

  // WhatsApp mesajı
  const finalMessage =
    items.length > 0
      ? `Merhaba,

Sepetimdeki Ürünler:

${productList}

Ara Toplam: ₺${subtotal.toLocaleString("tr-TR")}
Kargo: ${
          shipping === 0 ? "Ücretsiz" : `₺${shipping.toLocaleString("tr-TR")}`
        }
Toplam: ₺${total.toLocaleString("tr-TR")}

Sipariş Vermek İstiyorum.`
      : message ?? "Merhaba, ürünler hakkında bilgi almak istiyorum.";

  const encodedMessage = encodeURIComponent(finalMessage);
  const href = `https://wa.me/905400426153?text=${encodedMessage}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      }
      aria-label="WhatsApp ile İletişime Geç"
    >
      {children ?? "WhatsApp ile Sipariş Ver"}
    </Link>
  );
}