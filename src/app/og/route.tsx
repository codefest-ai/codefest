import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") ?? "Stop wasting the first hour."
  const sub = searchParams.get("sub") ?? "The hackathon operating system."

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(132,204,22,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#84cc16",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            ⚡
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#fff", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.04em" }}>
              codefest
              <span style={{ color: "#84cc16" }}>.ai</span>
            </span>
          </div>
        </div>

        {/* Main text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
          <div
            style={{
              fontSize: title.length > 40 ? "52px" : "64px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#71717a",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            {sub}
          </div>
        </div>

        {/* Bottom badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "100px",
              border: "1px solid rgba(132,204,22,0.3)",
              background: "rgba(132,204,22,0.08)",
              color: "#84cc16",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            codefest.ai
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
