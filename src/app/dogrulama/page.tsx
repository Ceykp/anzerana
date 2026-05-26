import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppCTAButton } from "@/components/whatsapp-cta-button";

export const metadata: Metadata = {
  title: "Doğrulama",
  description: "Anzerana ürünlerinin kaynak ve parti bilgilerini doğrulama alanı.",
};

export default function DogrulamaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Guven Sistemi"
        title="Dogrulama / Guven"
        description="Urun seffafligi ve otantiklik odakli iletisim anlayisimizi bu alanda acikca paylasiyoruz."
      />
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          {
            title: "Seffaf Bilgi",
            description: "Urun kategorisi, icerik ve secenekler acik bir dille paylasilir.",
          },
          {
            title: "Kaynak Odagi",
            description: "Anzer Bali ve yoresel urunler kaynagini vurgulayan bir yapiyla sunulur.",
          },
          {
            title: "Guvenli Iletisim",
            description: "Siparis sureci oncesinde tum sorular WhatsApp ve iletisim kanallarindan yanitlanir.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Guven</p>
            <h2 className="mt-3 text-2xl font-semibold text-emerald-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-emerald-950/80">{item.description}</p>
          </article>
        ))}
      </section>
      <section className="mt-8 rounded-2xl border border-amber-200 bg-white p-6 sm:p-8">
        <form className="space-y-5" aria-label="Urun dogrulama formu">
          <div>
            <label htmlFor="batchCode" className="mb-2 block text-sm font-medium text-emerald-950">
              Parti Numarasi / QR Kodu
            </label>
            <input
              id="batchCode"
              name="batchCode"
              type="text"
              placeholder="Ornek: ANZ-2026-00124"
              className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3 text-emerald-950 outline-none ring-emerald-900/20 placeholder:text-emerald-950/40 focus:ring"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Dogrula (Demo)
            </button>
            <WhatsAppCTAButton message="Merhaba, urun dogrulama sureci hakkinda bilgi almak istiyorum.">
              WhatsApp ile Danis
            </WhatsAppCTAButton>
          </div>
        </form>
      </section>
    </div>
  );
}
