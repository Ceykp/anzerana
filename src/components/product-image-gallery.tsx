"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
  priority?: boolean;
};

export function ProductImageGallery({
  images,
  productName,
  priority = false,
}: ProductImageGalleryProps) {
  const safeImages =
    images && images.length > 0 ? images : ["/images/placeholder-product.jpg"];

  const [activeImage, setActiveImage] = useState(safeImages[0]);

  return (
    <section>
      <div className="relative h-80 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm transition-colors duration-300 dark:border-emerald-900 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/50 dark:shadow-black/30">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition duration-500 hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition dark:opacity-40" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {safeImages.slice(0, 3).map((image, index) => {
          const isActive = image === activeImage;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative h-20 overflow-hidden rounded-xl border bg-white transition dark:bg-slate-950 ${
                isActive
                  ? "border-emerald-900 ring-2 ring-emerald-900/20 dark:border-amber-300 dark:ring-amber-300/25"
                  : "border-amber-100 hover:border-amber-300 dark:border-emerald-900 dark:hover:border-amber-400"
              }`}
              aria-label={`${productName} Görsel ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} Görsel ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover transition duration-300 hover:scale-105"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}