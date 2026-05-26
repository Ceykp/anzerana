import Link from "next/link";

export const metadata = {
  title: "Teslimat ve İade Şartları | Anzerana",
  description: "Anzerana teslimat, kargo, iptal ve iade şartları.",
};

export default function TeslimatIadePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
          Anzerana
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-white">
          Teslimat ve İade Şartları
        </h1>

        <div className="mt-6 space-y-6 text-sm leading-7 text-emerald-900/80 dark:text-slate-300">
          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Teslimat Süreci
            </h2>
            <p className="mt-2">
              Anzerana üzerinden verilen siparişler, stok ve ürün uygunluğu
              kontrol edildikten sonra genellikle 1-3 iş günü içerisinde kargoya
              teslim edilir. Resmi tatiller, hafta sonları ve kargo firmasından
              kaynaklanan gecikmeler teslimat süresini etkileyebilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Kargo Bilgilendirmesi
            </h2>
            <p className="mt-2">
              Siparişiniz kargoya verildiğinde kargo firması, takip numarası ve
              varsa takip bağlantısı tarafınıza iletilir. Üye girişi yapan
              müşteriler sipariş durumlarını profil sayfasındaki “Siparişlerim”
              bölümünden takip edebilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Hasarlı veya Eksik Ürün
            </h2>
            <p className="mt-2">
              Teslimat sırasında pakette hasar, ezilme, akma veya eksik ürün
              tespit edilirse kargo görevlisi yanında tutanak tutulması ve
              tarafımıza en kısa sürede bilgi verilmesi gerekmektedir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              İade Şartları
            </h2>
            <p className="mt-2">
              Gıda ürünlerinde hijyen ve sağlık koşulları gereği ambalajı
              açılmış, kullanılmış veya tekrar satılabilir özelliğini kaybetmiş
              ürünlerde iade kabul edilmez. Yanlış, kusurlu veya hasarlı ürün
              gönderimi durumunda iade/değişim talepleri değerlendirilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              İade Başvurusu
            </h2>
            <p className="mt-2">
              İade veya değişim talepleriniz için sipariş numaranız, ad soyad
              bilginiz ve ürün fotoğrafları ile birlikte iletişim kanallarımızdan
              bize ulaşabilirsiniz.
            </p>
          </div>
        </div>

        <Link
          href="/iletisim"
          className="mt-8 inline-flex rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700"
        >
          İletişime Geç
        </Link>
      </section>
    </main>
  );
}