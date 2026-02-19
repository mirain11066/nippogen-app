"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 56, text: "text-3xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 丸い背景 */}
        <rect width="64" height="64" rx="16" fill="url(#gradient)" />
        {/* ノートのアイコン */}
        <rect x="18" y="14" width="28" height="36" rx="4" fill="white" fillOpacity="0.95" />
        {/* 行のライン */}
        <rect x="24" y="22" width="16" height="2.5" rx="1.25" fill="#60A5FA" />
        <rect x="24" y="28" width="12" height="2.5" rx="1.25" fill="#A78BFA" />
        <rect x="24" y="34" width="14" height="2.5" rx="1.25" fill="#F472B6" />
        <rect x="24" y="40" width="10" height="2.5" rx="1.25" fill="#FBBF24" />
        {/* キラキラ */}
        <circle cx="50" cy="16" r="3" fill="#FBBF24" />
        <circle cx="54" cy="24" r="2" fill="#F472B6" />
        <circle cx="12" cy="44" r="2.5" fill="#60A5FA" />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className={`${s.text} font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent`}>
            NippoGen
          </span>
          {size === "lg" && (
            <span className="text-xs text-gray-500 -mt-1">AI日報ジェネレーター</span>
          )}
        </div>
      )}
    </div>
  );
}
