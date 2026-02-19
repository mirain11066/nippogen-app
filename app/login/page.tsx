"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) setMessage(error.message);
      else setMessage("確認メールを送信しました。メールを確認してください。");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else router.push("/");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />

      {/* 浮遊するオブジェクト */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-[10%] w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-[60%] left-[5%] w-48 h-48 bg-blue-300/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-[20%] right-[5%] w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-[10%] right-[15%] w-56 h-56 bg-green-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[30%] left-[30%] w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* 装飾的なドット */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[20%] w-3 h-3 bg-white/30 rounded-full animate-bounce-soft" />
        <div className="absolute top-[25%] right-[25%] w-2 h-2 bg-white/20 rounded-full animate-bounce-soft" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-[20%] left-[15%] w-2.5 h-2.5 bg-white/25 rounded-full animate-bounce-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[70%] right-[10%] w-2 h-2 bg-white/20 rounded-full animate-bounce-soft" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[45%] left-[8%] w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce-soft" style={{ animationDelay: "0.8s" }} />
      </div>

      {/* カード */}
      <div className="relative max-w-md w-full animate-slide-up">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/50">
          {/* ロゴ */}
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <p className="text-center text-sm text-gray-500 mb-8">
            {isSignUp ? "アカウントを作成して始めましょう" : "おかえりなさい！ログインしてください"}
          </p>

          {/* Google ログインボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all disabled:opacity-50 mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium text-gray-700">Google で続ける</span>
          </button>

          {/* 区切り線 */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/95 text-gray-400">または</span>
            </div>
          </div>

          {/* メール/パスワード フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="パスワード（6文字以上）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50 font-semibold text-sm transition-all hover:shadow-lg hover:shadow-purple-500/25"
            >
              {loading ? "処理中..." : isSignUp ? "アカウント作成" : "メールでログイン"}
            </button>
          </form>

          {message && (
            <div className={`mt-4 text-center text-sm p-3 rounded-xl ${message.includes("確認メール") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {message}
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            {isSignUp ? "既にアカウントをお持ちですか？" : "アカウントがありませんか？"}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }}
              className="text-purple-600 hover:text-purple-700 font-semibold ml-1 hover:underline"
            >
              {isSignUp ? "ログイン" : "新規登録"}
            </button>
          </p>
        </div>

        {/* カード下のリンク */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white/70 text-sm hover:text-white transition-colors">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
