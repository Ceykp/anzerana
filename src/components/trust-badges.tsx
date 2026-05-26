type TrustBadgesProps = {
  items: string[];
};

export function TrustBadges({ items }: TrustBadgesProps) {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
      aria-label="Güven rozetleri"
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-emerald-950/85 shadow-sm transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-900 dark:text-slate-200 dark:shadow-black/20"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}