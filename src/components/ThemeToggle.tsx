"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "light"

function applyTheme(theme: Theme) {
  const isLight = theme === "light"
  document.documentElement.classList.toggle("dark", !isLight)
  document.body.classList.toggle("light", isLight)
}

export function ThemeToggle({ mono = false }: { mono?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const saved = (localStorage.getItem("codefest-theme") as Theme) ?? "dark"
    setTheme(saved)
    applyTheme(saved)
  }, [])

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("codefest-theme", next)
    applyTheme(next)
    setFlash(next)
    setTimeout(() => setFlash(null), 950)
  }

  if (!mounted) return <div className="w-8 h-4" />

  const isLight = theme === "light"

  // ── Mono variant (workspace header) ──────────────────────────
  if (mono) {
    return (
      <button
        onClick={toggle}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        style={{
          fontFamily: "var(--sp-mono)",
          fontSize: "10px",
          padding: "3px 8px",
          background: "none",
          border: `1px solid ${isLight ? "rgba(251,191,36,0.4)" : "var(--sp-border)"}`,
          borderRadius: "4px",
          color: isLight ? "#fbbf24" : "var(--sp-dim)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          transition: "all 0.2s",
          minWidth: "52px",
        }}
      >
        <span style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: isLight ? "#fbbf24" : "#374151",
          boxShadow: isLight ? "0 0 6px #fbbf24" : "none",
          display: "inline-block",
          flexShrink: 0,
          transition: "all 0.3s",
        }} />
        <span key={flash ?? theme}>
          {flash ?? theme}
        </span>
      </button>
    )
  }

  // ── Standard variant (main Header) ───────────────────────────
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        onClick={toggle}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
        className="relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/5"
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      >
        <div className="relative flex items-center justify-center w-5 h-5">
          <div
            className="absolute inset-0 rounded-full border transition-all duration-300"
            style={{
              borderColor: isLight ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.12)",
              boxShadow: isLight ? "0 0 8px rgba(251,191,36,0.3), inset 0 0 4px rgba(251,191,36,0.1)" : "none",
            }}
          />
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: isLight ? "#fbbf24" : "#1f2937",
              boxShadow: isLight ? "0 0 6px #fbbf24, 0 0 12px rgba(251,191,36,0.4)" : "none",
            }}
          />
        </div>
      </button>

      {/* Flash label on click */}
      {flash && (
        <span
          key={flash}
          style={{
            position: "absolute",
            left: "calc(100% + 5px)",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-geist-mono, monospace)",
            fontSize: "9px",
            letterSpacing: "0.08em",
            color: "#6b7280",
            pointerEvents: "none",
            animation: "themeFlash 0.95s ease forwards",
          }}
        >
          {flash}
        </span>
      )}
    </div>
  )
}
