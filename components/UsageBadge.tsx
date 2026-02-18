"use client";

interface UsageBadgeProps {
  used: number;
  limit: number;
  plan: "free" | "pro";
}

export default function UsageBadge({ used, limit, plan }: UsageBadgeProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = used >= limit;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">今月の利用状況</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            plan === "pro"
              ? "bg-amber-100 text-amber-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {plan === "pro" ? "PRO" : "FREE"}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            isAtLimit
              ? "bg-red-500"
              : isNearLimit
                ? "bg-amber-500"
                : "bg-brand-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{used} / {limit} 件使用</span>
        <span>残り {Math.max(limit - used, 0)} 件</span>
      </div>

      {isAtLimit && plan === "free" && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          今月の無料枠を使い切りました。Proプランにアップグレードすると毎月100件まで生成できます。
        </div>
      )}
    </div>
  );
}
