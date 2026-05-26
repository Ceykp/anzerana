import { Resend } from "resend";

type OrderEmailItem = {
  productName: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
};

type SendOrderNotificationInput = {
  orderId: string;
  orderCode?: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingAddress: string;
  customerNote?: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: OrderEmailItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export async function sendOrderNotificationEmail({
  orderId,
  orderCode,
  customerName,
  customerEmail,
  customerPhone,
  shippingCity,
  shippingDistrict,
  shippingAddress,
  customerNote,
  subtotal,
  shippingFee,
  total,
  items,
}: SendOrderNotificationInput) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!resendApiKey || !notificationEmail) {
    console.warn("Sipariş e-posta bildirimi atlandı: env eksik.");
    return;
  }

  const resend = new Resend(resendApiKey);
  const orderNumber = orderCode ?? orderId;

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.productName}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.variantLabel}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${formatCurrency(
            item.unitPrice * item.quantity,
          )}</td>
        </tr>
      `,
    )
    .join("");

    const { data, error } = await resend.emails.send({
    from: "Anzerana Sipariş <onboarding@resend.dev>",
    to: notificationEmail,
    subject: `Yeni Sipariş Alındı: ${orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#123;">
        <h2>Yeni Sipariş Alındı</h2>

        <p><strong>Sipariş No:</strong> ${orderNumber}</p>
        <p><strong>Müşteri:</strong> ${customerName}</p>
        <p><strong>E-posta:</strong> ${customerEmail || "-"}</p>
        <p><strong>Telefon:</strong> ${customerPhone}</p>

        <h3>Teslimat</h3>
        <p>${shippingCity} / ${shippingDistrict}</p>
        <p>${shippingAddress}</p>

        <h3>Ürünler</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Ürün</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Seçenek</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Adet</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #ddd;">Tutar</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <h3>Tutar</h3>
        <p><strong>Ara Toplam:</strong> ${formatCurrency(subtotal)}</p>
        <p><strong>Kargo:</strong> ${
          shippingFee === 0 ? "Ücretsiz" : formatCurrency(shippingFee)
        }</p>

if (error) {
  console.warn("Resend mail hatası:", error);
  return;
}

console.log("Resend mail gönderildi:", data);

        <p><strong>Genel Toplam:</strong> ${formatCurrency(total)}</p>

        <h3>Not</h3>
        <p>${customerNote || "-"}</p>

        <p style="margin-top:24px;font-size:12px;color:#666;">
          Admin panelden siparişi kontrol etmeyi unutmayın.
        </p>
      </div>
    `,
  });
}