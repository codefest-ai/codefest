"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { getCompetition, getRegistrations, registerTeam, unregisterTeam, clockIn, clockOut, competitionStatus, formatDuration } from "@/lib/competitions"
import { getMyTeams } from "@/lib/teams"
import type { Competition, Registration, TeamWithMembers } from "@/lib/supabase/types"

const STATUS_STYLE = {
  live:     { label: "● LIVE",    color: "#22c55e" },
  upcoming: { label: "◇ UPCOMING", color: "#fbbf24" },
  ended:    { label: "○ ENDED",   color: "#6b7280" },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
}

function useCountdown(targetIso: string | null, direction: "to" | "from" = "to") {
  const [val, setVal] = useState("")
  useEffect(() => {
    if (!targetIso) return
    const tick = () => {
      const diff = direction === "to"
        ? new Date(targetIso).getTime() - Date.now()
        : Date.now() - new Date(targetIso).getTime()
      if (diff <= 0) { setVal(direction === "to" ? "NOW" : "—"); return }
      setVal(formatDuration(Math.abs(diff)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetIso, direction])
  return val
}

export default function CompetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, signOut } = useAuth()

  const [comp, setComp] = useState<Competition | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [myTeams, setMyTeams] = useState<TeamWithMembers[]>([])
  const [myReg, setMyReg] = useState<Registration | null>(null)
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [selectedTrack, setSelectedTrack] = useState("")
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [clock, setClock] = useState("")

  // Poll registrations every 15s when live
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setClock(n.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    Promise.all([
      getCompetition(id),
      getRegistrations(id),
      user ? getMyTeams() : Promise.resolve([]),
    ]).then(([c, regs, teams]) => {
      setComp(c)
      setRegistrations(regs)
      setMyTeams(teams)

      // Find my team's registration
      const myTeamIds = teams.map(t => t.id)
      const found = regs.find(r => myTeamIds.includes(r.team_id)) ?? null
      setMyReg(found)
      if (found) setSelectedTeamId(found.team_id)
      else if (teams.length === 1) setSelectedTeamId(teams[0].id)

      setLoading(false)
    })
  }, [id, user])

  // Live poll
  useEffect(() => {
    if (!comp || competitionStatus(comp) !== "live") return
    const poll = setInterval(async () => {
      const regs = await getRegistrations(id)
      setRegistrations(regs)
    }, 15000)
    return () => clearInterval(poll)
  }, [comp, id])

  const status = comp ? competitionStatus(comp) : null
  const timeToStart = useCountdown(comp?.start_time ?? null, "to")
  const timeToEnd   = useCountdown(comp?.end_time ?? null, "to")
  const clockedInFor = useCountdown(myReg?.clocked_in_at ?? null, "from")

  const activeBuilders = registrations.filter(r => r.clocked_in_at && !r.clocked_out_at)
  const totalRegistered = registrations.length

  const handleRegister = async () => {
    if (!selectedTeamId) return
    setWorking(true)
    const reg = await registerTeam(id, selectedTeamId, selectedTrack || null)
    if (reg) {
      const regs = await getRegistrations(id)
      setRegistrations(regs)
      setMyReg(reg)
    }
    setWorking(false)
  }

  const handleUnregister = async () => {
    if (!myReg) return
    setWorking(true)
    await unregisterTeam(myReg.id)
    const regs = await getRegistrations(id)
    setRegistrations(regs)
    setMyReg(null)
    setWorking(false)
  }

  const handleClockIn = async () => {
    if (!myReg) return
    setWorking(true)
    const ok = await clockIn(myReg.id)
    if (ok) {
      const regs = await getRegistrations(id)
      setRegistrations(regs)
      const found = regs.find(r => r.id === myReg.id) ?? null
      setMyReg(found)
    }
    setWorking(false)
  }

  const handleClockOut = async () => {
    if (!myReg) return
    setWorking(true)
    const ok = await clockOut(myReg.id)
    if (ok) {
      const regs = await getRegistrations(id)
      setRegistrations(regs)
      const found = regs.find(r => r.id === myReg.id) ?? null
      setMyReg(found)
    }
    setWorking(false)
  }

  const isClockedIn = !!(myReg?.clocked_in_at && !myReg?.clocked_out_at)

  if (loading || !comp) {
    return (
      <div className="sp-page">
        <header className="sp-header">
          <Link href="/" className="sp-logo"><div className="sp-logo-mark">⚡</div><span className="sp-logo-name">codefest<em>.ai</em></span></Link>
          <div />
          <Link href="/competitions" className="sp-hdr-link">← competitions</Link>
        </header>
        <main style={{ padding: "70px 2rem", maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ height: "300px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "16px" }} />
        </main>
      </div>
    )
  }

  const st = STATUS_STYLE[status!]

  return (
    <div className="sp-page">
      {/* ── HEADER ── */}
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)" }}>
          <span style={{ color: st.color }}>{st.label}</span>
          <span>·</span>
          <span style={{ color: "var(--sp-brand)", fontWeight: 600 }}>{activeBuilders.length} building</span>
          <span>·</span>
          <span suppressHydrationWarning>{clock}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/competitions" className="sp-hdr-link">← competitions</Link>
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

      <main style={{ paddingTop: "50px", maxWidth: "960px", margin: "0 auto", padding: "70px 1.5rem 4rem" }}>

        {/* ── COMPETITION HERO ── */}
        <div style={{
          background: "var(--sp-surface)", border: `1px solid ${status === "live" ? "rgba(34,197,94,0.25)" : "var(--sp-border)"}`,
          borderRadius: "16px", padding: "28px 32px", marginBottom: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: st.color, letterSpacing: "0.05em" }}>{st.label}</span>
                {comp.tracks.map(t => <span key={t} className="sp-dtag">{t}</span>)}
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "8px" }}>{comp.name}</h1>
              {comp.location && <div style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-brand)", marginBottom: "6px" }}>📍 {comp.location}</div>}
              {comp.description && <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6, maxWidth: "520px" }}>{comp.description}</p>}
              {comp.website_url && (
                <a href={comp.website_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "8px", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-brand)", textDecoration: "none" }}>
                  website ↗
                </a>
              )}
            </div>

            {/* Stats column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", flexShrink: 0, minWidth: "160px" }}>
              {comp.prize_pool && (
                <div>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>prize pool</div>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "20px", fontWeight: 700, color: "#fbbf24" }}>{comp.prize_pool}</div>
                </div>
              )}
              {status === "upcoming" && (
                <div>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>starts in</div>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "18px", fontWeight: 700, color: "#fbbf24" }} suppressHydrationWarning>{timeToStart}</div>
                </div>
              )}
              {status === "live" && (
                <div>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "3px" }}>time remaining</div>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "18px", fontWeight: 700, color: "#22c55e" }} suppressHydrationWarning>{timeToEnd}</div>
                </div>
              )}
              <div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>teams</div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "14px", fontWeight: 700, color: "var(--sp-text)" }}>
                  {activeBuilders.length} building <span style={{ color: "var(--sp-dim)", fontSize: "11px" }}>/ {totalRegistered} registered</span>
                </div>
              </div>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                {formatDate(comp.start_time)}<br />→ {formatDate(comp.end_time)}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID: Clock-in + Dashboard ── */}
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "16px", alignItems: "start" }}>

          {/* LEFT: Clock-in panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* My team clock-in */}
            <div style={{
              background: "var(--sp-surface)", border: `1px solid ${isClockedIn ? "rgba(34,197,94,0.3)" : "var(--sp-border)"}`,
              borderRadius: "14px", padding: "22px",
            }}>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>
                ⚡ my team
              </div>

              {!user ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "var(--sp-muted)", marginBottom: "12px" }}>Sign in to register your team</div>
                  <Link href="/login" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 16px", background: "var(--sp-brand)", color: "#000", borderRadius: "7px", fontWeight: 700, textDecoration: "none" }}>sign in →</Link>
                </div>
              ) : myTeams.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "var(--sp-muted)", marginBottom: "12px" }}>You need a team first</div>
                  <Link href="/teams/new" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 16px", background: "var(--sp-brand)", color: "#000", borderRadius: "7px", fontWeight: 700, textDecoration: "none" }}>+ create team →</Link>
                </div>
              ) : !myReg ? (
                /* Register */
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "5px" }}>team</div>
                    <select
                      value={selectedTeamId}
                      onChange={e => setSelectedTeamId(e.target.value)}
                      style={{ width: "100%", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "7px", padding: "8px 10px", fontFamily: "var(--sp-mono)", fontSize: "12px", color: "var(--sp-text)", outline: "none" }}
                    >
                      <option value="">select team…</option>
                      {myTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  {comp.tracks.length > 0 && (
                    <div>
                      <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "5px" }}>track</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {comp.tracks.map(t => (
                          <button key={t} type="button" onClick={() => setSelectedTrack(prev => prev === t ? "" : t)} style={{
                            fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "4px 10px",
                            background: selectedTrack === t ? "var(--sp-brand-dim)" : "var(--sp-surface2)",
                            border: `1px solid ${selectedTrack === t ? "rgba(34,197,94,0.4)" : "var(--sp-border)"}`,
                            borderRadius: "5px", color: selectedTrack === t ? "var(--sp-brand)" : "var(--sp-dim)",
                            cursor: "pointer",
                          }}>{t}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={handleRegister} disabled={!selectedTeamId || working} style={{
                    fontFamily: "var(--sp-mono)", fontSize: "12px", padding: "10px",
                    background: selectedTeamId && !working ? "var(--sp-brand)" : "var(--sp-surface2)",
                    color: selectedTeamId && !working ? "#000" : "var(--sp-dim)",
                    border: "none", borderRadius: "8px", fontWeight: 700,
                    cursor: selectedTeamId && !working ? "pointer" : "not-allowed",
                  }}>
                    {working ? "registering…" : "register team →"}
                  </button>
                </div>
              ) : (
                /* Registered — show clock-in state */
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ fontFamily: "var(--sp-mono)", fontSize: "12px", color: "var(--sp-text)", fontWeight: 600 }}>
                    {myTeams.find(t => t.id === myReg.team_id)?.name ?? "Your team"}
                  </div>
                  {myReg.track && <span className="sp-dtag">{myReg.track}</span>}

                  {isClockedIn ? (
                    <>
                      <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>⚡ clocked in · building</div>
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "24px", fontWeight: 700, color: "var(--sp-brand)" }} suppressHydrationWarning>{clockedInFor}</div>
                      </div>
                      <button onClick={handleClockOut} disabled={working} style={{
                        fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "9px",
                        background: "none", border: "1px solid rgba(244,114,182,0.3)",
                        borderRadius: "8px", color: "#f472b6", cursor: "pointer",
                      }}>
                        {working ? "…" : "clock out"}
                      </button>
                    </>
                  ) : (
                    <>
                      {myReg.clocked_out_at && (
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textAlign: "center" }}>
                          clocked out · session ended
                        </div>
                      )}
                      {status !== "ended" && (
                        <button onClick={handleClockIn} disabled={working} style={{
                          fontFamily: "var(--sp-mono)", fontSize: "12px", fontWeight: 700,
                          padding: "12px", background: "var(--sp-brand)", color: "#000",
                          border: "none", borderRadius: "8px", cursor: "pointer",
                          animation: status === "live" ? "pulse 2s ease-in-out infinite" : "none",
                        }}>
                          {working ? "…" : myReg.clocked_out_at ? "clock in again →" : "▶ clock in →"}
                        </button>
                      )}
                      {status !== "ended" && (
                        <button onClick={handleUnregister} disabled={working} style={{
                          fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "6px",
                          background: "none", border: "1px solid var(--sp-border)",
                          borderRadius: "6px", color: "var(--sp-dim)", cursor: "pointer",
                        }}>
                          {working ? "…" : "unregister"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Quick links */}
            <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "16px 18px" }}>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>quick links</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Link href="/workspace" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-brand)", textDecoration: "none" }}>▶ open workspace →</Link>
                <Link href="/teams" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-muted)", textDecoration: "none" }}>🤝 my teams →</Link>
                <Link href="/library" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-muted)", textDecoration: "none" }}>📦 component library →</Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Global dashboard */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--sp-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>global dashboard</div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>
                  {activeBuilders.length} building · {totalRegistered} registered
                </div>
              </div>
              {status === "live" && (
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", animation: "pulse 2s ease-in-out infinite" }}>
                  ● live · refreshing
                </div>
              )}
            </div>

            {registrations.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", fontFamily: "var(--sp-mono)", fontSize: "12px", color: "var(--sp-dim)" }}>
                No teams registered yet — be the first.
              </div>
            ) : (
              <div>
                {registrations.map(reg => {
                  const building = !!(reg.clocked_in_at && !reg.clocked_out_at)
                  const done = !!(reg.clocked_in_at && reg.clocked_out_at)
                  return (
                    <div key={reg.id} style={{
                      padding: "14px 22px", borderBottom: "1px solid var(--sp-border)",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                      background: building ? "rgba(34,197,94,0.025)" : "transparent",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* Status dot */}
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                          background: building ? "#22c55e" : done ? "#6b7280" : "var(--sp-border)",
                          boxShadow: building ? "0 0 6px #22c55e" : "none",
                        }} />
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: building ? 600 : 400, color: building ? "var(--sp-text)" : "var(--sp-muted)" }}>
                            {reg.team?.name ?? "Unknown Team"}
                          </div>
                          {reg.track && <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", marginTop: "1px" }}>{reg.track}</div>}
                        </div>
                      </div>
                      <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: building ? "var(--sp-brand)" : "var(--sp-dim)", textAlign: "right" }}>
                        {building ? "building" : done ? "submitted" : "registered"}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="sp-footer">
        <div className="sp-foot-l"><span>⚡</span><span>codefest.ai</span><span>·</span><span>throughline systems llc</span></div>
        <div className="sp-foot-r">built for builders · © 2026</div>
      </footer>
    </div>
  )
}
