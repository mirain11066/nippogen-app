"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ReportForm from "@/components/ReportForm";
import ReportOutput from "@/components/ReportOutput";
import UsageBadge from "@/components/UsageBadge";
import { createBrowserClient } from "@supabase/ssr";
import {
  FREE_TIER_MONTHLY_LIMIT,
  PRO_TIER_MONTHLY_LIMIT,
} from "@/lib/constants";
import type { GenerateReportResponse, UserPlan } from "@/lib/types";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const [report, setReport] = useState("");
  const [plan, setPlan] = useState<UserPlan>("free");
  const [reportsUsed, setReportsUsed] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          setIsLoggedIn(!!session.user.email);
          await loadUserData(session.user.id);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm">AI が日報を自動生成</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              箇条書きを貼るだけ。
              <br />
              <span className="text-blue-200">10秒でプロの日報が完成。</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              業務メモ・キーワードをペーストするだけで、AIが敬語も構成も整えた日報を自動生成。もう日報に30分かける必要はありません。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoggedIn ? (
                <a
                  href="#generate"
                  className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  日報を生成する
                </a>
              ) : (
                <Link
                  href="/login"
                  className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  無料で始める
                </Link>
              )}
              <a
                href="#features"
                className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors"
              >
                機能を見る
              </a>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              クレジットカード不要 ・ 月5件まで無料 ・ 30秒で登録完了
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-gray-900">10秒</div>
              <div className="text-sm text-gray-500 mt-1">平均生成時間</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900">95%</div>
              <div className="text-sm text-gray-500 mt-1">時間削減率</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900">¥980</div>
              <div className="text-sm text-gray-500 mt-1">月額（税込）</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              なぜ NippoGen？
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              日報作成の面倒を AI が解決。チーム全員の生産性を向上させます。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-5">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">10秒で完成</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                箇条書きのメモを貼り付けるだけ。AIが文体・構成・敬語を整えて、すぐに使える日報を生成します。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-5">
                🎯
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">テンプレート対応</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                標準・エンジニア・営業など、職種に合わせたテンプレートで、最適なフォーマットの日報を出力します。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-5">
                📋
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">コピペで共有</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                生成された日報はワンクリックでコピー。Slack・メール・社内システムにそのまま貼り付けられます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Before → After
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="text-red-600 font-bold text-sm mb-4">❌ Before（従来の日報作成）</div>
              <div className="bg-white rounded-lg p-4 text-sm text-gray-600 font-mono leading-relaxed">
                ・MTGの内容を思い出す（5分）<br/>
                ・文章を考える（10分）<br/>
                ・敬語を直す（5分）<br/>
                ・フォーマットを整える（5分）<br/>
                ・上司に送信（5分）<br/>
                <div className="mt-3 text-red-600 font-bold">合計：約30分</div>
              </div>
            </div>
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <div className="text-green-600 font-bold text-sm mb-4">✅ After（NippoGen）</div>
              <div className="bg-white rounded-lg p-4 text-sm text-gray-600 font-mono leading-relaxed">
                ・箇条書きメモを貼り付け（3秒）<br/>
                ・「生成する」をクリック（1秒）<br/>
                ・AI が日報を自動生成（6秒）<br/>
                ・コピーして送信（5秒）<br/>
                <br/>
                <div className="mt-3 text-green-600 font-bold">合計：約15秒</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generate" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              今すぐ試す
            </h2>
            <p className="text-gray-500">
              {isLoggedIn
                ? "箇条書きを入力して日報を生成してください"
                : "ログインすると日報を生成できます"}
            </p>
          </div>

          {isLoggedIn ? (
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
              </div>
            </div>
          ) : (
            <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ログインして日報を生成
              </h3>
              <p className="text-gray-500 mb-6">
                無料アカウントで月5件まで生成できます
              </p>
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                無料で始める
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              料金プラン
            </h2>
            <p className="text-gray-500">
              まずは無料で試して、気に入ったら Pro へ
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">¥0</span>
                <span className="text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 月5件まで生成
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> 基本テンプレート
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> コピー機能
                </li>
              </ul>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="block text-center w-full py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                >
                  無料で始める
                </Link>
              )}
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                おすすめ
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">¥980</span>
                <span className="text-gray-500">/月</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> 月100件まで生成
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> 全テンプレート
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> 優先サポート
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span> 履歴保存
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block text-center w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Pro にアップグレード
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              よくある質問
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "本当に10秒で日報が完成しますか？",
                a: "はい。箇条書きのメモを貼り付けてボタンを押すだけで、AIが数秒で日報を生成します。手直しが必要な場合も、ゼロから書くより大幅に時間を短縮できます。",
              },
              {
                q: "無料プランの制限は？",
                a: "月5件まで日報を生成できます。機能制限はありません。まずは無料で試していただき、必要に応じて Pro プランへアップグレードしてください。",
              },
              {
                q: "生成された日報の品質は？",
                a: "最新の AI モデル（Claude）を使用しており、ビジネス文書として十分な品質の日報を生成します。敬語・構成・フォーマットを自動で整えます。",
              },
              {
                q: "データのセキュリティは？",
                a: "入力データはSSL暗号化通信で送信され、日報生成後にAIサーバーからは即座に削除されます。生成された日報のみがお客様のアカウントに保存されます。",
              },
              {
                q: "解約はいつでもできますか？",
                a: "はい。Pro プランはいつでも解約可能で、解約後も当月末まで利用できます。解約手数料は一切かかりません。",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            今日から日報の時間を取り戻そう
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            30秒で登録完了。クレジットカード不要。
          </p>
          <Link
            href={isLoggedIn ? "#generate" : "/login"}
            className="inline-block bg-white text-blue-700 font-bold px-10 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            {isLoggedIn ? "日報を生成する" : "無料で始める"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">NippoGen</span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                AI日報
              </span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/pricing" className="hover:text-white transition-colors">
                料金
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                ログイン
              </Link>
            </div>
            <div className="text-xs">
              &copy; 2026 NippoGen. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
