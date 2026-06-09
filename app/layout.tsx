import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { FloatingNav } from "./components/FloatingNav";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LenisRoot } from "./components/LenisRoot";
import { ThemeProvider } from "./components/ThemeProvider";
import { siteConfig } from "./site.config";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const comico = localFont({
  src: "./fonts/Comico-Regular.woff2",
  variable: "--font-comico",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["cursive"],
});

const siteTitle = `${siteConfig.fullName} - ${siteConfig.role}`;
const siteDescription = siteConfig.bio.en;
const siteUrl = new URL(siteConfig.siteUrl);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: `%s | ${siteConfig.fullName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: siteConfig.fullName,
    locale: "en_US",
    alternateLocale: ["it_IT"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.fullName,
  url: siteConfig.siteUrl,
  jobTitle: siteConfig.role,
  email: siteConfig.contact.email.href,
  sameAs: siteConfig.contact.social.map((link) => link.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${comico.variable} antialiased`}
    >
      <body className="min-h-dvh bg-zinc-50 font-sans text-base font-extralight text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <ThemeProvider>
          <LanguageProvider>
            <FloatingNav />
            <LenisRoot>{children}</LenisRoot>
          </LanguageProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
