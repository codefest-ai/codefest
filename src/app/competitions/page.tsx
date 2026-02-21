"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { getCompetitions, competitionStatus } from "@/lib/competitions"
import type { Competition } from "@/lib/supabase/types"

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  live:     { label: "● LIVE",    color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  upcoming: { label: "◇ UPCOMING", color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
  ended:    { label: "○ ENDED",   color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
}

function formatCountdown(targetIso: string): string {
  const diff = new Date(targetIso).getTime() - Date.now()
  if (diff <= 0) return "—"
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  if (h > 48) return `${Math.floor(h / 24)}d ${h % 24}h`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

export default function CompetitionsPage() {
  const { user, signOut } = useAuth()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)
  const [clock, setClock] = useState("")

  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date()
      setClock(n.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    getCompetitions().then(data => { setCompetitions(data); setLoading(false) })
  }, [])

  const live     = competitions.filter(c => competitionStatus(c) === "live")
  const upcoming = competitions.filter(c => competitionStatus(c) === "upcoming")
  const ended    = competitions.filter(c => competitionStatus(c) === "ended")

  const CompCard = ({ comp }: { comp: Competition }) => {
    const status = competitionStatus(comp)
    const st = STATUS_STYLE[status]
    const isLive = status === "live"
    const timeLeft = isLive ? formatCountdown(comp.end_time) : status === "upcoming" ? formatCountdown(comp.start_time) : null

    return (
      <Link href={`/competitions/${comp.id}`} style={{ textDecoration: "none" }}>
        <div style={{
          background: "var(--sp-surface)", border: `1px solid ${isLive ? "rgba(34,197,94,0.25)" : "var(--sp-border)"}`,
          borderLeft: `3px solid ${st.color}`,
          borderRadius: "12px", padding: "20px 24px", cursor: "pointer", transition: "all 0.15s",
        }} className="ws-card-hover">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "2px 8px", background: st.bg, color: st.color, borderRadius: "4px", letterSpacing: "0.05em" }}>
                  {st.label}
                </span>
                {comp.tracks.slice(0, 3).map(t => (
                  <span key={t} className="sp-dtag">{t}</span>
                ))}
              </div>
              <div style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "4px" }}>{comp.name}</div>
              {comp.location && (
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", marginBottom: "4px" }}>📍 {comp.location}</div>
              )}
              {comp.description && (
                <div style={{ fontSize: "12px", color: "var(--sp-muted)", lineHeight: 1.5 }}>{comp.description}</div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {comp.prize_pool && (
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "13px", fontWeight: 700, color: "#fbbf24", marginBottom: "4px" }}>
                  {comp.prize_pool}
                </div>
              )}
              {timeLeft && (
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: isLive ? "var(--sp-brand)" : "var(--sp-dim)" }}>
                  {isLive ? "ends in" : "starts in"} {timeLeft}
                </div>
              )}
              {status === "ended" && (
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                  {formatDate(comp.end_time)}
                </div>
              )}
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", marginTop: "4px" }}>
                max {comp.max_team_size} / team →
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="sp-page">
      {/* ── HEADER ── */}
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)" }}>
          <span style={{ color: "var(--sp-brand)", fontWeight: 600 }}>competitions</span>
          <span>·</span>
          <span><span className="sp-status-dot" />{live.length > 0 ? `${live.length} live` : "online"}</span>
          <span suppressHydrationWarning>{clock}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/" className="sp-hdr-link">← home</Link>
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

      <main style={{ paddingTop: "50px", maxWidth: "900px", margin: "0 auto", padding: "70px 2rem 4rem" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
              04 · compete
            </div>
            <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
              Competitions
            </h1>
            <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6 }}>
              Register your team, clock in when the hackathon starts, and track global progress.
            </p>
          </div>
          {user && (
            <Link href="/competitions/new" style={{
              fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 18px",
              background: "var(--sp-brand)", color: "#000", fontWeight: 700,
              borderRadius: "8px", textDecoration: "none",
            }}>
              + add competition
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: "110px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px" }} />
            ))}
          </div>
        ) : competitions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "16px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🏁</div>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "13px", color: "var(--sp-text)", fontWeight: 600, marginBottom: "8px" }}>No competitions yet</div>
            <div style={{ fontSize: "12px", color: "var(--sp-muted)", marginBottom: "1.5rem" }}>
              Add an upcoming hackathon so teams can register and clock in together.
            </div>
            {user && (
              <Link href="/competitions/new" style={{
                display: "inline-block", fontFamily: "var(--sp-mono)", fontSize: "12px",
                padding: "9px 20px", background: "var(--sp-brand)", color: "#000",
                borderRadius: "8px", fontWeight: 700, textDecoration: "none",
              }}>
                + add competition →
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {live.length > 0 && (
              <div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>
                  ● Live now
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {live.map(c => <CompCard key={c.id} comp={c} />)}
                </div>
              </div>
            )}
            {upcoming.length > 0 && (
              <div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>
                  ◇ Upcoming
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {upcoming.map(c => <CompCard key={c.id} comp={c} />)}
                </div>
              </div>
            )}
            {ended.length > 0 && (
              <div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>
                  ○ Past
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {ended.map(c => <CompCard key={c.id} comp={c} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="sp-footer">
        <div className="sp-foot-l"><span>⚡</span><span>codefest.ai</span><span>·</span><span>throughline systems llc</span></div>
        <div className="sp-foot-r">built for builders · © 2026</div>
      </footer>
    </div>
  )
}
