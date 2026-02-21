"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="sp-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "#f472b6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>
          ⚠ error
        </div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "8px" }}>
          Something broke.
        </h1>
        <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          An unexpected error occurred. Try refreshing — if it persists, it&apos;s on us.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 18px", background: "var(--sp-brand)", color: "#000", border: "none", borderRadius: "7px", fontWeight: 700, cursor: "pointer" }}
          >
            try again
          </button>
          <Link href="/" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 18px", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "7px", color: "var(--sp-dim)", textDecoration: "none" }}>
            ← home
          </Link>
        </div>
        {error.digest && (
          <div style={{ marginTop: "1.5rem", fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)" }}>
            ref: {error.digest}
          </div>
        )}
      </div>
    </div>
  )
}
