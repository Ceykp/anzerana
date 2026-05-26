type PackageContentsProps = {
  items: string[];
};

export function PackageContents({ items }: PackageContentsProps) {
  if (!items?.length) return null;

  return (
    <section className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/40 p-5 transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-emerald-950 dark:text-white">
        Paket İçeriği
      </h2>

      <ul className="mt-3 space-y-2 text-sm text-emerald-950/85 dark:text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-[2px] text-amber-600 dark:text-amber-300">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}