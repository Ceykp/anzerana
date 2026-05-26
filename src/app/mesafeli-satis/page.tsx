import Link from "next/link";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi | Anzerana",
  description:
    "Anzerana mesafeli satış sözleşmesi ve satış koşulları.",
};

export default function MesafeliSatisPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
          Anzerana
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-white">
          Mesafeli Satış Sözleşmesi
        </h1>

        <div className="mt-6 space-y-6 text-sm leading-7 text-emerald-900/80 dark:text-slate-300">

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              1. Taraflar
            </h2>

            <p className="mt-2">
              İşbu sözleşme; Anzerana (Satıcı) ile web sitesi üzerinden
              sipariş veren müşteri (Alıcı) arasında elektronik ortamda
              kurulmuştur.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              2. Konu
            </h2>

            <p className="mt-2">
              Bu sözleşmenin konusu, alıcının Anzerana internet sitesi
              üzerinden verdiği siparişe ilişkin satış ve teslimat
              koşullarının belirlenmesidir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              3. Sipariş ve Teslimat
            </h2>

            <p className="mt-2">
              Siparişler stok uygunluğu kontrol edildikten sonra hazırlanır.
              Teslimatlar anlaşmalı kargo firmaları aracılığıyla yapılır.
              Teslim süresi olağan koşullarda 1–3 iş günü arasında
              değişebilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              4. Ödeme İşlemleri
            </h2>

            <p className="mt-2">
              Ödemeler kredi kartı, banka kartı veya sistemde sunulan diğer
              yöntemlerle gerçekleştirilebilir. Kart bilgileri Anzerana
              sistemlerinde saklanmaz; yetkili ödeme kuruluşları üzerinden
              işlenir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              5. Cayma Hakkı
            </h2>

            <p className="mt-2">
              Gıda ürünlerinde sağlık ve hijyen şartları nedeniyle ambalajı
              açılmış veya tekrar satılabilir özelliğini kaybetmiş ürünlerde
              cayma hakkı uygulanmayabilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              6. İptal ve İade
            </h2>

            <p className="mt-2">
              Yanlış, eksik veya hasarlı gönderilen ürünlerde kullanıcı
              tarafımıza başvurarak değişim veya iade talebinde
              bulunabilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              7. Uyuşmazlıkların Çözümü
            </h2>

            <p className="mt-2">
              Taraflar arasında doğabilecek uyuşmazlıklarda ilgili tüketici
              mevzuatı hükümleri uygulanır. Yetkili tüketici hakem heyetleri
              ve mahkemeler esas alınır.
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/teslimat-iade"
            className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 dark:border-emerald-700 dark:text-white dark:hover:bg-emerald-900"
          >
            Teslimat ve İade
          </Link>

          <Link
            href="/gizlilik-politikasi"
            className="rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 dark:bg-emerald-700"
          >
            Gizlilik Politikası
          </Link>
        </div>
      </section>
    </main>
  );
}