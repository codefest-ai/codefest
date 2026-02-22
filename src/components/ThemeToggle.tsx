"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "system" | "light"

// Cycle order: dark → system → light → dark
const CYCLE: Theme[] = ["dark", "system", "light"]

const LED_COLOR: Record<Theme, string> = {
  dark:   "#1f2937",
  system: "#6b7280",
  light:  "#fbbf24",
}
const LED_GLOW: Record<Theme, string> = {
  dark:   "none",
  system: "0 0 4px rgba(107,114,128,0.35)",
  light:  "0 0 6px #fbbf24, 0 0 12px rgba(251,191,36,0.4)",
}
const RING_COLOR: Record<Theme, string> = {
  dark:   "rgba(255,255,255,0.10)",
  system: "rgba(107,114,128,0.28)",
  light:  "rgba(251,191,36,0.50)",
}

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemPreference() : theme
  const isLight = resolved === "light"
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
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length]
    setTheme(next)
    localStorage.setItem("codefest-theme", next)
    applyTheme(next)
    setFlash(next)
    setTimeout(() => setFlash(null), 950)
  }

  if (!mounted) return <div className="w-8 h-4" />

  const isLight = theme === "light" || (theme === "system" && getSystemPreference() === "light")

  // ── Mono variant (workspace header) ──────────────────────────
  if (mono) {
    return (
      <button
        onClick={toggle}
        title={`Theme: ${theme} — click to cycle`}
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
          minWidth: "56px",
        }}
      >
        <span style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: LED_COLOR[theme],
          boxShadow: LED_GLOW[theme],
          display: "inline-block",
          flexShrink: 0,
          transition: "all 0.3s",
        }} />
        {/* Flash new name briefly, then settle to theme name */}
        <span key={flash ?? theme} style={{ transition: "opacity 0.15s" }}>
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
        title={`Theme: ${theme} — click to cycle`}
        className="relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/5"
        aria-label={`Theme: ${theme}. Click to cycle.`}
      >
        <div className="relative flex items-center justify-center w-5 h-5">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border transition-all duration-300"
            style={{
              borderColor: RING_COLOR[theme],
              boxShadow: isLight
                ? "0 0 8px rgba(251,191,36,0.3), inset 0 0 4px rgba(251,191,36,0.1)"
                : "none",
            }}
          />
          {/* Inner LED */}
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: LED_COLOR[theme],
              boxShadow: LED_GLOW[theme],
            }}
          />
        </div>
      </button>

      {/* Flash label — appears briefly to the right on click */}
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
