"use client";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  expression?: "happy" | "wink" | "thinking" | "excited";
  message?: string;
}

export default function Mascot({ size = "md", expression = "happy", message }: MascotProps) {
  const sizes = {
    sm: { w: 80, h: 100 },
    md: { w: 120, h: 150 },
    lg: { w: 180, h: 225 },
  };

  const s = sizes[size];

  const eyes = {
    happy: (
      <>
        <circle cx="75" cy="95" r="5" fill="#1E293B" />
        <circle cx="105" cy="95" r="5" fill="#1E293B" />
        <circle cx="77" cy="93" r="2" fill="white" />
        <circle cx="107" cy="93" r="2" fill="white" />
      </>
    ),
    wink: (
      <>
        <circle cx="75" cy="95" r="5" fill="#1E293B" />
        <circle cx="77" cy="93" r="2" fill="white" />
        <path d="M100 95 Q105 90 110 95" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
    thinking: (
      <>
        <circle cx="75" cy="95" r="5" fill="#1E293B" />
        <circle cx="105" cy="95" r="5" fill="#1E293B" />
        <circle cx="77" cy="93" r="2" fill="white" />
        <circle cx="107" cy="93" r="2" fill="white" />
      </>
    ),
    excited: (
      <>
        <path d="M70 90 Q75 100 80 90" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M100 90 Q105 100 110 90" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
  };

  const mouths = {
    happy: <path d="M80 110 Q90 122 100 110" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    wink: <path d="M80 110 Q90 122 100 110" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    thinking: <circle cx="95" cy="112" rx="4" ry="5" fill="#1E293B" />,
    excited: (
      <path d="M78 108 Q90 128 102 108" stroke="#1E293B" strokeWidth="2.5" fill="#FF8FA3" strokeLinecap="round" />
    ),
  };

  const cheeks = expression !== "thinking" ? (
    <>
      <ellipse cx="68" cy="108" rx="8" ry="5" fill="#FFB3C1" opacity="0.6" />
      <ellipse cx="112" cy="108" rx="8" ry="5" fill="#FFB3C1" opacity="0.6" />
    </>
  ) : null;

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-2.5 mb-3 border border-white/50 animate-fade-in max-w-[200px]">
          <p className="text-sm text-gray-700 font-medium text-center">{message}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 border-r border-b border-white/50 rotate-45" />
        </div>
      )}
      <svg
        width={s.w}
        height={s.h}
        viewBox="0 0 180 225"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={expression === "excited" ? "animate-bounce-soft" : ""}
      >
        {/* ノート本体（体） */}
        <rect x="45" y="40" width="90" height="130" rx="12" fill="url(#bodyGradient)" />
        <rect x="45" y="40" width="90" height="130" rx="12" stroke="#C4B5FD" strokeWidth="2" />

        {/* ノートの横線 */}
        <line x1="60" y1="140" x2="120" y2="140" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="150" x2="110" y2="150" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="160" x2="100" y2="160" stroke="#DDD6FE" strokeWidth="2" strokeLinecap="round" />

        {/* リングバインダー */}
        <circle cx="45" cy="65" r="6" fill="none" stroke="#A78BFA" strokeWidth="3" />
        <circle cx="45" cy="90" r="6" fill="none" stroke="#A78BFA" strokeWidth="3" />
        <circle cx="45" cy="115" r="6" fill="none" stroke="#A78BFA" strokeWidth="3" />
        <circle cx="45" cy="140" r="6" fill="none" stroke="#A78BFA" strokeWidth="3" />

        {/* 顔 */}
        {eyes[expression]}
        {mouths[expression]}
        {cheeks}

        {/* 鉛筆（右手） */}
        <g transform="rotate(-15, 145, 100)">
          <rect x="138" y="55" width="10" height="60" rx="2" fill="#FBBF24" />
          <polygon points="138,115 148,115 143,128" fill="#FDE68A" />
          <polygon points="140,125 146,125 143,132" fill="#1E293B" />
          <rect x="138" y="55" width="10" height="8" rx="2" fill="#F472B6" />
        </g>

        {/* 左手 */}
        <ellipse cx="38" cy="120" rx="8" ry="6" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="1.5" />

        {/* 足 */}
        <ellipse cx="70" cy="172" rx="14" ry="6" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="1.5" />
        <ellipse cx="110" cy="172" rx="14" ry="6" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="1.5" />

        {/* キラキラ */}
        {expression === "excited" && (
          <>
            <path d="M25 50 L28 42 L31 50 L39 53 L31 56 L28 64 L25 56 L17 53 Z" fill="#FBBF24" />
            <path d="M145 35 L147 30 L149 35 L154 37 L149 39 L147 44 L145 39 L140 37 Z" fill="#F472B6" />
            <path d="M155 70 L157 66 L159 70 L163 72 L159 74 L157 78 L155 74 L151 72 Z" fill="#60A5FA" />
          </>
        )}

        <defs>
          <linearGradient id="bodyGradient" x1="45" y1="40" x2="135" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5F3FF" />
            <stop offset="1" stopColor="#EDE9FE" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-sm font-bold text-white mt-2">ニッポくん</span>
    </div>
  );
}
