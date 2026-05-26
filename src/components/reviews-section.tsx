"use client";

import { useMemo, useState } from "react";

type Review = {
  id: string;
  rating: number;
  name: string;
  title?: string;
  comment: string;
  createdAt: string;
};

type ReviewsSectionProps = {
  productSlug: string;
  defaultRating?: number;
  defaultCount?: number;
};

const sortOptions = [
  { id: "newest", label: "En Yeni" },
  { id: "highest", label: "En Yüksek Puan" },
  { id: "lowest", label: "En Düşük Puan" },
] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-300">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden="true">
          {star <= Math.round(rating) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function ReviewsSection({
  productSlug,
  defaultRating = 0,
  defaultCount = 0,
}: ReviewsSectionProps) {
  const key = `anzerana-reviews-${productSlug}`;

  const [ratingInput, setRatingInput] = useState(5);
  const [nameInput, setNameInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[number]["id"]>("newest");

  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window === "undefined") return [];

    const raw = localStorage.getItem(key);
    if (!raw) return [];

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  function persist(next: Review[]) {
    setReviews(next);
    localStorage.setItem(key, JSON.stringify(next));
  }

  const sorted = useMemo(() => {
    const list = [...reviews];

    if (sortBy === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "lowest") {
      list.sort((a, b) => a.rating - b.rating);
    }

    if (sortBy === "newest") {
      list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }

    return list;
  }, [reviews, sortBy]);

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;

    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }, [reviews]);

  const totalCount = reviews.length;

  const ratingBreakdown = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((review) => review.rating === star).length;
      const percentage = reviews.length ? (count / reviews.length) * 100 : 0;

      return {
        star,
        count,
        percentage,
      };
    });
  }, [reviews]);

  return (
    <section className="mt-10 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-950/70 dark:shadow-black/30">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 dark:border-emerald-800 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
            Müşteri Deneyimi
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-emerald-950 dark:text-white">
            Yorumlar Ve Değerlendirmeler
          </h2>

          <div className="mt-5 flex items-end gap-3">
            <p className="text-5xl font-semibold text-emerald-950 dark:text-white">
              {average.toFixed(1)}
            </p>

            <div className="pb-1">
              <Stars rating={average} />
              <p className="mt-1 text-sm text-emerald-900/70 dark:text-slate-300">
                {totalCount} Değerlendirme
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {ratingBreakdown.map((item) => (
              <div
                key={item.star}
                className="grid grid-cols-[54px_1fr_24px] items-center gap-2"
              >
                <span className="text-xs font-medium text-emerald-900/70 dark:text-slate-300">
                  {item.star} Yıldız
                </span>

                <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-slate-950">
                  <div
                    className="h-full rounded-full bg-amber-500 dark:bg-amber-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="text-right text-xs text-emerald-900/60 dark:text-slate-400">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-emerald-950 dark:text-white">
                Ürün Yorumları
              </h3>
              <p className="mt-1 text-sm text-emerald-900/70 dark:text-slate-300">
                Bu Ürün İçin Paylaşılan Deneyimleri İnceleyin.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSortBy(option.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    sortBy === option.id
                      ? "border-emerald-900 bg-emerald-900 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-slate-950"
                      : "border-amber-200 text-emerald-900 hover:bg-amber-50 dark:border-emerald-800 dark:text-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {sorted.length === 0 ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 dark:border-emerald-800 dark:bg-slate-900">
                <p className="font-semibold text-emerald-950 dark:text-white">
                  İlk Yorumu Sen Yap
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-900/75 dark:text-slate-300">
                  Bu Ürünü Deneyimlediysen, Görüşünü Paylaşarak Diğer
                  Müşterilere Yardımcı Olabilirsin.
                </p>
              </div>
            ) : (
              sorted.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm dark:border-emerald-800 dark:bg-slate-900 dark:shadow-black/20"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-emerald-950 dark:text-white">
                        {review.name}
                      </p>
                      <p className="mt-1 text-xs text-emerald-900/55 dark:text-slate-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    <Stars rating={review.rating} />
                  </div>

                  {review.title ? (
                    <p className="mt-3 text-sm font-semibold text-emerald-900 dark:text-slate-100">
                      {review.title}
                    </p>
                  ) : null}

                  <p className="mt-2 text-sm leading-6 text-emerald-900/80 dark:text-slate-300">
                    {review.comment}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      <form
        className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/30 p-5 dark:border-emerald-800 dark:bg-slate-900"
        onSubmit={(event) => {
          event.preventDefault();

          if (!nameInput.trim() || !commentInput.trim()) return;

          const next = [
            {
              id: crypto.randomUUID(),
              rating: ratingInput,
              name: nameInput.trim(),
              title: titleInput.trim(),
              comment: commentInput.trim(),
              createdAt: new Date().toISOString(),
            },
            ...reviews,
          ];

          persist(next);
          setNameInput("");
          setTitleInput("");
          setCommentInput("");
          setRatingInput(5);
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
              Deneyimini Paylaş
            </p>
            <h3 className="mt-2 text-xl font-semibold text-emerald-950 dark:text-white">
              Yorum Bırak
            </h3>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingInput(star)}
                className={`text-2xl transition hover:scale-110 ${
                  star <= ratingInput
                    ? "text-amber-500 dark:text-amber-300"
                    : "text-amber-200 dark:text-slate-700"
                }`}
                aria-label={`${star} Yıldız`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-900/20 dark:border-emerald-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-amber-300/20"
            placeholder="Adınız"
          />

          <input
            value={titleInput}
            onChange={(event) => setTitleInput(event.target.value)}
            className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-900/20 dark:border-emerald-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-amber-300/20"
            placeholder="Başlık (Opsiyonel)"
          />
        </div>

        <textarea
          value={commentInput}
          onChange={(event) => setCommentInput(event.target.value)}
          rows={4}
          className="mt-3 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-900/20 dark:border-emerald-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-amber-300/20"
          placeholder="Deneyiminizi Paylaşın"
        />

        <button
          type="submit"
          className="mt-4 rounded-full bg-emerald-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-emerald-700 dark:hover:bg-emerald-600"
        >
          Yorumu Gönder
        </button>
      </form>
    </section>
  );
}