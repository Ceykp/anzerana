import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Anzerana'nın kalite, şeffaflık ve yöresel değer odaklı marka hikayesi.",
};

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Marka Hikayesi"
        title="Anzerana kimdir?"
        description="Anzerana, coğrafi işaretli Anzer Balı ve seçili yöresel ürünleri güven odaklı premium vitrin anlayışıyla sunar."
      />
      <section className="mt-10 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-7 sm:p-9">
        <h2 className="text-3xl font-semibold text-emerald-950">Güvenilir yöresel seçim noktası</h2>
        <p className="mt-4 leading-8 text-emerald-950/80">
          Markamız, ürünleri yalnızca satışa sunmak yerine; kaynağı açık, dili net, sunumu özenli bir deneyim
          hâline getirmeyi hedefler. Anzer Balı bu anlayışın merkezinde yer alır.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-amber-100 bg-white p-6">
          <h2 className="text-2xl font-semibold text-emerald-950">Odak Noktamız</h2>
          <p className="mt-4 leading-7 text-emerald-950/80">
            Anzer Balı kategorisini ayrı konumlandırarak kalite, güven ve premium ürün deneyimini öne
            çıkarıyoruz.
          </p>
        </article>
        <article className="rounded-2xl border border-amber-100 bg-white p-6">
          <h2 className="text-2xl font-semibold text-emerald-950">Yaklaşımımız</h2>
          <p className="mt-4 leading-7 text-emerald-950/80">
            Şeffaf ürün bilgisi, dikkatli paketleme ve yerel tedarik ilkeleriyle güvenilir bir marka
            standardı oluşturuyoruz.
          </p>
        </article>
        <article className="rounded-2xl border border-amber-100 bg-white p-6">
          <h2 className="text-2xl font-semibold text-emerald-950">Profesyonel İletişim</h2>
          <p className="mt-4 leading-7 text-emerald-950/80">
            Sipariş öncesi ürün seçimi, gramaj ve paket bilgileri konusunda sade ve hızlı iletişim sağlıyoruz.
          </p>
        </article>
        <article className="rounded-2xl border border-amber-100 bg-white p-6">
          <h2 className="text-2xl font-semibold text-emerald-950">Yerel Değer, Premium Sunum</h2>
          <p className="mt-4 leading-7 text-emerald-950/80">
            Yöresel ürün mirasını modern tasarım diliyle buluşturarak artisanal bir marka deneyimi sunuyoruz.
          </p>
        </article>
      </section>
    </div>
  );
}
