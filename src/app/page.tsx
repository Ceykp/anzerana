import Link from "next/link";
import type { Metadata } from "next";
import { AuthenticitySection } from "@/components/authenticity-section";
import { ContactCTA } from "@/components/contact-cta";
import { FeaturedProductsSection } from "@/components/featured-products-section";
import { HeroSlider } from "@/components/hero-slider";
import { SectionHeading } from "@/components/section-heading";
import { TrustBadges } from "@/components/trust-badges";
import { products } from "@/lib/products";
import { faqs, testimonials, trustBadges, whyChooseUs } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description: "Coğrafi İşaretli Anzer Balı ve Premium Yöresel Ürünler.",
};

export default function Home() {
  const featuredProducts = products
  .filter((product) => product.featured)
  .sort(() => Math.random() - 0.5)
  .slice(0, 4);
  const featuredCategories = ["Anzer Balı", "Bal Çeşitleri", "Çaylar", "Tereyağı ve Peynirler", "Kahvaltı Paketleri"];

  return (
    <div>
      <HeroSlider />

      <TrustBadges items={trustBadges} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SectionHeading
          eyebrow="Kategoriler"
          title="Öne çıkan ürün kategorileri"
          description="Anzer Balını Hemen Keşfet."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {featuredCategories.map((category) => (
            <Link
            key={category}
            href="/urunler"
            className="rounded-2xl border border-amber-100 bg-white px-4 py-5 text-center font-semibold text-emerald-950 shadow-sm transition hover:border-emerald-200 hover:bg-amber-50 hover:shadow-md dark:border-emerald-900 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20 dark:hover:border-amber-400 dark:hover:bg-slate-800"
          >
            {category}
          </Link>
          ))}
        </div>
      </section>

      <FeaturedProductsSection products={featuredProducts} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SectionHeading eyebrow="Neden Biz" title="Anzerana Farkı" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <article
            key={item.title}
            className="rounded-2xl border border-amber-100 bg-[#fffdf9] p-6 transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-900"
          >
            <h3 className="text-xl font-semibold text-emerald-950 dark:text-white">
              {item.title}
            </h3>
          
            <p className="mt-3 leading-7 text-emerald-950/80 dark:text-slate-300">
              {item.description}
            </p>
          </article>
          ))}
        </div>
      </section>

      <AuthenticitySection />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SectionHeading eyebrow="Yorumlar" title="Müşterilerimiz ne diyor?" centered />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="rounded-2xl border border-amber-100 bg-white p-6">
              <p className="leading-7 text-emerald-950/85">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-4 text-sm font-semibold text-emerald-900">
                {item.name} - {item.city}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SectionHeading eyebrow="SSS" title="Sık sorulan sorular" />
        <div className="mt-7 space-y-4">
          {faqs.slice(0, 4).map((faq) => (
            <details key={faq.question} className="rounded-xl border border-amber-100 bg-white p-5">
              <summary className="cursor-pointer font-semibold text-emerald-950">{faq.question}</summary>
              <p className="mt-3 leading-7 text-emerald-950/75">{faq.answer}</p>
            </details>
          ))}
        </div>
        <Link href="/sss" className="mt-5 inline-flex text-sm font-semibold text-emerald-900 hover:underline">
          Tüm soruları görüntüle
        </Link>
      </section>

      <ContactCTA />
    </div>
  );
}
