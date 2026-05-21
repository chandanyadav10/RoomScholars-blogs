import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "RoomScholars — Student Housing Blog",
    template: "%s | RoomScholars",
  },
  description:
    "Discover premium student housing guides, living tips, and accommodation insights from cities worldwide.",
  keywords: ["student housing", "accommodation", "student blog", "international students"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  openGraph: {
    type: "website",
    siteName: "RoomScholars",
    title: "RoomScholars — Student Housing Blog",
    description: "Premium student housing guides, living tips, and insights worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomScholars — Student Housing Blog",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // FIX: lang="en" is the best we can do in a root layout (server component can't
    // read search params). Language switching is handled per-page via ?lang=zh.
    // For full hreflang support, individual pages could export their own lang via
    // generateMetadata — noted in README.
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
