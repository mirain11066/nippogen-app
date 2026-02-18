"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import ReportForm from "@/components/ReportForm";
import ReportOutput from "@/components/ReportOutput";
import UsageBadge from "@/components/UsageBadge";
import { supabase } from "@/lib/supabase";
import {
  FREE_TIER_MONTHLY_LIMIT,
  PRO_TIER_MONTHLY_LIMIT,
} from "@/lib/constants";
import type { GenerateReportResponse, UserPlan } from "@/lib/types";

export default function HomePage() {
  const [report, setReport] = useState("");
  const [plan, setPlan] = useState<UserPlan>("free");
  const [reportsUsed, setReportsUsed] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reportsLimit =
    plan === "pro" ? PRO_TIER_MONTHLY_LIMIT : FREE_TIER_MONTHLY_LIMIT;
  const remainingReports = Math.max(reportsLimit - reportsUsed, 0);
  const isAtLimit = reportsUsed >= reportsLimit;

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUserId(session.user.id);
          await loadUserData(session.user.id);
        } else {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Anonymous sign-in failed:", error.message);
          } else if (data.user) {
            setUserId(data.user.id);
            await loadUserData(data.user.id);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("plan, subscription_status")
        .eq("id", uid)
        .single();

      if (profile) {
        setPlan(profile.plan as UserPlan);
      }

      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { count } = await supabase
        .from("usage_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", uid)
        .gte("created_at", firstOfMonth.toISOString());

      setReportsUsed(count ?? 0);
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  };

  const handleReportGenerated = useCallback(
    (response: GenerateReportResponse) => {
      setReport(response.report);
      setReportsUsed((prev) => prev + 1);
    },
    []
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        plan={plan}
        reportsUsed={reportsUsed}
        reportsLimit={reportsLimit}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            箇条書きを貼るだけ。
            <br className="sm:hidden" />
            <span className="text-brand-600">10秒でプロの日報が完成。</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            業務メモ・キーワードをペーストするだけで、AIが敬語も構成も整えた日報を自動生成します。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ReportForm
              onReportGenerated={handleReportGenerated}
              disabled={isAtLimit}
              remainingReports={remainingReports}
            />
            {report && <ReportOutput report={report} />}
          </div>

          <div className="space-y-6">
            <UsageBadge used={reportsUsed} limit={reportsLimit} plan={plan} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                使い方
              </h3>
              <ol className="space-y-3 text-xs text-gray-600">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                    1
                  </span>
                  <span>業務メモを箇条書きで入力</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                  <span>テンプレートと文体を選択</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                    3
                  </span>
                  <span>「日報を生成する」ボタンをクリック</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                    4
                  </span>
                  <span>コピーしてSlack・メール・社内システムに貼り付け</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8 text-center text-xs text-gray-400">
        &copy; 2026 NippoGen. All rights reserved.
      </footer>
    </div>
  );
}
