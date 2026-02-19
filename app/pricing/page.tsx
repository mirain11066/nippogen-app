"use client";

import Link from "next/link";

export default function PricingPage() {
  const handleSubscribe = async () => {
    try {
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">料金プラン</h1>
        <p className="text-lg text-gray-600">あなたに合ったプランを選んでください</p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
          <p className="text-gray-500 mb-6">まずは無料で試す</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">¥0</span>
            <span className="text-gray-500">/月</span>
          </div>
          <ul className="space-y-3 mb-8 text-sm text-gray-700">
            <li className="flex items-center gap-2">✅ 月5件まで日報生成</li>
            <li className="flex items-center gap-2">✅ 3種類のテンプレート</li>
            <li className="flex items-center gap-2">✅ トーン選択</li>
            <li className="flex items-center gap-2">✅ コピー＆ダウンロード</li>
          </ul>
          <Link href="/" className="block w-full text-center bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors">
            現在のプラン
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-500 p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
            おすすめ
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro</h2>
          <p className="text-gray-500 mb-6">本格的に使いたい方に</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">¥980</span>
            <span className="text-gray-500">/月</span>
          </div>
          <ul className="space-y-3 mb-8 text-sm text-gray-700">
            <li className="flex items-center gap-2">✅ 月100件まで日報生成</li>
            <li className="flex items-center gap-2">✅ 3種類のテンプレート</li>
            <li className="flex items-center gap-2">✅ トーン選択</li>
            <li className="flex items-center gap-2">✅ コピー＆ダウンロード</li>
            <li className="flex items-center gap-2">✅ PDF出力</li>
          </ul>
          <button onClick={handleSubscribe} className="block w-full text-center bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Pro にアップグレード
          </button>
        </div>
      </div>
    </div>
  );
}
