"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [plan, setPlan] = useState("free");
  const [status, setStatus] = useState("none");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadAccount = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setEmail(session.user.email || "");
      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("plan, subscription_status")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setPlan(profile.plan);
        setStatus(profile.subscription_status || "none");
      }

      setLoading(false);
    };

    loadAccount();
  }, [router]);

  const handleCancel = async () => {
    if (!confirm("本当に Pro プランを解約しますか？\n\n解約しても、現在の請求期間の終了まで Pro 機能をご利用いただけます。")) {
      return;
    }

    setCanceling(true);
    setMessage("");

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("canceling");
        const endDate = new Date(data.current_period_end * 1000).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setMessage(`解約手続きが完了しました。${endDate}まで Pro 機能をご利用いただけます。`);
      } else {
        setMessage(data.error || "解約に失敗しました。");
      }
    } catch {
      setMessage("エラーが発生しました。もう一度お試しください。");
    }

    setCanceling(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">アカウント設定</h1>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">メールアドレス</span>
              <span className="text-sm font-medium text-gray-900">{email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">現在のプラン</span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                plan === "pro"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {plan === "pro" ? "Pro" : "Free"}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">ステータス</span>
              <span className={`text-sm font-medium ${
                status === "active" ? "text-green-600" :
                status === "canceling" ? "text-orange-600" :
                "text-gray-500"
              }`}>
                {status === "active" ? "有効" :
                 status === "canceling" ? "解約予定" :
                 status === "none" ? "未契約" : status}
              </span>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm ${
              message.includes("完了") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {message}
            </div>
          )}

          {plan === "pro" && status === "active" && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">プランの解約</h2>
              <p className="text-sm text-gray-500 mb-4">
                解約しても、現在の請求期間の終了まで Pro 機能をご利用いただけます。
              </p>
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="px-6 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {canceling ? "処理中..." : "Pro プランを解約する"}
              </button>
            </div>
          )}

          {plan === "pro" && status === "canceling" && (
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-orange-600 font-medium">
                解約予定です。請求期間終了後に Free プランに切り替わります。
              </p>
            </div>
          )}

          {plan === "free" && (
            <div className="border-t border-gray-200 pt-6">
              <Link
                href="/pricing"
                className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Pro にアップグレード
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
