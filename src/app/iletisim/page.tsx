import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { WhatsAppCTAButton } from "@/components/whatsapp-cta-button";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Anzerana ile ürün seçimi ve sipariş ön bilgi için iletişime geçin.",
};

export default function IletisimPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Bize Ulasin"
        title="Iletisim"
        description="Siparis ve urun secimi surecinde guven odakli iletisim sunuyoruz. Checkout aktif degil; taleplerinizi bize dogrudan iletebilirsiniz."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-amber-100 bg-white p-6">
          <h2 className="text-2xl font-semibold text-emerald-950">Iletisim Bilgileri</h2>
          <p className="mt-4 text-emerald-950/80">E-posta: merhaba@anzerana.com</p>
          <p className="text-emerald-950/80">Telefon: +90 (000) 000 00 00</p>
          <p className="text-emerald-950/80">Adres: Rize, Turkiye</p>
          <div className="mt-5">
            <WhatsAppCTAButton message="Merhaba, urunleriniz hakkinda detayli bilgi almak istiyorum.">
              WhatsApp ile Ulas
            </WhatsAppCTAButton>
          </div>
          <p className="mt-4 text-sm leading-6 text-emerald-950/70">
            Oneri: Iletisim mesajinizda urun adi ve gramaj seceneginizi belirtirseniz daha hizli destek
            saglayabiliriz.
          </p>
        </section>

        <form className="rounded-2xl border border-amber-100 bg-white p-6" aria-label="Iletisim formu">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-emerald-950">
            Ad Soyad
          </label>
          <input
            id="name"
            type="text"
            className="mb-4 w-full rounded-xl border border-amber-200 px-4 py-3 outline-none ring-emerald-900/20 focus:ring"
            placeholder="Ornek: Ayse Yilmaz"
          />
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-emerald-950">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            className="mb-4 w-full rounded-xl border border-amber-200 px-4 py-3 outline-none ring-emerald-900/20 focus:ring"
            placeholder="ornek@eposta.com"
          />
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-emerald-950">
            Mesaj
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full rounded-xl border border-amber-200 px-4 py-3 outline-none ring-emerald-900/20 focus:ring"
            placeholder="Talebinizi yazin..."
          />
          <button
            type="button"
            className="mt-5 rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Gonder (Demo)
          </button>
        </form>
      </div>

      <section className="mt-8 rounded-2xl border border-amber-100 bg-white p-6">
        <h2 className="text-2xl font-semibold text-emerald-950">Magaza Konumu (Placeholder)</h2>
        <p className="mt-3 text-sm leading-7 text-emerald-950/80">
          Fiziksel magaza / teslim noktasi bilgileri yakinda eklenecektir.
        </p>
        <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-700">
          Harita Alani
        </div>
      </section>
    </div>
  );
}
