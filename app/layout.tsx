import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
