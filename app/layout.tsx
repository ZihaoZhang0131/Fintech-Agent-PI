import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "知衡 · 本地投研 Agent",
  description: "基于 PI Agent Core 与 DeepSeek 的本地投研对话工作台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${outfit.variable} ${geistMono.variable}`} lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
