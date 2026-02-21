"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { getMyTeams } from "@/lib/teams"
import type { TeamWithMembers } from "@/lib/supabase/types"

const ROLE_COLORS: Record<string, string> = {
  Lead: "#22c55e",
  Frontend: "#22d3ee",
  Backend: "#60a5fa",
  "AI/ML": "#a78bfa",
  Design: "#f472b6",
  Pitch: "#fbbf24",
  Member: "#6b7280",
}

export default function TeamsPage() {
  const { user, signOut } = useAuth()
  const [teams, setTeams] = useState<TeamWithMembers[]>([])
  const [loading, setLoading] = useState(true)
  const [clock, setClock] = useState("")

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
    if (user) {
      getMyTeams().then((data) => {
        setTeams(data)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [user])

  // Get current user's role in a team
  const myRole = (team: TeamWithMembers) =>
    team.members.find((m) => m.user_id === user?.id)?.role ?? "Member"

  return (
    <div className="sp-page">
      {/* ── HEADER ── */}
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)" }}>
          <span style={{ color: "var(--sp-brand)", fontWeight: 600 }}>teams</span>
          <span>·</span>
          <span><span className="sp-status-dot" />live</span>
          <span suppressHydrationWarning>{clock}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/" className="sp-hdr-link">← home</Link>
          <Link href="/teams/join" className="sp-hdr-link">join by code</Link>
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
      <main style={{ paddingTop: "50px", maxWidth: "900px", margin: "0 auto", padding: "70px 2rem 4rem" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
              02 · teams
            </div>
            <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
              Your Teams
            </h1>
            <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6 }}>
              Form your crew, assign roles, share your stack.
            </p>
          </div>
          {user && (
            <div style={{ display: "flex", gap: "10px" }}>
              <Link
                href="/teams/join"
                style={{
                  fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 16px",
                  background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
                  borderRadius: "8px", color: "var(--sp-dim)", textDecoration: "none",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                join by code ↗
              </Link>
              <Link
                href="/teams/new"
                style={{
                  fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 18px",
                  background: "var(--sp-brand)", border: "none",
                  borderRadius: "8px", color: "#000", fontWeight: 700, textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                + new team
              </Link>
            </div>
          )}
        </div>

        {/* Content */}
        {!user ? (
          /* Not signed in */
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            background: "var(--sp-surface)", border: "1px solid var(--sp-border)",
            borderRadius: "16px",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🤝</div>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "14px", color: "var(--sp-text)", marginBottom: "8px", fontWeight: 600 }}>
              Sign in to form or join teams
            </div>
            <div style={{ fontSize: "12px", color: "var(--sp-muted)", marginBottom: "1.5rem" }}>
              Create a team, invite teammates, assign roles, and build together.
            </div>
            <Link
              href="/login"
              style={{
                display: "inline-block", fontFamily: "var(--sp-mono)", fontSize: "12px",
                padding: "9px 20px", background: "var(--sp-brand)", color: "#000",
                borderRadius: "8px", fontWeight: 700, textDecoration: "none",
              }}
            >
              sign in with google →
            </Link>
          </div>
        ) : loading ? (
          /* Loading */
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ height: "120px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : teams.length === 0 ? (
          /* No teams yet */
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            background: "var(--sp-surface)", border: "1px solid var(--sp-border)",
            borderRadius: "16px",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚀</div>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "14px", color: "var(--sp-text)", marginBottom: "8px", fontWeight: 600 }}>
              No teams yet
            </div>
            <div style={{ fontSize: "12px", color: "var(--sp-muted)", marginBottom: "1.5rem" }}>
              Start a team or join one with an invite code.
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <Link
                href="/teams/join"
                style={{
                  fontFamily: "var(--sp-mono)", fontSize: "12px", padding: "9px 18px",
                  background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
                  borderRadius: "8px", color: "var(--sp-dim)", textDecoration: "none",
                }}
              >
                join by code
              </Link>
              <Link
                href="/teams/new"
                style={{
                  fontFamily: "var(--sp-mono)", fontSize: "12px", padding: "9px 18px",
                  background: "var(--sp-brand)", color: "#000",
                  borderRadius: "8px", fontWeight: 700, textDecoration: "none",
                }}
              >
                + create team
              </Link>
            </div>
          </div>
        ) : (
          /* Team list */
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {teams.map((team) => {
              const role = myRole(team)
              return (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "var(--sp-surface)", border: "1px solid var(--sp-border)",
                      borderLeft: `3px solid ${ROLE_COLORS[role] ?? "var(--sp-brand)"}`,
                      borderRadius: "12px", padding: "20px 24px",
                      cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
                    }}
                    className="ws-card-hover"
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em" }}>{team.name}</span>
                          <span style={{
                            fontFamily: "var(--sp-mono)", fontSize: "9px", padding: "2px 7px",
                            borderRadius: "4px", border: `1px solid ${ROLE_COLORS[role]}40`,
                            color: ROLE_COLORS[role] ?? "var(--sp-brand)",
                            background: `${ROLE_COLORS[role] ?? "var(--sp-brand)"}12`,
                          }}>
                            {role}
                          </span>
                        </div>
                        {team.hackathon_name && (
                          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", marginBottom: "6px" }}>
                            {team.hackathon_name}
                          </div>
                        )}
                        {team.description && (
                          <div style={{ fontSize: "12px", color: "var(--sp-muted)", lineHeight: 1.5 }}>
                            {team.description}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                        {/* Member avatars */}
                        <div style={{ display: "flex", gap: "4px" }}>
                          {team.members.slice(0, 5).map((member) => (
                            <div
                              key={member.id}
                              title={`${member.profile?.full_name ?? member.profile?.email ?? "Member"} · ${member.role}`}
                              style={{
                                width: "28px", height: "28px", borderRadius: "50%",
                                background: `${ROLE_COLORS[member.role] ?? "#6b7280"}25`,
                                border: `2px solid ${ROLE_COLORS[member.role] ?? "#6b7280"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "10px", fontWeight: 700, color: ROLE_COLORS[member.role] ?? "#6b7280",
                                overflow: "hidden",
                              }}
                            >
                              {member.profile?.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={member.profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                (member.profile?.full_name ?? member.profile?.email ?? "?")[0].toUpperCase()
                              )}
                            </div>
                          ))}
                          {team.member_count > 5 && (
                            <div style={{
                              width: "28px", height: "28px", borderRadius: "50%",
                              background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)",
                            }}>
                              +{team.member_count - 5}
                            </div>
                          )}
                        </div>
                        <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                          {team.member_count} member{team.member_count !== 1 ? "s" : ""} →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}

            {/* Create another */}
            <Link href="/teams/new" style={{ textDecoration: "none" }}>
              <div style={{
                border: "1px dashed var(--sp-border)", borderRadius: "12px",
                padding: "20px 24px", textAlign: "center", cursor: "pointer",
                transition: "border-color 0.15s", color: "var(--sp-dim)",
                fontFamily: "var(--sp-mono)", fontSize: "12px",
              }}
                className="ws-card-hover"
              >
                + create another team
              </div>
            </Link>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="sp-footer">
        <div className="sp-foot-l">
          <span>⚡</span><span>codefest.ai</span><span>·</span><span>throughline systems llc</span>
        </div>
        <div className="sp-foot-r">built for builders · © 2026</div>
      </footer>
    </div>
  )
}
