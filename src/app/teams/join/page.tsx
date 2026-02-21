"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { joinTeamByCode } from "@/lib/teams"

function JoinForm() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState(searchParams.get("code") ?? "")
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setJoining(true)
    setError(null)

    const { team, error: err } = await joinTeamByCode(code.trim())

    if (team && !err) {
      router.push(`/teams/${team.id}`)
    } else {
      setError(err ?? "Something went wrong")
      setJoining(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        background: "var(--sp-surface)", border: "1px solid var(--sp-border)",
        borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px",
      }}>
        <div>
          <label style={{
            fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)",
            textTransform: "uppercase" as const, letterSpacing: "0.12em",
            display: "block", marginBottom: "8px",
          }}>
            invite code
          </label>
          <input
            style={{
              width: "100%", boxSizing: "border-box" as const,
              background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
              borderRadius: "8px", padding: "12px 16px",
              fontFamily: "var(--sp-mono)", fontSize: "20px", fontWeight: 700,
              color: "var(--sp-brand)", letterSpacing: "0.15em", textTransform: "uppercase" as const,
              outline: "none", transition: "border-color 0.15s", textAlign: "center" as const,
            }}
            placeholder="AB12CD34"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={12}
            autoFocus
            onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--sp-border)")}
          />
          <div style={{ marginTop: "6px", fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textAlign: "center" }}>
            Ask your team lead for the 8-character code
          </div>
        </div>

        {error && (
          <div style={{
            fontFamily: "var(--sp-mono)", fontSize: "11px", color: "#f472b6",
            padding: "8px 12px", background: "rgba(244,114,182,0.08)",
            border: "1px solid rgba(244,114,182,0.2)", borderRadius: "6px",
          }}>
            ⚠ {error}
          </div>
        )}

        {!user && (
          <div style={{
            fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)",
            padding: "10px 14px", background: "var(--sp-surface2)",
            border: "1px solid var(--sp-border)", borderRadius: "6px",
          }}>
            ℹ <Link href="/login" style={{ color: "var(--sp-brand)", textDecoration: "underline" }}>Sign in</Link> first, then enter your invite code.
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Link
            href="/teams"
            style={{
              fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "9px 18px",
              background: "none", border: "1px solid var(--sp-border)",
              borderRadius: "8px", color: "var(--sp-dim)", textDecoration: "none",
            }}
          >
            cancel
          </Link>
          <button
            type="submit"
            disabled={!code.trim() || joining || !user}
            style={{
              fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "9px 22px",
              background: code.trim() && !joining && user ? "var(--sp-brand)" : "var(--sp-surface2)",
              color: code.trim() && !joining && user ? "#000" : "var(--sp-dim)",
              border: "none", borderRadius: "8px", fontWeight: 700,
              cursor: code.trim() && !joining && user ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            {joining ? "joining…" : "join team →"}
          </button>
        </div>
      </div>
    </form>
  )
}

export default function JoinTeamPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="sp-page">
      {/* ── HEADER ── */}
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>

        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)" }}>
          <span style={{ color: "var(--sp-brand)", fontWeight: 600 }}>join team</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/teams" className="sp-hdr-link">← teams</Link>
          {user ? (
            <>
              <span style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-muted)" }}>{user.email?.split("@")[0]}</span>
              <button className="sp-hdr-link" onClick={() => signOut()}>sign out</button>
            </>
          ) : (
            <Link href="/login" className="sp-hdr-link">sign in</Link>
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ paddingTop: "50px", maxWidth: "480px", margin: "0 auto", padding: "70px 2rem 4rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
            join existing
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Join a Team
          </h1>
          <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6 }}>
            Enter the 8-character invite code from your team lead.
          </p>
        </div>

        <Suspense fallback={<div style={{ fontFamily: "var(--sp-mono)", fontSize: "12px", color: "var(--sp-dim)" }}>loading…</div>}>
          <JoinForm />
        </Suspense>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)" }}>
          Starting a new team instead?{" "}
          <Link href="/teams/new" style={{ color: "var(--sp-brand)", textDecoration: "none" }}>Create one →</Link>
        </div>
      </main>

      <footer className="sp-footer">
        <div className="sp-foot-l">
          <span>⚡</span><span>codefest.ai</span><span>·</span><span>throughline systems llc</span>
        </div>
        <div className="sp-foot-r">built for builders · © 2026</div>
      </footer>
    </div>
  )
}
