"use client";

import { useState, useCallback } from "react";
import type {
  ReportTemplate,
  ReportTone,
  GenerateReportResponse,
} from "@/lib/types";
import { TEMPLATE_LABELS, TONE_LABELS } from "@/lib/constants";

interface ReportFormProps {
  onReportGenerated: (response: GenerateReportResponse) => void;
  disabled: boolean;
  remainingReports: number;
}

export default function ReportForm({
  onReportGenerated,
  disabled,
  remainingReports,
}: ReportFormProps) {
  const [bullets, setBullets] = useState("");
  const [template, setTemplate] = useState<ReportTemplate>("daily");
  const [tone, setTone] = useState<ReportTone>("standard");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!bullets.trim()) {
      setError("箇条書きを入力してください。");
      return;
    }
    if (bullets.trim().length < 10) {
      setError("もう少し詳しく入力してください（10文字以上）。");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {      // Get access token
      const { createBrowserClient } = await import("@supabase/ssr");
      const sb = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { session } } = await sb.auth.getSession();
      const accessToken = session?.access_token || null;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bullets, template, tone, accessToken }),
        signal: AbortSignal.timeout(60_000),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const data: GenerateReportResponse = await response.json();
      onReportGenerated(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.name === "TimeoutError"
            ? "タイムアウトしました。もう一度お試しください。"
            : err.message
        );
      } else {
        setError("予期しないエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  }, [bullets, template, tone, onReportGenerated]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">業務メモを入力</h2>
        <p className="text-sm text-gray-500">
          箇条書き・キーワード・メモ書きでOK。AIが日報に仕上げます。
        </p>
      </div>

      <textarea
        value={bullets}
        onChange={(e) => setBullets(e.target.value)}
        placeholder={"例：\n・クライアントA社とミーティング実施\n・新機能の設計書レビュー完了\n・バグ修正3件\n・来週のリリースに向けてQA開始"}
        className="w-full h-48 sm:h-56 p-4 border border-gray-300 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-gray-400"
        disabled={disabled || isLoading}
      />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">テンプレート</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as ReportTemplate)}
            className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            disabled={disabled || isLoading}
          >
            {Object.entries(TEMPLATE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">文体トーン</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as ReportTone)}
            className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            disabled={disabled || isLoading}
          >
            {Object.entries(TONE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={disabled || isLoading || !bullets.trim()}
        className="mt-6 w-full bg-brand-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            生成中...
          </span>
        ) : disabled ? (
          "今月の無料枠を使い切りました"
        ) : (
          `日報を生成する（残り${remainingReports}件）`
        )}
      </button>
    </div>
  );
}
