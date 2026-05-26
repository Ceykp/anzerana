import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-4xl font-semibold text-emerald-950">Sayfa bulunamadi</h1>
      <p className="mt-4 leading-7 text-emerald-950/80">
        Aradiginiz icerik tasinmis veya kaldirilmis olabilir.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Ana sayfaya don
      </Link>
    </div>
  );
}
