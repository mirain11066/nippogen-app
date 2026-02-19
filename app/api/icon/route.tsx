import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const size = Number(request.nextUrl.searchParams.get("size") || "512");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
          borderRadius: size > 200 ? "100px" : "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: size * 0.45,
              height: size * 0.58,
              background: "rgba(255,255,255,0.95)",
              borderRadius: size * 0.05,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: size * 0.06,
              gap: size * 0.04,
            }}
          >
            <div style={{ width: "80%", height: size * 0.03, background: "#60a5fa", borderRadius: 99, display: "flex" }} />
            <div style={{ width: "60%", height: size * 0.03, background: "#a78bfa", borderRadius: 99, display: "flex" }} />
            <div style={{ width: "70%", height: size * 0.03, background: "#f472b6", borderRadius: 99, display: "flex" }} />
            <div style={{ width: "50%", height: size * 0.03, background: "#fbbf24", borderRadius: 99, display: "flex" }} />
          </div>
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
