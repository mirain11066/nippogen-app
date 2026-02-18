import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NippoGen — AI日報ジェネレーター",
  description:
    "箇条書きを貼るだけ。10秒でプロの日報が完成。AIが日報・週報・報告書を自動生成。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
