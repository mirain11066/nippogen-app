"use client";

import { useState } from "react";

const SAMPLE_REPORTS = {
  daily: {
    label: "日報",
    icon: "📋",
    input: "・顧客Aとオンライン会議、新機能の要件ヒアリング\n・LP改修のデザイン確認、修正依頼\n・チームMTGで進捗共有\n・問い合わせ対応3件",
    output: `■ 本日の業務報告

【実施事項】
1. 顧客A様とのオンライン会議を実施いたしました。新機能に関する要件のヒアリングを行い、先方のご要望を整理いたしました。次回打ち合わせまでに要件定義書を作成する予定です。

2. ランディングページ改修について、デザインチームとの確認ミーティングを行いました。いくつかの修正箇所を特定し、デザイナーへ修正を依頼いたしました。

3. チーム定例ミーティングにて、現在の進捗状況を共有いたしました。各メンバーのタスク状況を確認し、今週の優先事項を確認しました。

4. お客様からのお問い合わせ3件に対応いたしました。いずれも当日中に回答を完了しております。

【明日の予定】
・顧客A様の要件定義書ドラフト作成
・LP改修デザインの最終確認
・新規案件の見積もり作成`,
  },
  weekly: {
    label: "週報",
    icon: "📊",
    input: "・新規顧客3社とミーティング\n・プロダクトv2.1リリース\n・採用面接2件実施\n・売上目標の95%達成\n・来週は展示会準備",
    output: `■ 週次報告書（2026年2月第3週）

【今週の成果】
1. 新規顧客開拓：3社とのミーティングを実施し、うち2社から前向きな回答をいただいております。来週中に提案書を提出する予定です。

2. プロダクト開発：v2.1のリリースを完了いたしました。主要な機能改善とバグ修正を含む今回のリリースは、ユーザーから好評をいただいております。

3. 採用活動：エンジニア候補者2名との面接を実施しました。1名は二次面接に進む予定です。

4. 売上実績：今週の売上は目標の95%を達成しました。月末に向けて残りの案件をクロージングする計画です。

【来週の計画】
・展示会（2/26-27）の準備・資料作成
・新規2社への提案書提出
・v2.2の開発スプリント開始`,
  },
  client: {
    label: "クライアント報告書",
    icon: "💼",
    input: "・Webサイトリニューアルの進捗70%\n・デザイン確定、コーディング中\n・SEO対策の初期設定完了\n・来週にテスト環境公開予定",
    output: `■ プロジェクト進捗報告書

【プロジェクト名】Webサイトリニューアル
【報告日】2026年2月19日
【全体進捗】70%（予定通り）

【今週の進捗】
1. デザイン工程が完了し、お客様にご確認いただきました全ページのデザインが確定いたしました。

2. フロントエンドのコーディングを進めております。トップページおよび主要な下層ページのコーディングが完了し、残りのページについても今週中に完了する見込みです。

3. SEO対策の初期設定（メタタグ、サイトマップ、構造化データ）を完了いたしました。

【来週の予定】
・テスト環境の公開（お客様確認用URLをお送りいたします）
・レスポンシブデザインの最終調整
・お問い合わせフォームの動作テスト

【ご確認事項】
テスト環境公開後、1週間程度のご確認期間を設けさせていただきたく存じます。ご都合をお聞かせください。`,
  },
};

export default function TemplatePreview() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "client">("daily");
  const [showOutput, setShowOutput] = useState(false);

  const current = SAMPLE_REPORTS[activeTab];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* タブ */}
      <div className="flex border-b border-gray-200">
        {(Object.keys(SAMPLE_REPORTS) as Array<keyof typeof SAMPLE_REPORTS>).map((key) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setShowOutput(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-purple-50 text-purple-700 border-b-2 border-purple-500"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{SAMPLE_REPORTS[key].icon}</span>
            <span>{SAMPLE_REPORTS[key].label}</span>
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* 入力例 */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">入力メモ（例）</h4>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
            {current.input}
          </div>
        </div>

        {/* 変換ボタン */}
        <div className="flex justify-center my-4">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all hover:shadow-lg hover:shadow-purple-500/25"
          >
            {showOutput ? "閉じる" : "✨ AI が変換するとこうなる"}
            <svg className={`w-4 h-4 transition-transform ${showOutput ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 出力例 */}
        {showOutput && (
          <div className="animate-fade-in">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI 生成結果</h4>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 text-sm text-gray-700 whitespace-pre-wrap border border-purple-100 leading-relaxed">
              {current.output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
