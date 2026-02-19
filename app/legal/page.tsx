export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">1. 収集する情報</h2>
            <p>当サービス（NippoGen）は、以下の情報を収集します。メールアドレス（アカウント登録・ログイン時）、お支払い情報（Stripe を通じて処理され、当サービスではカード情報を直接保持しません）、日報生成に入力されたテキストデータ、サービスの利用状況（生成回数等）。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">2. 情報の利用目的</h2>
            <p>収集した情報は、サービスの提供・改善、アカウント管理、お支払い処理、カスタマーサポート、サービスに関するお知らせの送信に利用します。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">3. 第三者への提供</h2>
            <p>法令に基づく場合を除き、お客様の個人情報を第三者に提供することはありません。ただし、決済処理のため Stripe Inc. にお支払い情報が送信されます。AI日報生成のため、入力テキストが Anthropic, PBC のAPIに送信されます。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">4. データの保管</h2>
            <p>お客様のデータは、Supabase（クラウドデータベース）に安全に保管されます。アカウント削除時には関連データを削除いたします。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Cookie について</h2>
            <p>当サービスでは、認証状態の維持のために Cookie を使用しています。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">6. お問い合わせ</h2>
            <p>プライバシーに関するお問い合わせは mirain11066@gmail.com までご連絡ください。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">7. 改定</h2>
            <p>本ポリシーは予告なく変更される場合があります。変更後の内容は本ページに掲載した時点で効力を生じます。</p>
          </section>

          <p className="text-xs text-gray-400 mt-8">最終更新日: 2026年2月19日</p>
        </div>
      </div>
    </div>
  );
}