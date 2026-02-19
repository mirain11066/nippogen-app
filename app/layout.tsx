import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://nippogen-app.vercel.app";
const siteName = "NippoGen";
const title = "NippoGen — AI日報ジェネレーター | 10秒で日報完成";
const description =
  "箇条書きを貼るだけで、AIがプロの日報・週報・報告書を自動生成。無料プランあり。日本語・英語・中国語・韓国語・スペイン語・フランス語に対応。";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | NippoGen",
  },
  description,
  metadataBase: new URL(siteUrl),
  keywords: [
    "AI日報",
    "日報自動生成",
    "日報ジェネレーター",
    "AI報告書",
    "週報自動作成",
    "業務効率化",
    "NippoGen",
    "AI report generator",
    "daily report AI",
  ],
  authors: [{ name: "NippoGen" }],
  creator: "NippoGen",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName,
    title,
    description,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "NippoGen — AI日報ジェネレーター",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
