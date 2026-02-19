import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a8a, #2563eb, #60a5fa)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 900, color: "white", marginBottom: 16, display: "flex" }}>
          📝 NippoGen
        </div>
        <div style={{ fontSize: 40, fontWeight: 600, color: "white", marginBottom: 24, display: "flex" }}>
          AI日報ジェネレーター
        </div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.9)", marginBottom: 32, display: "flex" }}>
          箇条書きを貼るだけ → 10秒でプロの日報が完成
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 18,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <span>✅ 無料で始める</span>
          <span>🌍 6言語対応</span>
          <span>⚡ Pro ¥980/月</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
