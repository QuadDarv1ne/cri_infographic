import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CRI и Цветовая температура — Интерактивная инфографика",
  description: "Интерактивная инфографика об индексе цветопередачи (CRI) и цветовой температуре света. Визуализации, сравнения источников и квиз.",
  keywords: ["CRI", "индекс цветопередачи", "цветовая температура", "освещение", "инфографика", "ГОСТ 54350-2015"],
  authors: [{ name: "Дуплей Максим Игоревич" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "CRI и Цветовая температура — Интерактивная инфографика",
    description: "Интерактивная инфографика об индексе цветопередачи и цветовой температуре",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRI и Цветовая температура — Интерактивная инфографика",
    description: "Интерактивная инфографика об индексе цветопередачи и цветовой температуре",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
