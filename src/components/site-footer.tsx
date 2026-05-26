import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-amber-100 bg-[#f9f3e7] dark:border-emerald-900 dark:bg-[#0b1411]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4 sm:px-6">
        <section aria-label="Marka">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-white">
            Anzerana
          </h2>

          <p className="mt-3 text-sm leading-6 text-emerald-950/75 dark:text-slate-300">
            Coğrafi İşaretli Anzer Balı ve seçkin yöresel ürünleri güven odaklı
            satış anlayışıyla kullanıcılarımızla buluşturuyoruz.
          </p>
        </section>

        <section aria-label="Hızlı bağlantılar">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-900/80 dark:text-slate-400">
            Hızlı Erişim
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-emerald-900 dark:text-slate-200">
            <li>
              <Link href="/urunler" className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">
                Ürünler
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/dogrulama" className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">
                Doğrulama
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">
                İletişim
              </Link>
            </li>
          </ul>
        </section>

        <section aria-label="Yasal sayfalar">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-900/80 dark:text-slate-400">
            Yasal Bilgilendirme
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-emerald-900 dark:text-slate-200">
            <li>
              <Link href="/teslimat-iade" className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">
                Teslimat ve İade Şartları
              </Link>
            </li>
            <li>
              <Link href="/gizlilik-politikasi" className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">
                Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link href="/mesafeli-satis" className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">
                Mesafeli Satış Sözleşmesi
              </Link>
            </li>
            <li>
              <Link href="/sss" className="transition hover:text-emerald-700 hover:underline dark:hover:text-emerald-400">
                Sık Sorulan Sorular
              </Link>
            </li>
          </ul>
        </section>

        <section aria-label="İletişim">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-900/80 dark:text-slate-400">
            İletişim
          </h2>

          <p className="mt-3 text-sm text-emerald-950/75 dark:text-slate-300">
            Rize / Çayeli / Türkiye
          </p>

          <p className="mt-1 text-sm text-emerald-950/75 dark:text-slate-300">
            +90 (540) 042 61 53
          </p>

          <p className="mt-1 text-sm text-emerald-950/75 dark:text-slate-300">
            merhaba@anzerana.com
          </p>
        </section>
      </div>

      <div className="border-t border-amber-200/70 dark:border-emerald-900">
        <div className="mx-auto flex max-w-6xl justify-center px-4 py-5">
          <Image
            src="/images/payment/iyzico-footer-payments.png"
            alt="iyzico ile öde, Mastercard, Visa, American Express ve Troy ödeme logoları"
            width={842}
            height={120}
            className="h-auto max-h-10 w-auto max-w-full object-contain"
          />
        </div>

        <div className="px-4 pb-5 text-center text-xs text-emerald-950/70 dark:text-slate-400">
          © {new Date().getFullYear()} Anzerana • Tüm Hakları Saklıdır.
        </div>
      </div>
    </footer>
  );
}