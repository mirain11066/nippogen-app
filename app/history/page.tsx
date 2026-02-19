"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ReportRecord {
  id: string;
  created_at: string;
  template: string;
  tone: string;
  tokens_input: number;
  tokens_output: number;
}

export default function HistoryPage() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const router = useRouter();

  useEffect(() => {
    const loadHistory = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        router.push("/login");
        return;
      }

      // プラン確認
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("plan")
        .eq("email", session.user.email)
        .single();

      if (profile) setPlan(profile.plan);

      // 履歴取得
      const { data, error } = await supabase
        .from("report_history")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) setReports(data);
      if (error) console.error("Failed to load history:", error);

      setLoading(false);
    };

    loadHistory();
  }, [router]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-700">NippoGen</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              AI日報
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              日報生成
            </Link>
            <span className="text-sm font-bold text-blue-600">履歴</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">日報履歴</h1>
            <p className="text-gray-500 mt-1">過去に生成した日報の一覧</p>
          </div>
          {plan === "free" && (
            <Link
              href="/pricing"
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pro で履歴保存を有効化
            </Link>
          )}
        </div>

        {plan === "free" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Pro プランで履歴機能が使えます
            </h2>
            <p className="text-gray-500 mb-6">
              Pro にアップグレードすると、過去に生成した日報を保存・再利用できます。
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Pro にアップグレード（¥980/月）
            </Link>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              まだ履歴がありません
            </h2>
            <p className="text-gray-500 mb-6">
              日報を生成すると、ここに履歴が表示されます。
            </p>
            <Link
              href="/#generate"
              className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              日報を生成する
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-bold text-sm">
                      📄
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {formatDate(report.created_at)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        テンプレート: {report.template || "標準"} ・ 文体:{" "}
                        {report.tone || "です・ます"}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {report.tokens_input ?? 0} → {report.tokens_output ?? 0} tokens
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
