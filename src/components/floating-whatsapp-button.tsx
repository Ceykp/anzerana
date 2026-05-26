"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function FloatingWhatsAppButton() {
  const [pulseActive, setPulseActive] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPulseActive(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const showPulse = pulseActive || hovered;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">

      {/* Müşteri Hizmetleri */}
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-amber-200 animate-ping opacity-70"></span>
        )}

        <a
          href="tel:+905400426153"
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white border border-amber-200 shadow-lg hover:bg-amber-50 transition"
        >
          ☎
        </a>
      </div>

      {/* WhatsApp */}
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70"></span>
        )}

        <Link
          href="https://wa.me/905400426153"
          target="_blank"
          className="relative flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-lg hover:bg-emerald-700 transition"
        >
          {/* online indicator */}
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>

          <span className="text-lg">💬</span>
          <span className="hidden sm:block text-sm font-semibold">
            WhatsApp
          </span>
        </Link>
      </div>

    </div>
  );
}