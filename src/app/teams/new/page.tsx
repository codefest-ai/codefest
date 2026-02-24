"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { createTeam } from "@/lib/teams"

export default function NewTeamPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [hackathonName, setHackathonName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)

    const team = await createTeam(name.trim(), description.trim(), hackathonName.trim())
    if (team) {
      router.push(`/teams/${team.id}`)
    } else {
      setError("Failed to create team — please try again")
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
    borderRadius: "8px", padding: "10px 14px",
    fontFamily: "inherit", fontSize: "13px", color: "var(--sp-text)",
    outline: "none", transition: "border-color 0.15s",
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)",
    textTransform: "uppercase" as const, letterSpacing: "0.12em",
    display: "block", marginBottom: "6px",
  }

  return (
    <div className="sp-page">
      {/* ── HEADER ── */}
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>

        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)" }}>
          <span style={{ color: "var(--sp-brand)", fontWeight: 600 }}>new team</span>
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
      <main style={{ paddingTop: "50px", maxWidth: "560px", margin: "0 auto", padding: "70px 2rem 4rem" }}>

        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
            form team
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Create a Team
          </h1>
          <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6 }}>
            You&apos;ll get an invite code to share with teammates. You start as Lead.
          </p>
        </div>

        {!user ? (
          <div style={{
            textAlign: "center", padding: "3rem 2rem",
            background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px",
          }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "13px", color: "var(--sp-muted)", marginBottom: "1.5rem" }}>
              Sign in to create a team
            </div>
            <Link
              href="/login"
              style={{
                display: "inline-block", fontFamily: "var(--sp-mono)", fontSize: "12px",
                padding: "9px 20px", background: "var(--sp-brand)", color: "#000",
                borderRadius: "8px", fontWeight: 700, textDecoration: "none",
              }}
            >
              sign in →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{
              background: "var(--sp-surface)", border: "1px solid var(--sp-border)",
              borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px",
            }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>Team name *</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. FoodBridge, MedConnect, SkillPath"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={60}
                  autoFocus
                  onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--sp-border)")}
                />
              </div>

              {/* Hackathon */}
              <div>
                <label style={labelStyle}>Hackathon name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. HackMIT 2026, TreeHacks, Local civic hack"
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  maxLength={80}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--sp-border)")}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>What are you building?</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                  placeholder="One sentence about your project idea…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--sp-border)")}
                />
              </div>

              {error && (
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "#f472b6", padding: "8px 12px", background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: "6px" }}>
                  ⚠ {error}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
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
                  disabled={!name.trim() || saving}
                  style={{
                    fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "9px 22px",
                    background: name.trim() && !saving ? "var(--sp-brand)" : "var(--sp-surface2)",
                    color: name.trim() && !saving ? "#000" : "var(--sp-dim)",
                    border: "none", borderRadius: "8px", fontWeight: 700,
                    cursor: name.trim() && !saving ? "pointer" : "not-allowed",
                    transition: "all 0.15s",
                  }}
                >
                  {saving ? "creating…" : "create team →"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <footer className="sp-footer">
        <div className="sp-foot-l">
          <span>⚡</span><span>codefest.ai</span><span>·</span>
        </div>
        <div className="sp-foot-r">built for builders · © 2026</div>
      </footer>
    </div>
  )
}
