import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./shop.css";
import ShopLayout from "../components/ShopLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memento Mori — Umbra Aesthetica",
  description: "Where shadows take form. Gothic, metal & steampunk collections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800;900&family=Crimson+Text:wght@400;600;700&family=IM+Fell+DW+Pica:ital@0;1&family=Pirata+One&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ShopLayout>{children}</ShopLayout>
      </body>
    </html>
  );
}
