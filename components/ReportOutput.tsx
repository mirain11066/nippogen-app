"use client";

import { useState } from "react";
import ShareButton from "./ShareButton";

interface ReportOutputProps {
  report: string;
  template?: string;
}

export default function ReportOutput({ report, template = "daily" }: ReportOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = report;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nippo_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!report) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">生成された日報</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {copied ? "コピー済み!" : "コピー"}
          </button>
          <button
            onClick={handleDownloadTxt}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            .txt保存
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-5 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap border border-gray-100">
        {report}
      </div>

      {/* SNS共有ボタン */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-3">この日報を共有する</p>
        <ShareButton report={report} template={template} />
      </div>
    </div>
  );
}
