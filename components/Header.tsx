"use client";
import Logo from "./Logo";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HeaderProps {
  plan: "free" | "pro";
  reportsUsed: number;
  reportsLimit: number;
}

export default function Header({ plan, reportsUsed, reportsLimit }: HeaderProps) {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setEmail(null);
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{reportsUsed}</span>
            <span className="text-gray-400"> / {reportsLimit} 件</span>
          </div>
          {plan === "pro" && (
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
              PRO
            </span>
          )}
          {plan === "free" && (
            <Link
              href="/pricing"
              className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Pro にアップグレード
            </Link>
          )}
          {email ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">{email}</span>
              <Link href="/account" className="text-xs text-gray-500 hover:text-purple-600 transition-colors">アカウント</Link>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-brand-600 hover:underline"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
