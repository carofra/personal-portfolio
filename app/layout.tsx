import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LenisRoot } from "./components/LenisRoot";
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
  description: "Portfolio – Carolina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-[#F9F9F9] font-sans text-base font-extralight text-[#111]">
        <LenisRoot>{children}</LenisRoot>
      </body>
    </html>
  );
}
