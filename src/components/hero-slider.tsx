"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type HeroSlide = {
  id: string;
  image: string;
  imageLabel: string;
};

const slides: HeroSlide[] = [
  {
    id: "anzer-premium",
    image: "/images/hero/anzer-bali-slider.webp",
    imageLabel: "Anzer Balı Banner Görseli",
  },
  {
    id: "kahvalti-secki",
    image: "/images/hero/kahvalti-paketi-slider.webp",
    imageLabel: "Kahvaltı Paketi Banner Görseli",
  },
  {
    id: "mihlama-paketi",
    image: "/images/hero/mihlama-paketi-slider.webp",
    imageLabel: "Mıhlama Paketi Banner Görseli",
  },
  {
    id: "cay-bal-koleksiyonu",
    image: "/images/hero/cay-bal-slider.webp",
    imageLabel: "Çay Ve Bal Banner Görseli",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [paused]);

  function goTo(target: number) {
    if (target < 0) return setIndex(slides.length - 1);
    if (target >= slides.length) return setIndex(0);
    setIndex(target);
  }

  return (
    <section
      className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current == null) return;

        const delta = event.changedTouches[0]?.clientX - touchStart.current;

        if (delta > 30) goTo(index - 1);
        if (delta < -30) goTo(index + 1);

        touchStart.current = null;
      }}
    >
      <div className="relative aspect-[16/7] overflow-hidden rounded-3xl border border-amber-200 bg-amber-50 shadow-sm transition-colors duration-300 dark:border-emerald-900 dark:bg-slate-950 dark:shadow-black/40">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => (
            <article key={slide.id} className="relative h-full min-w-full">
              <Image
              src={slide.image}
              alt={slide.imageLabel}
              fill
              sizes="100vw"
              quality={100}
              priority={slide.id === "anzer-premium"}
              className="object-cover"
         />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/20 opacity-60 dark:opacity-80" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 dark:opacity-90" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,transparent_35%,rgba(0,0,0,0.22)_100%)] opacity-40 dark:opacity-70" />
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/20 dark:ring-emerald-400/10" />

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/40 bg-white/80 px-3 py-2 text-emerald-950 shadow-lg backdrop-blur transition hover:bg-white sm:block dark:border-emerald-700 dark:bg-slate-950/70 dark:text-white dark:hover:bg-slate-900"
          aria-label="Önceki Slayt"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/40 bg-white/80 px-3 py-2 text-emerald-950 shadow-lg backdrop-blur transition hover:bg-white sm:block dark:border-emerald-700 dark:bg-slate-950/70 dark:text-white dark:hover:bg-slate-900"
          aria-label="Sonraki Slayt"
        >
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/20 bg-black/15 px-3 py-2 backdrop-blur-md dark:bg-black/35">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(slideIndex)}
              className={`h-2.5 rounded-full transition-all ${
                slideIndex === index
                  ? "w-8 bg-white shadow-sm dark:bg-amber-300"
                  : "w-2.5 bg-white/55 hover:bg-white/80 dark:bg-white/35 dark:hover:bg-white/60"
              }`}
              aria-label={`${slideIndex + 1}. Slayta Git`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}