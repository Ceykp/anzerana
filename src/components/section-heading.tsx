type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-emerald-950 sm:text-3xl dark:text-white">
        {title}
      </h2>

      {description ? (
        <p className="mt-4 leading-7 text-emerald-950/75 dark:text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
  );
}