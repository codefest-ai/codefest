"use client"

import { useEffect, useState } from "react"

export function ThemeToggle({ mono = false }: { mono?: boolean }) {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("codefest-theme")
    if (saved === "light") {
      document.body.classList.add("light")
      setLight(true)
    }
  }, [])

  const toggle = () => {
    const next = !light
    setLight(next)
    if (next) {
      document.body.classList.add("light")
      localStorage.setItem("codefest-theme", "light")
    } else {
      document.body.classList.remove("light")
      localStorage.setItem("codefest-theme", "dark")
    }
  }

  if (mono) {
    // Minimal version for workspace header
    return (
      <button
        onClick={toggle}
        title={light ? "Switch to dark mode" : "Switch to light mode"}
        style={{
          fontFamily: "var(--sp-mono)", fontSize: "10px",
          padding: "3px 8px", background: "none",
          border: "1px solid var(--sp-border)", borderRadius: "4px",
          color: "var(--sp-dim)", cursor: "pointer",
        }}
      >
        {light ? "◑ dark" : "◐ light"}
      </button>
    )
  }

  // Version for library header (Tailwind)
  return (
    <button
      onClick={toggle}
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-mono"
    >
      {light ? "◑" : "◐"}
    </button>
  )
}
