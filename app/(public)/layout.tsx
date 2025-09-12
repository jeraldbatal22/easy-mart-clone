import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Easy Mart - Fresh Groceries & Best Sellers | Online Grocery Store",
  description: "Shop fresh groceries, best sellers, and quality products at Easy Mart. Fast delivery, competitive prices, and verified products. Browse our extensive collection of fresh bakery, dairy, meat, vegetables, and fruits.",
  keywords: [
    "grocery store",
    "online shopping",
    "fresh groceries",
    "best sellers",
    "bakery",
    "dairy",
    "meat",
    "vegetables",
    "fruits",
    "easy mart",
    "online grocery delivery",
    "fresh food",
    "quality products"
  ],
  authors: [{ name: "Easy Mart" }],
  creator: "Easy Mart",
  publisher: "Easy Mart",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Easy Mart - Fresh Groceries & Best Sellers",
    description: "Shop fresh groceries, best sellers, and quality products at Easy Mart. Fast delivery, competitive prices, and verified products.",
    url: '/',
    siteName: 'Easy Mart',
    images: [
      {
        url: '/assets/images/home/frame-1.png',
        width: 1200,
        height: 630,
        alt: 'Easy Mart - Fresh Groceries & Best Sellers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Easy Mart - Fresh Groceries & Best Sellers",
    description: "Shop fresh groceries, best sellers, and quality products at Easy Mart. Fast delivery, competitive prices, and verified products.",
    images: ['/assets/images/home/frame-1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
