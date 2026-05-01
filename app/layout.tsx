import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FloatingNav } from "./components/FloatingNav";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LenisRoot } from "./components/LenisRoot";
import { ThemeProvider } from "./components/ThemeProvider";
import { siteConfig } from "./site.config";
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

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.bio.en,
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh bg-zinc-50 font-sans text-base font-extralight text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <ThemeProvider>
          <LanguageProvider>
            <FloatingNav />
            <LenisRoot>{children}</LenisRoot>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
