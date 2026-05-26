import Link from "next/link";

export const metadata = {
  title: "Gizlilik Politikası | Anzerana",
  description: "Anzerana kişisel veriler, gizlilik ve veri işleme politikası.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <section className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
          Anzerana
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-emerald-950 dark:text-white">
          Gizlilik Politikası
        </h1>

        <div className="mt-6 space-y-6 text-sm leading-7 text-emerald-900/80 dark:text-slate-300">
          <p>
            Anzerana olarak kullanıcılarımızın gizliliğine önem veriyoruz. Bu
            politika, web sitemiz üzerinden toplanan kişisel verilerin hangi
            amaçlarla işlendiğini ve nasıl korunduğunu açıklar.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Toplanan Bilgiler
            </h2>
            <p className="mt-2">
              Sipariş ve üyelik işlemleri kapsamında ad soyad, e-posta adresi,
              telefon numarası, teslimat adresi, sipariş bilgileri ve ödeme
              işlemine ilişkin gerekli bilgiler işlenebilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Kullanım Amaçları
            </h2>
            <p className="mt-2">
              Kişisel veriler; siparişlerin alınması, teslimatın sağlanması,
              müşteri desteği verilmesi, fatura ve yasal yükümlülüklerin yerine
              getirilmesi, kullanıcı deneyiminin iyileştirilmesi ve güvenliğin
              sağlanması amacıyla kullanılır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Üçüncü Taraflarla Paylaşım
            </h2>
            <p className="mt-2">
              Verileriniz yalnızca siparişin tamamlanması için gerekli olduğu
              ölçüde ödeme kuruluşları, kargo firmaları ve yasal mercilerle
              paylaşılabilir. Kişisel bilgileriniz izniniz dışında ticari amaçla
              üçüncü kişilerle paylaşılmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Ödeme Güvenliği
            </h2>
            <p className="mt-2">
              Kart bilgileriniz Anzerana tarafından saklanmaz. Ödeme işlemleri,
              güvenli ödeme altyapısı sağlayan yetkili ödeme kuruluşları
              üzerinden gerçekleştirilir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Çerezler
            </h2>
            <p className="mt-2">
              Web sitemizde kullanıcı deneyimini iyileştirmek, sepet ve oturum
              süreçlerini yönetmek amacıyla çerezler kullanılabilir. Tarayıcı
              ayarlarınızdan çerez tercihlerinizi değiştirebilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-emerald-950 dark:text-white">
              Kullanıcı Hakları
            </h2>
            <p className="mt-2">
              Kişisel verilerinizle ilgili bilgi talep etme, düzeltme, silme,
              işlenmesini kısıtlama ve ilgili mevzuat kapsamında diğer
              haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
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