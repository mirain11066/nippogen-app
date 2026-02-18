"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="text-2xl font-bold text-brand-700">NippoGen</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            シンプルな料金プラン
          </h1>
          <p className="text-gray-500">まずは無料で試して、気に入ったらProへ。</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Free</h2>
            <p className="text-sm text-gray-500 mb-6">まずはお試し</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-gray-900">¥0</span>
              <span className="text-sm text-gray-400 ml-1">/ 月</span>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              <li>&#10003; 月5件まで日報生成</li>
              <li>&#10003; 日報テンプレート（1種類）</li>
              <li>&#10003; スタンダード文体</li>
              <li>&#10003; クリップボードコピー</li>
              <li className="text-gray-400">&#10007; 履歴閲覧</li>
            </ul>
            <Link href="/" className="block text-center w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
              無料で始める
            </Link>
          </div>

          <div className="bg-white rounded-2xl border-2 border-brand-600 p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              おすすめ
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Pro</h2>
            <p className="text-sm text-gray-500 mb-6">毎日使う方に</p>
            <div className="mb-2">
              <span className="text-4xl font-extrabold text-gray-900">¥980</span>
              <span className="text-sm text-gray-400 ml-1">/ 月</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">年払い ¥9,800（16%お得）</p>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              <li>&#10003; 月100件まで日報生成</li>
              <li>&#10003; 全テンプレート（3種類）</li>
              <li>&#10003; 全文体トーン（3種類）</li>
              <li>&#10003; TXT / Markdown ダウンロード</li>
              <li>&#10003; 過去30日の履歴閲覧</li>
            </ul>
            <button className="block text-center w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 transition-colors text-sm">
              Pro にアップグレード
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
