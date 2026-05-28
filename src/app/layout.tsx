import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";
import { CartDrawer } from "@/components/cart-drawer";
import { CartToast } from "@/components/cart-toast";
import { FloatingWhatsAppButton } from "@/components/floating-whatsapp-button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/context/theme-context";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anzerana.com"),
  title: {
    default: "Anzerana",
    template: "%s | Anzerana",
  },
  description: "Coğrafi İşaretli Anzer Balı ve yöresel ürünler.",
  keywords: [
    "Anzer balı",
    "Coğrafi İşaretli Bal",
    "Premium Bal",
    "Yerel Ürünler",
    "Rize Balı",
  ],
};

function TrustBar() {
  const items = [
    "Coğrafi İşaretli Ürün",
    "Özenli Paketleme",
    "WhatsApp Destek",
    "3500₺ Üzeri Ücretsiz Kargo",
  ];

  const loopItems = [...items, ...items, ...items];

  return (
    <div className="sticky top-[76px] z-30 border-b border-amber-100 bg-emerald-950 text-white dark:border-emerald-800 dark:bg-black">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
          {loopItems.map((item, index) => (
            <span key={`${item}-${index}`} className="whitespace-nowrap">
              ✓ {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-amber-50 text-emerald-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-emerald-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Ana İçeriğe Geç
        </a>

        <ThemeProvider>
          <AppProviders>
            <div className="flex min-h-full flex-col">
              <SiteHeader />
              <TrustBar />
              <main id="icerik" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </div>

            <CartDrawer />
            <CartToast />
            <FloatingWhatsAppButton />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}