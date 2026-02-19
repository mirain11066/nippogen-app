"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Logo from "@/components/Logo";
import Mascot from "@/components/Mascot";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-[10%] w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-[50%] left-[50%] w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl animate-float-slow" />
      </div>

      <div className="relative py-16 px-4">
        {/* ヘッダー */}
        <div className="text-center mb-4">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">シンプルな料金プラン</h1>
          <p className="text-lg text-gray-600">まずは無料で試して、気に入ったらアップグレード</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">🆓</div>
              <h2 className="text-2xl font-bold text-gray-900">Free</h2>
            </div>
            <p className="text-gray-500 mb-6">まずは無料で試す</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-gray-900">¥0</span>
              <span className="text-gray-400 ml-1">/月</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
                月5件まで日報生成
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
                3種類のテンプレート
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
                3種類の文体選択
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
                コピー＆テキスト保存
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
                SNS共有
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs">✕</span>
                PDF出力
              </li>
            </ul>
            <Link href="/" className="block w-full text-center bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition-colors">
              無料で始める
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-purple-400 p-8 hover:shadow-xl transition-shadow">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-md">
              おすすめ
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg">⚡</div>
              <h2 className="text-2xl font-bold text-gray-900">Pro</h2>
            </div>
            <p className="text-gray-500 mb-6">本格的に使いたい方に</p>
            <div className="mb-2">
              <span className="text-5xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">¥980</span>
              <span className="text-gray-400 ml-1">/月</span>
            </div>
            <p className="text-xs text-gray-400 mb-8">1日あたりわずか約33円</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">✓</span>
                <strong>月100件</strong>まで日報生成
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">✓</span>
                3種類のテンプレート
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">✓</span>
                3種類の文体選択
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">✓</span>
                コピー＆テキスト保存
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">✓</span>
                SNS共有
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-purple-700">
                <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">✓</span>
                PDF出力
              </li>
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="block w-full text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
            >
              {loading ? "処理中..." : "Pro にアップグレード"}
            </button>
          </div>
        </div>

        {/* マスコット */}
        <div className="flex justify-center mb-16">
          <Mascot size="sm" expression="wink" message="まずは無料で試してね！" />
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">よくある質問</h2>
          <div className="space-y-4">
            <details className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                無料プランに制限はありますか？
                <span className="text-purple-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">月5件まで日報を生成できます。テンプレートや文体選択など、基本機能はすべてご利用いただけます。PDF出力のみ Pro プラン限定です。</p>
            </details>
            <details className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                いつでも解約できますか？
                <span className="text-purple-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">はい、いつでも解約できます。解約後も、現在の請求期間の終了まで Pro 機能をご利用いただけます。アカウント設定ページから簡単に手続きできます。</p>
            </details>
            <details className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                どんな支払い方法に対応していますか？
                <span className="text-purple-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">クレジットカード（Visa、Mastercard、American Express、JCB）に対応しています。決済は Stripe を通じて安全に処理されます。</p>
            </details>
            <details className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                入力したデータは安全ですか？
                <span className="text-purple-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">はい。入力データは日報生成のためにのみ使用され、第三者に提供されることはありません。詳しくはプライバシーポリシーをご確認ください。</p>
            </details>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-16">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
