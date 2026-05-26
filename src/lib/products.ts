export type ProductBadge =
  | "premium"
  | "doğal"
  | "yöresel"
  | "çok-satan"
  | "özel-seçki";

export type ProductVariant = {
  id: string;
  label: string;
  price?: string | null;
  href?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
  variants: ProductVariant[];
  badge?: ProductBadge;
  featured: boolean;
  packageContents?: string[];
  storageType?: string;
  price?: string | null;
  compareAtPrice?: string | null;
  ratingSummary?: number;
  reviewCount?: number;
  recommendedProductIds?: string[];
};

const balDescription =
  "Özenle seçilen yöresel kaynaklardan gelen bu ürün, kalite ve güven odağında dikkatli paketleme anlayışıyla sunulur.";

const sogukZincirDescription =
  "Soğuk zincir koşulları gözetilerek sunulan bu ürün, yöresel lezzeti güvenli ve özenli paketleme anlayışıyla sofralara ulaştırır.";

export const products: Product[] = [
  {
    id: "anzer-bali-980gr",
    slug: "anzer-bali-980gr",
    name: "Anzer Balı 980 gr",
    category: "Anzer Balı",
    shortDescription: "Özel Seri, Tescilli ve Coğrafi İşaretli Anzer Balı.",
    longDescription:
      "Anzer Yaylası florasından özenle elde edilen Anzer Balı, şeffaf ürün bilgilendirmesi ve dikkatli paketleme anlayışıyla sunulur.",
    images: ["/images/products/anzer-bali-980gr.jpg"],
    variants: [
      { id: "980gr", label: "980 gr", price: "₺7.500", href: "/urunler/anzer-bali-980gr" },
      { id: "500gr", label: "500 gr", price: "₺3.850", href: "/urunler/anzer-bali-500gr" },
      { id: "250gr", label: "250 gr", price: "₺2.000", href: "/urunler/anzer-bali-250gr" },
    ],
    badge: "özel-seçki",
    featured: true,
    price: "₺7.500",
    compareAtPrice: "₺8.500",
    ratingSummary: 4.9,
    reviewCount: 38,
    recommendedProductIds: ["elek-alti-cay", "premium-kahvalti-paketi", "anzer-poleni-400gr"],
  },
  {
    id: "anzer-bali-500gr",
    slug: "anzer-bali-500gr",
    name: "Anzer Balı 500 gr",
    category: "Anzer Balı",
    shortDescription: "Coğrafi İşaretli Anzer Balı 500 gr seçeneği.",
    longDescription:
      "Anzer Yaylası florasından gelen Anzer Balı, özel florası ve sınırlı üretim yapısıyla premium ürün seçkisinde yer alır.",
    images: ["/images/products/anzer-bali-500gr.jpg"],
    variants: [
      { id: "980gr", label: "980 gr", price: "₺7.500", href: "/urunler/anzer-bali-980gr" },
      { id: "500gr", label: "500 gr", price: "₺3.850", href: "/urunler/anzer-bali-500gr" },
      { id: "250gr", label: "250 gr", price: "₺2.000", href: "/urunler/anzer-bali-250gr" },
    ],
    badge: "özel-seçki",
    featured: false,
    price: "₺3.850",
    ratingSummary: 4.9,
    reviewCount: 38,
    recommendedProductIds: ["elek-alti-cay", "premium-kahvalti-paketi", "anzer-poleni-400gr"],
  },
  {
    id: "anzer-bali-250gr",
    slug: "anzer-bali-250gr",
    name: "Anzer Balı 250 gr",
    category: "Anzer Balı",
    shortDescription: "Coğrafi İşaretli Anzer Balı 250 gr seçeneği.",
    longDescription:
      "Anzer Balı 250 gr seçeneği, ürünü daha küçük gramajda deneyimlemek isteyenler için hazırlanmıştır.",
    images: ["/images/products/anzer-bali-250gr.jpg"],
    variants: [
      { id: "980gr", label: "980 gr", price: "₺7.500", href: "/urunler/anzer-bali-980gr" },
      { id: "500gr", label: "500 gr", price: "₺3.850", href: "/urunler/anzer-bali-500gr" },
      { id: "250gr", label: "250 gr", price: "₺2.000", href: "/urunler/anzer-bali-250gr" },
    ],
    badge: "özel-seçki",
    featured: false,
    price: "₺2.000",
    ratingSummary: 4.9,
    reviewCount: 38,
    recommendedProductIds: ["elek-alti-cay", "premium-kahvalti-paketi", "anzer-poleni-200gr"],
  },


    {
      id: "kestane-bali-980gr",
      slug: "kestane-bali-980gr",
      name: "Kestane Balı 980 gr",
      category: "Bal Çeşitleri",
      shortDescription: "Karadeniz karakterini yansıtan yoğun aromalı bal seçeneği.",
      longDescription: balDescription,
      images: ["/images/products/kestane-bali-980gr.jpg"],
      variants: [
        { id: "980gr", label: "980 gr", price: "₺3.500", href: "/urunler/kestane-bali-980gr" },
        { id: "500gr", label: "500 gr", price: "₺1.700", href: "/urunler/kestane-bali-500gr" },
      ],
      badge: "doğal",
      featured: false,
      price: "₺3.500",
      ratingSummary: 4.7,
      reviewCount: 14,
      recommendedProductIds: ["cicek-bali-980gr", "elek-alti-cay"],
    },
    {
      id: "kestane-bali-500gr",
      slug: "kestane-bali-500gr",
      name: "Kestane Balı 500 gr",
      category: "Bal Çeşitleri",
      shortDescription: "Karadeniz karakterini yansıtan yoğun aromalı bal seçeneği.",
      longDescription: balDescription,
      images: ["/images/products/kestane-bali-500gr.jpg"],
      variants: [
        { id: "980gr", label: "980 gr", price: "₺3.500", href: "/urunler/kestane-bali-980gr" },
        { id: "500gr", label: "500 gr", price: "₺1.700", href: "/urunler/kestane-bali-500gr" },
      ],
      badge: "doğal",
      featured: false,
      price: "₺1.700",
      ratingSummary: 4.7,
      reviewCount: 14,
      recommendedProductIds: ["cicek-bali-500gr", "elek-alti-cay"],
    },
  
  
    {
      id: "kackar-cicek-bali-1000gr",
      slug: "kackar-cicek-bali-1000gr",
      name: "Kaçkar Çiçek Balı 980 gr",
      category: "Bal Çeşitleri",
      shortDescription: "Kaçkar dağlarından gelen özel çiçek balı.",
      longDescription: balDescription,
      images: ["/images/products/kackar-cicek-bali-1000gr.jpg"],
      variants: [
        { id: "900gr", label: "980 gr", price: "₺1.200", href: "/urunler/kackar-cicek-bali-1000gr" },
        { id: "500gr", label: "500 gr", price: "₺600", href: "/urunler/kackar-cicek-bali-500gr" },
      ],
      badge: "yöresel",
      featured: true,
      price: "₺1.200",
      ratingSummary: 4.8,
      reviewCount: 19,
      recommendedProductIds: ["anzer-bali-500gr", "premium-kahvalti-paketi"],
    },
    {
      id: "kackar-cicek-bali-500gr",
      slug: "kackar-cicek-bali-500gr",
      name: "Kaçkar Çiçek Balı 500 gr",
      category: "Bal Çeşitleri",
      shortDescription: "Kaçkar dağlarından gelen özel çiçek balı.",
      longDescription: balDescription,
      images: ["/images/products/kackar-cicek-bali-500gr.jpg"],
      variants: [
        { id: "980gr", label: "980 gr", price: "₺1.200", href: "/urunler/kackar-cicek-bali-1000gr" },
        { id: "500gr", label: "500 gr", price: "₺600", href: "/urunler/kackar-cicek-bali-500gr" },
      ],
      badge: "yöresel",
      featured: false,
      price: "₺600",
      ratingSummary: 4.8,
      reviewCount: 19,
      recommendedProductIds: ["anzer-bali-250gr", "premium-kahvalti-paketi"],
    },
  
    {
      id: "ovit-cicek-bali-1000gr",
      slug: "ovit-cicek-bali-1000gr",
      name: "Ovit Çiçek Balı 980 gr",
      category: "Bal Çeşitleri",
      shortDescription: "Ovit yaylası florasından gelen doğal çiçek balı.",
      longDescription: balDescription,
      images: ["/images/products/ovit-cicek-bali-1000gr.jpg"],
      variants: [
        { id: "980gr", label: "980 gr", price: "₺2.000", href: "/urunler/ovit-cicek-bali-1000gr" },
        { id: "500gr", label: "500 gr", price: "₺1.000", href: "/urunler/ovit-cicek-bali-500gr" },
      ],
      badge: "doğal",
      featured: true,
      price: "₺2.000",
      ratingSummary: 4.7,
      reviewCount: 0,
      recommendedProductIds: ["cicek-bali-980gr", "kackar-cicek-bali-1000gr"],
    },
    {
      id: "ovit-cicek-bali-500gr",
      slug: "ovit-cicek-bali-500gr",
      name: "Ovit Çiçek Balı 500 gr",
      category: "Bal Çeşitleri",
      shortDescription: "Ovit yaylası florasından gelen doğal çiçek balı.",
      longDescription: balDescription,
      images: ["/images/products/ovit-cicek-bali-500gr.jpg"],
      variants: [
        { id: "980gr", label: "980 gr", price: "₺2.000", href: "/urunler/ovit-cicek-bali-1000gr" },
        { id: "500gr", label: "500 gr", price: "₺1.000", href: "/urunler/ovit-cicek-bali-500gr" },
      ],
      badge: "doğal",
      featured: false,
      price: "₺1.000",
      ratingSummary: 4.7,
      reviewCount: 0,
      recommendedProductIds: ["cicek-bali-500gr", "kackar-cicek-bali-500gr"],
    },
  
    {
      id: "beyaz-bal-980gr",
      slug: "beyaz-bal-980gr",
      name: "Beyaz Bal 850 gr",
      category: "Bal Çeşitleri",
      shortDescription: "Narin doku ve hafif tat profiline sahip özel bal seçeneği.",
      longDescription: balDescription,
      images: ["/images/products/beyaz-bal-980gr.jpg"],
      variants: [
        { id: "850gr", label: "850 gr", price: "₺1.500", href: "/urunler/beyaz-bal-980gr" },
        { id: "400gr", label: "400 gr", price: "₺750", href: "/urunler/beyaz-bal-500gr" },
      ],
      featured: false,
      price: "₺1.500",
      ratingSummary: 4.6,
      reviewCount: 11,
      recommendedProductIds: ["cicek-bali-980gr"],
    },
    {
      id: "beyaz-bal-500gr",
      slug: "beyaz-bal-500gr",
      name: "Beyaz Bal 400 gr",
      category: "Bal Çeşitleri",
      shortDescription: "Narin doku ve hafif tat profiline sahip özel bal seçeneği.",
      longDescription: balDescription,
      images: ["/images/products/beyaz-bal-500gr.jpg"],
      variants: [
        { id: "850gr", label: "850 gr", price: "₺1.500", href: "/urunler/beyaz-bal-980gr" },
        { id: "400gr", label: "400 gr", price: "₺750", href: "/urunler/beyaz-bal-500gr" },
      ],
      featured: false,
      price: "₺750",
      ratingSummary: 4.6,
      reviewCount: 11,
      recommendedProductIds: ["cicek-bali-500gr"],
    },

  {
    id: "anzer-poleni-400gr",
    slug: "anzer-poleni-400gr",
    name: "Anzer Poleni 200 gr",
    category: "Polen Çeşitleri",
    shortDescription: "Seçkin kaynaklı, özenle hazırlanmış Anzer Poleni.",
    longDescription:
      "Anzer Yaylası'nın eşsiz doğasından özenle toplanan Azner Poleni, yüksek besin değeri ve doğallığyla günlük yaşamınıza güç katar",
    images: ["/images/products/anzer-poleni-400gr.jpg"],
    variants: [
      { id: "200gr", label: "200 gr", price: "₺1.500", href: "/urunler/anzer-poleni-400gr" },
      { id: "200gr", label: "200 gr", price: "₺750", href: "/urunler/anzer-poleni-200gr" },
    ],
    badge: "yöresel",
    featured: false,
    price: "₺1.500",
    ratingSummary: 4.7,
    reviewCount: 9,
    recommendedProductIds: ["anzer-bali-500gr"],
  },
  {
    id: "anzer-poleni-200gr",
    slug: "anzer-poleni-200gr",
    name: "Anzer Poleni 100 gr",
    category: "Polen Çeşitleri",
    shortDescription: "Seçkin kaynaklı, özenle hazırlanmış Anzer Poleni.",
    longDescription:
      "Anzer Yaylası'nın eşsiz doğasından özenle toplanan Azner Poleni, yüksek besin değeri ve doğallığyla günlük yaşamınıza güç katar",
    images: ["/images/products/anzer-poleni-200gr.jpg"],
    variants: [
      { id: "200gr", label: "200 gr", price: "₺1.500", href: "/urunler/anzer-poleni-400gr" },
      { id: "100gr", label: "100 gr", price: "₺750", href: "/urunler/anzer-poleni-200gr" },
    ],
    badge: "yöresel",
    featured: false,
    price: "₺750",
    ratingSummary: 4.7,
    reviewCount: 9,
    recommendedProductIds: ["anzer-bali-250gr"],
  },

  {
    id: "elek-alti-cay",
    slug: "elek-alti-cay",
    name: "Elek Altı Çay",
    category: "Çaylar",
    shortDescription: "Günlük dem için dengeli gövdede yöresel siyah çay.",
    longDescription:
      "Karadeniz’den seçilen yaprakların geleneksel yöntemlerle işlenmesiyle hazırlanan Elek Altı Çay, bal ürünleriyle uyumlu bir premium içim deneyimi sunar.",
    images: ["/images/products/elek-alti-cay.jpg"],
    variants: [{ id: "400gr", label: "400 gr", price: "₺265" }],
    badge: "doğal",
    featured: false,
    price: "₺265",
    ratingSummary: 4.8,
    reviewCount: 21,
    recommendedProductIds: ["anzer-bali-500gr", "cicek-bali-500gr"],
  },
  {
    id: "hediyelik-siyah-cay",
    slug: "hediyelik-siyah-cay",
    name: "Hediyelik Siyah Çay",
    category: "Çaylar",
    shortDescription: "Hediye sunumuna uygun premium siyah çay seçeneği.",
    longDescription:
      "Özel ambalajıyla öne çıkan Hediyelik Siyah Çay, güvenilir kaynak ve estetik sunumu bir arada isteyenler için hazırlanmıştır.",
    images: ["/images/products/hediyelik-siyah-cay.jpg"],
    variants: [{ id: "400gr", label: "400 gr", price: "₺245" }],
    featured: false,
    price: "₺245",
    ratingSummary: 4.6,
    reviewCount: 8,
    recommendedProductIds: ["kahvalti-paketi"],
  },

  {
    id: "yayla-tereyagi-1000gr",
    slug: "yayla-tereyagi-1000gr",
    name: "Yayla Tereyağı 1000 gr",
    category: "Tereyağı ve Peynirler",
    shortDescription: "Yüksek rakım yayla sütlerinden geleneksel üretilen tereyağı.",
    longDescription: sogukZincirDescription,
    images: ["/images/products/yayla-tereyagi-1000gr.jpg"],
    variants: [
      { id: "1000gr", label: "1000 gr", price: "₺750", href: "/urunler/yayla-tereyagi-1000gr" },
      { id: "500gr", label: "500 gr", price: "₺400", href: "/urunler/yayla-tereyagi-500gr" },
    ],
    storageType: "Soğuk zincir ürünü",
    badge: "yöresel",
    featured: false,
    price: "₺750",
    ratingSummary: 4.8,
    reviewCount: 17,
    recommendedProductIds: ["kolot-peyniri-1000gr", "mihlama-paketi"],
  },
  {
    id: "yayla-tereyagi-500gr",
    slug: "yayla-tereyagi-500gr",
    name: "Yayla Tereyağı 500 gr",
    category: "Tereyağı ve Peynirler",
    shortDescription: "Yüksek rakım yayla sütlerinden geleneksel üretilen tereyağı.",
    longDescription: sogukZincirDescription,
    images: ["/images/products/yayla-tereyagi-500gr.jpg"],
    variants: [
      { id: "1000gr", label: "1000 gr", price: "₺750", href: "/urunler/yayla-tereyagi-1000gr" },
      { id: "500gr", label: "500 gr", price: "₺400", href: "/urunler/yayla-tereyagi-500gr" },
    ],
    storageType: "Soğuk zincir ürünü",
    badge: "yöresel",
    featured: false,
    price: "₺400",
    ratingSummary: 4.8,
    reviewCount: 17,
    recommendedProductIds: ["kolot-peyniri-500gr", "mihlama-paketi"],
  },

  {
    id: "kolot-peyniri-1000gr",
    slug: "kolot-peyniri-1000gr",
    name: "Kolot Peyniri 1000 gr",
    category: "Tereyağı ve Peynirler",
    shortDescription: "Mıhlama ve kahvaltı sofraları için öne çıkan yöresel lezzet.",
    longDescription: sogukZincirDescription,
    images: ["/images/products/kolot-peyniri-1000gr.jpg"],
    variants: [
      { id: "1000gr", label: "1000 gr", price: "₺550", href: "/urunler/kolot-peyniri-1000gr" },
      { id: "500gr", label: "500 gr", price: "₺300", href: "/urunler/kolot-peyniri-500gr" },
    ],
    storageType: "Soğuk zincir ürünü",
    badge: "çok-satan",
    featured: true,
    price: "₺550",
    ratingSummary: 4.8,
    reviewCount: 24,
    recommendedProductIds: ["mihlama-paketi", "yayla-tereyagi-1000gr"],
  },
  {
    id: "kolot-peyniri-500gr",
    slug: "kolot-peyniri-500gr",
    name: "Kolot Peyniri 500 gr",
    category: "Tereyağı ve Peynirler",
    shortDescription: "Mıhlama ve kahvaltı sofraları için öne çıkan yöresel lezzet.",
    longDescription: sogukZincirDescription,
    images: ["/images/products/kolot-peyniri-500gr.jpg"],
    variants: [
      { id: "1000gr", label: "1000 gr", price: "₺550", href: "/urunler/kolot-peyniri-1000gr" },
      { id: "500gr", label: "500 gr", price: "₺300", href: "/urunler/kolot-peyniri-500gr" },
    ],
    storageType: "Soğuk zincir ürünü",
    badge: "çok-satan",
    featured: false,
    price: "₺300",
    ratingSummary: 4.8,
    reviewCount: 24,
    recommendedProductIds: ["mihlama-paketi", "yayla-tereyagi-500gr"],
  },

  {
    id: "dil-peyniri-1000gr",
    slug: "dil-peyniri-1000gr",
    name: "Dil Peyniri 1000 gr",
    category: "Tereyağı ve Peynirler",
    shortDescription: "El ile ayıklanabilir yöresel peynir.",
    longDescription: sogukZincirDescription,
    images: ["/images/products/dil-peyniri-1000gr.jpg"],
    variants: [
      { id: "1000gr", label: "1000 gr", price: "₺550", href: "/urunler/dil-peyniri-1000gr" },
      { id: "500gr", label: "500 gr", price: "₺300", href: "/urunler/dil-peyniri-500gr" },
    ],
    storageType: "Soğuk zincir ürünü",
    featured: false,
    price: "₺550",
    ratingSummary: 4.5,
    reviewCount: 7,
    recommendedProductIds: ["kolot-peyniri-1000gr"]
  },
  {
    id: "dil-peyniri-500gr",
    slug: "dil-peyniri-500gr",
    name: "Dil Peyniri 500 gr",
    category: "Tereyağı ve Peynirler",
    shortDescription: "El ile ayıklanabilir yöresel peynir.",
    longDescription: sogukZincirDescription,
    images: ["/images/products/dil-peyniri-500gr.jpg"],
    variants: [
      { id: "1000gr", label: "1000 gr", price: "₺550", href: "/urunler/dil-peyniri-1000gr" },
      { id: "500gr", label: "500 gr", price: "₺300", href: "/urunler/dil-peyniri-500gr" },
    ],
    storageType: "Soğuk zincir ürünü",
    featured: false,
    price: "₺300",
    ratingSummary: 4.5,
    reviewCount: 7,
    recommendedProductIds: ["kolot-peyniri-1000gr"]
  },


  {
    id: "misir-unu",
    slug: "misir-unu",
    name: "Mısır Unu",
    category: "Mısır Unu",
    shortDescription: "Lezzetli tarifler için taş değirmende öğütülmüş mısır unu.",
    longDescription:
      "Karadeniz mutfağının temel ürünlerinden Mısır Unu, özenli ve güvenli paketleme ile mutfaklara ulaştırılır.",
    images: ["/images/products/misir-unu.jpg"],
    variants: [{ id: "1000gr", label: "1000 gr", price: "₺75" }],
    badge: "yöresel",
    featured: false,
    price: "₺75",
    ratingSummary: 4.7,
    reviewCount: 13,
    recommendedProductIds: ["mihlama-paketi", "kolot-peyniri-1000gr"],
  },
  {
    id: "ispir-kuru-fasulye",
    slug: "ispir-kuru-fasulye",
    name: "İspir Kuru Fasulyesi",
    category: "Kuru Fasülye",
    shortDescription: "İspir’den gelen premium kuru fasülye.",
    longDescription:
      "Kalitesiyle bilinen İspir Kuru Fasülyesi, özenli ayıklama ve dikkatli paketleme süreciyle sunulur.",
    images: ["/images/products/ispir-kuru-fasulye.jpg"],
    variants: [{ id: "1000gr", label: "1000 gr", price: "₺250" }],
    badge: "premium",
    featured: false,
    price: "₺250",
    ratingSummary: 4.7,
    reviewCount: 12,
    recommendedProductIds: ["misir-unu"],
  },
 
  {
    id: "gurme-ispir-kuru-fasulye",
    slug: "gurme-ispir-kuru-fasulye",
    name: "Gurme İspir Kuru Fasulyesi 1000 gr",
    category: "Kuru Fasülye",
    shortDescription: "Seçkin kalite sınıfında, iri taneli gurme İspir kuru fasulyesi.",
    longDescription:
      "Gurme İspir Kuru Fasulyesi, özenle seçilmiş iri taneleri ve yüksek pişme kalitesiyle öne çıkar. Premium segmentte yer alan bu ürün, kontrollü ayıklama ve güvenli paketleme süreciyle sunulur.",
    images: ["/images/products/gurme-ispir-kuru-fasulye.jpg"],
    variants: [
      {
        id: "1000gr",
        label: "1000 gr",
        price: "₺350",
        href: "/urunler/gurme-ispir-kuru-fasulye",
      },
    ],
    badge: "premium",
    featured: true,
    price: "₺390",
    ratingSummary: 4.9,
    reviewCount: 0,
    recommendedProductIds: ["ispir-kuru-fasulye", "misir-unu"],
  },

  {
    id: "premium-kahvalti-paketi",
    slug: "premium-kahvalti-paketi",
    name: "Premium Kahvaltı Paketi",
    category: "Kahvaltı Paketleri",
    shortDescription: "Seçkin içeriklerden oluşan Premium Seri kahvaltı paketi.",
    longDescription:
      "Kahvaltı sofraları için hazırlanan bu Premium Paket; çay, peynir, tereyağı ve yayla balı kombinasyonunu dengeli bir yapıyla bir araya getirir.",
    images: ["/images/products/premium-kahvalti-paketi.jpg"],
    variants: [{ id: "tek-paket", label: "Tek Paket", price: "₺3.565" }],
    packageContents: [
      "Elek Altı Çay 400 gr",
      "Kolot Peyniri 1000 gr",
      "Yayla Tereyağı 1000 gr",
      "Ovit Çiçek Balı 1000gr",
    ],
    badge: "premium",
    featured: true,
    price: "₺3.565",
    compareAtPrice: "₺4.565",
    ratingSummary: 4.9,
    reviewCount: 22,
    recommendedProductIds: ["anzer-bali-500gr", "kahvalti-paketi"],
  },
  {
    id: "kahvalti-paketi",
    slug: "kahvalti-paketi",
    name: "Tanışma Paketi",
    category: "Kahvaltı Paketleri",
    shortDescription: "Anzerana Tanışma Paketi, doğanın en saf ve özenle seçilmiş ürünlerini bir araya getirir. Kaliteyi ve gerçek lezzeti keşfetmek için ideal bir başlangıçtır.",
    longDescription:
      "Günlük kullanım için ideal içerik dengesine sahip Tanışma Paketi, yöresel ürün çeşitliliğini pratik bir formatta sunar.",
    images: ["/images/products/kahvalti-paketi.jpg"],
    variants: [{ id: "tek-paket", label: "Tek Paket", price: "₺1.945" }],
    packageContents: [
      "Elek Altı Çay 400 gr",
      "Kolot Peyniri 500 gr",
      "Yayla Tereyağı 500 gr",
      "Gurme İspir Kuru Fasulyesi 1000 gr",
      "Ovit Çiçek Balı 500gr",
    ],
    badge: "çok-satan",
    featured: true,
    price: "₺1.945",
    ratingSummary: 4.8,
    reviewCount: 17,
    recommendedProductIds: ["premium-kahvalti-paketi"],
  },
  {
    id: "mihlama-paketi",
    slug: "mihlama-paketi",
    name: "Mıhlama Paketi",
    category: "Mıhlama Paketi",
    shortDescription: "Karadeniz mutfağına özel mıhlama için hazır paket.",
    longDescription:
      "Mıhlama için temel ürünleri bir araya getiren bu paket, yöresel lezzeti pratik ve güven odaklı bir yapıyla sunar.",
    images: ["/images/products/mihlama-paketi.jpg"],
    variants: [{ id: "tek-paket", label: "Tek Paket", price: "₺1.375" }],
    packageContents: ["Yayla Tereyağı 1000 gr", "Kolot Peyniri 1000 gr", "Mısır Unu 1000 gr"],
    badge: "yöresel",
    featured: true,
    price: "₺1.990",
    ratingSummary: 4.8,
    reviewCount: 15,
    recommendedProductIds: ["kolot-peyniri-1000gr", "misir-unu", "yayla-tereyagi-1000gr"],
  },
];

export const categories = [
  "Anzer Balı",
  "Bal Çeşitleri",
  "Polen Çeşitleri",
  "Çaylar",
  "Tereyağı ve Peynirler",
  "Mısır Unu",
  "Kuru Fasülye",
  "Kahvaltı Paketleri",
  "Mıhlama Paketi",
];

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getProductBySlug(slug: string) {
  const slugMap: Record<string, string> = {
    "anzer-bali": "anzer-bali-980gr",
    "kestane-bali": "kestane-bali-980gr",
    "cicek-bali": "cicek-bali-980gr",
    "yayla-cicek-bali": "kackar-cicek-bali-1000gr",
    "yayla-cicek-bali-980gr": "kackar-cicek-bali-1000gr",
    "yayla-cicek-bali-500gr": "kackar-cicek-bali-500gr",
    "kolot-peyniri": "kolot-peyniri-1000gr",
    "yayla-tereyagi": "yayla-tereyagi-1000gr",
  };

  const resolvedSlug = slugMap[slug] ?? slug;

  return products.find((product) => product.slug === resolvedSlug);
}