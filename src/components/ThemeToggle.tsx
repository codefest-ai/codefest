"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "light"

function applyTheme(theme: Theme) {
  const isDark = theme === "dark"
  // Toggle Tailwind dark class on <html>
  document.documentElement.classList.toggle("dark", isDark)
  // Toggle sp-page light mode (workspace uses these vars)
  document.body.classList.toggle("light", !isDark)
}

export function ThemeToggle({ mono = false }: { mono?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

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
  }

  const isLight = theme === "light"

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return <div className="w-8 h-4" />

  // Mono variant — used in workspace header
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
        }}
      >
        {/* LED dot */}
        <span style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: isLight ? "#fbbf24" : "#374151",
          boxShadow: isLight ? "0 0 6px #fbbf24" : "none",
          display: "inline-block",
          transition: "all 0.2s",
        }} />
        {isLight ? "light" : "dark"}
      </button>
    )
  }

  // Standard variant — used in main Header
  return (
    <button
      onClick={toggle}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="relative flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/5"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {/* The LED button */}
      <div className="relative flex items-center justify-center w-5 h-5">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border transition-all duration-300"
          style={{
            borderColor: isLight ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.12)",
            boxShadow: isLight ? "0 0 8px rgba(251,191,36,0.3), inset 0 0 4px rgba(251,191,36,0.1)" : "none",
          }}
        />
        {/* Inner LED */}
        <div
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={{
            background: isLight
              ? "#fbbf24"
              : "#1f2937",
            boxShadow: isLight
              ? "0 0 6px #fbbf24, 0 0 12px rgba(251,191,36,0.4)"
              : "none",
          }}
        />
      </div>
    </button>
  )
}
