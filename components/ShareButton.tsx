"use client";

import { useState } from "react";

interface ShareButtonProps {
  report: string;
  template: string;
}

export default function ShareButton({ report, template }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareText = report.length > 200
    ? report.slice(0, 200) + "…"
    : report;

  const hashtags = "NippoGen,AI日報,業務効率化";
  const url = "https://nippogen-app.vercel.app";

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `【AI日報生成】NippoGenで${template === "daily" ? "日報" : template === "weekly" ? "週報" : "クライアント報告書"}を自動作成しました！\n\n${shareText}\n\n`
  )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("コピーに失敗しました");
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X (Twitter) で共有
      </a>

      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
      >
        {copied ? "✅ コピーしました！" : "📋 日報をコピー"}
      </button>

      <a
        href={`https://line.me/R/share?text=${encodeURIComponent(
          `NippoGenでAI日報を作成しました！\n\n${shareText}\n\n${url}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-green-600 transition-colors"
      >
        LINE で共有
      </a>
    </div>
  );
}
