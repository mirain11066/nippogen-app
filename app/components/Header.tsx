"use client";

import Link from "next/link";

interface HeaderProps {
  plan: "free" | "pro";
  reportsUsed: number;
  reportsLimit: number;
}

export default function Header({ plan, reportsUsed, reportsLimit }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brand-700">NippoGen</span>
          <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
            AI日報
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{reportsUsed}</span>
            <span className="text-gray-400"> / {reportsLimit} 件</span>
          </div>
          {plan === "free" && (
            <Link
              href="/pricing"
              className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Pro にアップグレード
            </Link>
          )}
          {plan === "pro" && (
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
              PRO
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
