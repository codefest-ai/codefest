"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { getTeam, leaveTeam, updateMyRole } from "@/lib/teams"
import type { TeamWithMembers, TeamRole } from "@/lib/supabase/types"

const ROLES: TeamRole[] = ["Lead", "Frontend", "Backend", "AI/ML", "Design", "Pitch", "Member"]

const ROLE_COLORS: Record<string, string> = {
  Lead: "#22c55e",
  Frontend: "#22d3ee",
  Backend: "#60a5fa",
  "AI/ML": "#a78bfa",
  Design: "#f472b6",
  Pitch: "#fbbf24",
  Member: "#6b7280",
}

const ROLE_EMOJI: Record<string, string> = {
  Lead: "⚡",
  Frontend: "🎨",
  Backend: "⚙️",
  "AI/ML": "🤖",
  Design: "✏️",
  Pitch: "🎤",
  Member: "👤",
}

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [team, setTeam] = useState<TeamWithMembers | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [leavingConfirm, setLeavingConfirm] = useState(false)
  const [clock, setClock] = useState("")

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setClock(n.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    getTeam(id).then((data) => {
      setTeam(data)
      setLoading(false)
    })
  }, [id])

  const myMembership = team?.members.find((m) => m.user_id === user?.id)
  const isLead = myMembership?.role === "Lead"
  const isMember = !!myMembership

  const copyInviteCode = () => {
    if (!team) return
    navigator.clipboard.writeText(team.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRoleChange = async (newRole: TeamRole) => {
    if (!team) return
    const ok = await updateMyRole(team.id, newRole)
    if (ok) {
      const refreshed = await getTeam(id)
      setTeam(refreshed)
    }
  }

  const handleLeave = async () => {
    if (!team || !leavingConfirm) {
      setLeavingConfirm(true)
      setTimeout(() => setLeavingConfirm(false), 4000)
      return
    }
    const ok = await leaveTeam(team.id)
    if (ok) router.push("/teams")
  }

  if (loading) {
    return (
      <div className="sp-page">
        <header className="sp-header">
          <Link href="/" className="sp-logo"><div className="sp-logo-mark">⚡</div><span className="sp-logo-name">codefest<em>.ai</em></span></Link>
          <div />
          <Link href="/teams" className="sp-hdr-link">← teams</Link>
        </header>
        <main style={{ paddingTop: "50px", maxWidth: "860px", margin: "0 auto", padding: "70px 2rem 4rem" }}>
          <div style={{ height: "200px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "16px" }} />
        </main>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="sp-page">
        <header className="sp-header">
          <Link href="/" className="sp-logo"><div className="sp-logo-mark">⚡</div><span className="sp-logo-name">codefest<em>.ai</em></span></Link>
          <div />
          <Link href="/teams" className="sp-hdr-link">← teams</Link>
        </header>
        <main style={{ paddingTop: "50px", maxWidth: "860px", margin: "0 auto", padding: "70px 2rem 4rem", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "13px", color: "var(--sp-muted)" }}>Team not found.</div>
          <Link href="/teams" style={{ display: "inline-block", marginTop: "1rem", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-brand)" }}>← back to teams</Link>
        </main>
      </div>
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
          <span style={{ color: "var(--sp-brand)", fontWeight: 600 }}>{team.name}</span>
          <span>·</span>
          <span suppressHydrationWarning>{clock}</span>
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

      <main style={{ paddingTop: "50px", maxWidth: "860px", margin: "0 auto", padding: "70px 2rem 4rem" }}>

        {/* Team header card */}
        <div style={{
          background: "var(--sp-surface)", border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: "16px", padding: "28px 32px", marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
            <div>
              {team.hackathon_name && (
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>
                  {team.hackathon_name}
                </div>
              )}
              <h1 style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "8px" }}>
                {team.name}
              </h1>
              {team.description && (
                <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6, maxWidth: "480px" }}>
                  {team.description}
                </p>
              )}
            </div>

            {/* Invite code */}
            <div style={{
              background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
              borderRadius: "10px", padding: "14px 18px", textAlign: "center", flexShrink: 0,
            }}>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                invite code
              </div>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "22px", fontWeight: 700, color: "var(--sp-brand)", letterSpacing: "0.1em", marginBottom: "8px" }}>
                {team.invite_code.toUpperCase()}
              </div>
              <button
                onClick={copyInviteCode}
                style={{
                  fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "5px 12px",
                  background: copied ? "var(--sp-brand)" : "var(--sp-surface)",
                  border: "1px solid var(--sp-border)", borderRadius: "6px",
                  color: copied ? "#000" : "var(--sp-dim)", cursor: "pointer",
                  transition: "all 0.15s", fontWeight: copied ? 700 : 400,
                }}
              >
                {copied ? "copied!" : "copy ↗"}
              </button>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px", alignItems: "start" }}>

          {/* Members */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--sp-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>members</div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{team.member_count} / {team.member_count > 1 ? team.member_count : "—"}</div>
              </div>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                roles assigned below
              </div>
            </div>

            {team.members.map((member) => {
              const isMe = member.user_id === user?.id
              const color = ROLE_COLORS[member.role] ?? "#6b7280"
              const emoji = ROLE_EMOJI[member.role] ?? "👤"
              const name = member.profile?.full_name ?? member.profile?.email?.split("@")[0] ?? "Unknown"

              return (
                <div
                  key={member.id}
                  style={{
                    padding: "14px 22px", display: "flex", alignItems: "center", gap: "14px",
                    borderBottom: "1px solid var(--sp-border)",
                    background: isMe ? "rgba(34,197,94,0.025)" : "transparent",
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                    background: `${color}20`, border: `2px solid ${color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color, overflow: "hidden",
                  }}>
                    {member.profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : name[0].toUpperCase()}
                  </div>

                  {/* Name + email */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: isMe ? 600 : 400, color: isMe ? "var(--sp-text)" : "var(--sp-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                      {name}
                      {isMe && <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "3px", padding: "1px 5px" }}>you</span>}
                      {member.profile?.is_edu && <span title=".edu" style={{ fontSize: "10px" }}>🎓</span>}
                    </div>
                    {member.profile?.email && (
                      <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginTop: "1px" }}>
                        {member.profile.email}
                      </div>
                    )}
                  </div>

                  {/* Role badge / selector */}
                  {isMe ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(e.target.value as TeamRole)}
                      style={{
                        fontFamily: "var(--sp-mono)", fontSize: "10px",
                        background: `${color}15`, border: `1px solid ${color}40`,
                        borderRadius: "6px", padding: "4px 8px", color,
                        cursor: "pointer", outline: "none",
                      }}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_EMOJI[r]} {r}</option>)}
                    </select>
                  ) : (
                    <span style={{
                      fontFamily: "var(--sp-mono)", fontSize: "10px",
                      background: `${color}15`, border: `1px solid ${color}30`,
                      borderRadius: "6px", padding: "4px 10px", color,
                    }}>
                      {emoji} {member.role}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Role legend */}
            <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "14px", padding: "18px 20px" }}>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                available roles
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {ROLES.map((r) => (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px" }}>{ROLE_EMOJI[r]}</span>
                    <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: ROLE_COLORS[r] }}>{r}</span>
                  </div>
                ))}
              </div>
              {isMember && (
                <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--sp-border)", fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                  Change your role using the dropdown next to your name →
                </div>
              )}
            </div>

            {/* Project board shortcut */}
            <Link href={`/teams/${id}/project`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "14px", padding: "16px 20px", cursor: "pointer",
                transition: "border-color 0.15s",
              }}
                className="ws-card-hover"
              >
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                  📋 project board
                </div>
                <div style={{ fontSize: "13px", color: "var(--sp-text)", fontWeight: 600 }}>Open kanban →</div>
                <div style={{ fontSize: "11px", color: "var(--sp-dim)", marginTop: "4px" }}>
                  Set up your project, assign tasks, track progress.
                </div>
              </div>
            </Link>

            {/* Workspace shortcut */}
            <Link href="/workspace" style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
                borderRadius: "14px", padding: "16px 20px", cursor: "pointer",
                transition: "border-color 0.15s",
              }}
                className="ws-card-hover"
              >
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                  ▶ workspace
                </div>
                <div style={{ fontSize: "13px", color: "var(--sp-text)", fontWeight: 600 }}>Build your stack →</div>
                <div style={{ fontSize: "11px", color: "var(--sp-dim)", marginTop: "4px" }}>
                  Pick domain, components, SDGs.
                </div>
              </div>
            </Link>

            {/* Leave team */}
            {isMember && !isLead && (
              <button
                onClick={handleLeave}
                style={{
                  fontFamily: "var(--sp-mono)", fontSize: "10px",
                  padding: "9px 14px", background: "none",
                  border: `1px solid ${leavingConfirm ? "rgba(244,114,182,0.4)" : "var(--sp-border)"}`,
                  borderRadius: "8px",
                  color: leavingConfirm ? "#f472b6" : "var(--sp-dim)",
                  cursor: "pointer", width: "100%", transition: "all 0.2s",
                }}
              >
                {leavingConfirm ? "click again to confirm leave" : "leave team"}
              </button>
            )}

            {isLead && (
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textAlign: "center", padding: "8px" }}>
                You&apos;re the Lead — transfer or disband coming in a future update.
              </div>
            )}
          </div>
        </div>
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
