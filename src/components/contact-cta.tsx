import Link from "next/link";
import { WhatsAppCTAButton } from "@/components/whatsapp-cta-button";

export function ContactCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-amber-200 bg-[#fff7e6] px-6 py-10 text-center sm:px-12">
        <h2 className="text-3xl font-semibold text-emerald-950">Ürün Seçiminde Destek Alın</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-emerald-950/80">
          Sipariş yerine şu an iletişim odaklı ilerliyoruz. Ürün ve Gramaj Tercihinizi Bize İletin.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <WhatsAppCTAButton message="Merhaba, ürünler hakkında bilgi almak istiyorum.">
            WhatsApp ile Yaz
          </WhatsAppCTAButton>
          <Link
            href="/iletisim"
            className="inline-flex rounded-full border border-emerald-900 px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-900 hover:text-white"
          >
            Iletisim Formu
          </Link>
        </div>
      </div>
    </section>
  );
}
