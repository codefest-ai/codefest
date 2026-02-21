"use client"

import { useEffect, useState } from "react"

type Theme = "system" | "dark" | "light"

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const isDark = theme === "dark" || (theme === "system" && prefersDark)
  document.body.classList.toggle("light", !isDark)
}

export function ThemeToggle({ mono = false }: { mono?: boolean }) {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const saved = (localStorage.getItem("codefest-theme") as Theme) ?? "system"
    setTheme(saved)
    applyTheme(saved)

    // Listen for OS preference changes when in system mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if ((localStorage.getItem("codefest-theme") ?? "system") === "system") applyTheme("system")
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const cycle = () => {
    const next: Theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system"
    setTheme(next)
    localStorage.setItem("codefest-theme", next)
    applyTheme(next)
  }

  const icon = theme === "light" ? "☀" : theme === "dark" ? "◑" : "⊙"
  const label = theme === "light" ? "light" : theme === "dark" ? "dark" : "system"

  if (mono) {
    return (
      <button
        onClick={cycle}
        title={`Theme: ${label} — click to cycle`}
        style={{
          fontFamily: "var(--sp-mono)", fontSize: "10px",
          padding: "3px 8px", background: "none",
          border: "1px solid var(--sp-border)", borderRadius: "4px",
          color: "var(--sp-dim)", cursor: "pointer",
        }}
      >
        {icon} {label}
      </button>
    )
  }

  return (
    <button
      onClick={cycle}
      title={`Theme: ${label} — click to cycle`}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
