"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="text-2xl font-bold text-brand-700">NippoGen</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">レポート履歴は今後のアップデートで追加予定です。</p>
          <Link href="/" className="inline-block mt-6 bg-brand-600 text-white font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
            日報を作成する
          </Link>
        </div>
      </main>
    </div>
  );
}
