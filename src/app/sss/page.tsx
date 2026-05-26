import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "SSS",
  description: "Anzerana ürünleri ve sipariş iletişim süreci hakkında sık sorulan sorular.",
};

export default function SssPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="SSS"
        title="Sik sorulan sorular"
        description="Urun secimi, fiyatlandirma ve iletisim surecini hizla ogrenin."
      />
      <div className="mt-8 space-y-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
            <summary className="cursor-pointer text-lg font-semibold text-emerald-950">{faq.question}</summary>
            <p className="mt-3 leading-7 text-emerald-950/80">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
