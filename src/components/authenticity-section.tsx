import Link from "next/link";

export function AuthenticitySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-emerald-900/20 bg-emerald-950 px-6 py-10 text-amber-50 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">Doğrulama</p>
        <h2 className="mt-3 text-3xl font-semibold">Yöresel ürün takibi</h2>
        <p className="mt-4 max-w-2xl leading-7 text-amber-50/85">
          Parti numarası ve ürün bilgileri ile ürün kaynağını şeffaf biçimde görüntüleyin.
        </p>
        <Link
          href="/dogrulama"
          className="mt-6 inline-flex rounded-full bg-amber-100 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-white"
        >
          Doğrulama Sayfasına Git
        </Link>
      </div>
    </section>
  );
}
