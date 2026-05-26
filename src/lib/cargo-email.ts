import { Resend } from "resend";

type SendCargoNotificationEmailInput = {
  customerName: string;
  customerEmail?: string | null;
  orderCode: string;
  cargoCompany?: string | null;
  trackingCode?: string | null;
  trackingUrl?: string | null;
};

export async function sendCargoNotificationEmail({
  customerName,
  customerEmail,
  orderCode,
  cargoCompany,
  trackingCode,
  trackingUrl,
}: SendCargoNotificationEmailInput) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey || !customerEmail) {
    console.warn("Kargo bildirimi atlandı: env veya müşteri e-postası eksik.");
    return;
  }

  const resend = new Resend(resendApiKey);

  const { data, error } = await resend.emails.send({
    from: "Anzerana Kargo <onboarding@resend.dev>",
    to: customerEmail,
    subject: `Siparişiniz Kargoya Verildi: ${orderCode}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#123;">
        <h2>Siparişiniz Kargoya Verildi</h2>

        <p>Merhaba ${customerName},</p>

        <p>
          <strong>${orderCode}</strong> numaralı siparişiniz kargoya verilmiştir.
        </p>

        <h3>Kargo Bilgileri</h3>

        <p><strong>Kargo Firması:</strong> ${cargoCompany || "-"}</p>
        <p><strong>Takip Kodu:</strong> ${trackingCode || "-"}</p>

        ${
          trackingUrl
            ? `<p><a href="${trackingUrl}" target="_blank" style="display:inline-block;background:#064e3b;color:white;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold;">Kargoyu Takip Et</a></p>`
            : ""
        }

        <p style="margin-top:24px;font-size:12px;color:#666;">
          Anzerana sipariş takip ve profil sayfanızdan da sipariş durumunuzu görüntüleyebilirsiniz.
        </p>
      </div>
    `,
  });

  if (error) {
    console.warn("Resend kargo mail hatası:", error);
    return;
  }

  console.log("Kargo bildirimi gönderildi:", data);
}