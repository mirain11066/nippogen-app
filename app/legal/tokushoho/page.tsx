export default function TokushohoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>

        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top w-1/3">販売事業者名</td>
              <td className="py-4 text-gray-600">牧野未來</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">運営責任者</td>
              <td className="py-4 text-gray-600">牧野未來</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">所在地</td>
              <td className="py-4 text-gray-600">請求があった場合に遅滞なく開示いたします</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">電話番号</td>
              <td className="py-4 text-gray-600">請求があった場合に遅滞なく開示いたします</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">メールアドレス</td>
              <td className="py-4 text-gray-600">mirain11066@gmail.com</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">販売URL</td>
              <td className="py-4 text-gray-600">https://nippogen-app.vercel.app</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">販売価格</td>
              <td className="py-4 text-gray-600">Pro プラン：月額980円（税込）</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">追加手数料</td>
              <td className="py-4 text-gray-600">なし（インターネット接続料金はお客様のご負担となります）</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">支払い方法</td>
              <td className="py-4 text-gray-600">クレジットカード（Stripe経由）</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">支払い時期</td>
              <td className="py-4 text-gray-600">サブスクリプション登録時に初回決済、以降毎月自動更新</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">商品の引き渡し時期</td>
              <td className="py-4 text-gray-600">決済完了後、即時にProプランの全機能をご利用いただけます</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">返品・キャンセルについて</td>
              <td className="py-4 text-gray-600">デジタルサービスの性質上、返品はお受けしておりません。サブスクリプションはいつでもキャンセル可能で、キャンセル後は次回更新日まで引き続きご利用いただけます。</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-semibold text-gray-700 align-top">動作環境</td>
              <td className="py-4 text-gray-600">最新のウェブブラウザ（Chrome、Safari、Firefox、Edge）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}