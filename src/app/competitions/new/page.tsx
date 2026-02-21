"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { createCompetition } from "@/lib/competitions"

const SUGGESTED_TRACKS = ["Climate", "Health", "Civic", "Education", "Finance", "Food", "Energy", "Open"]

export default function NewCompetitionPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [tracks, setTracks] = useState<string[]>(["Open"])
  const [customTrack, setCustomTrack] = useState("")
  const [prizePool, setPrizePool] = useState("")
  const [maxTeamSize, setMaxTeamSize] = useState(5)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleTrack = (t: string) => setTracks(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  )

  const addCustomTrack = () => {
    const t = customTrack.trim()
    if (t && !tracks.includes(t)) { setTracks(prev => [...prev, t]); setCustomTrack("") }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !startTime || !endTime) return
    if (new Date(endTime) <= new Date(startTime)) {
      setError("End time must be after start time")
      return
    }
    setSaving(true)
    setError(null)

    const comp = await createCompetition({
      name: name.trim(),
      description: description.trim() || null,
      location: location.trim() || null,
      website_url: websiteUrl.trim() || null,
      start_time: startTime,
      end_time: endTime,
      tracks,
      prize_pool: prizePool.trim() || null,
      max_team_size: maxTeamSize,
    })

    if (comp) {
      router.push(`/competitions/${comp.id}`)
    } else {
      setError("Failed to create competition — please try again")
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "var(--sp-surface2)", border: "1px solid var(--sp-border)",
    borderRadius: "8px", padding: "9px 13px",
    fontFamily: "inherit", fontSize: "13px", color: "var(--sp-text)", outline: "none",
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)",
    textTransform: "uppercase" as const, letterSpacing: "0.12em",
    display: "block", marginBottom: "5px",
  }

  return (
    <div className="sp-page">
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>
        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-brand)", fontWeight: 600 }}>
          new competition
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

      <main style={{ paddingTop: "50px", maxWidth: "620px", margin: "0 auto", padding: "70px 2rem 4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
            add hackathon
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.03em" }}>New Competition</h1>
        </div>

        {!user ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "13px", color: "var(--sp-muted)", marginBottom: "1.5rem" }}>Sign in to add a competition</div>
            <Link href="/login" style={{ display: "inline-block", fontFamily: "var(--sp-mono)", fontSize: "12px", padding: "9px 20px", background: "var(--sp-brand)", color: "#000", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>sign in →</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>Competition name *</label>
                <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. HackMIT 2026" required autoFocus />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Theme, focus areas, who it's for…" />
              </div>

              {/* Location + website */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={location} onChange={e => setLocation(e.target.value)} placeholder="MIT · Cambridge MA or Online" />
                </div>
                <div>
                  <label style={labelStyle}>Website</label>
                  <input style={inputStyle} value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://hackmit.org" type="url" />
                </div>
              </div>

              {/* Times */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Start time *</label>
                  <input style={{ ...inputStyle, colorScheme: "dark" }} type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>End time *</label>
                  <input style={{ ...inputStyle, colorScheme: "dark" }} type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                </div>
              </div>

              {/* Tracks */}
              <div>
                <label style={labelStyle}>Tracks</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                  {SUGGESTED_TRACKS.map(t => (
                    <button key={t} type="button" onClick={() => toggleTrack(t)} style={{
                      fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "4px 10px",
                      background: tracks.includes(t) ? "var(--sp-brand-dim)" : "var(--sp-surface2)",
                      border: `1px solid ${tracks.includes(t) ? "rgba(34,197,94,0.4)" : "var(--sp-border)"}`,
                      borderRadius: "6px", color: tracks.includes(t) ? "var(--sp-brand)" : "var(--sp-dim)",
                      cursor: "pointer", transition: "all 0.12s",
                    }}>{t}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input style={{ ...inputStyle, flex: 1 }} placeholder="+ custom track" value={customTrack} onChange={e => setCustomTrack(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomTrack() } }} />
                  <button type="button" onClick={addCustomTrack} style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "8px 12px", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "7px", color: "var(--sp-dim)", cursor: "pointer" }}>add</button>
                </div>
                {tracks.filter(t => !SUGGESTED_TRACKS.includes(t)).map(t => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "6px", marginRight: "5px", fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "3px 8px", background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "5px", color: "var(--sp-brand)" }}>
                    {t} <button type="button" onClick={() => setTracks(p => p.filter(x => x !== t))} style={{ background: "none", border: "none", color: "var(--sp-brand)", cursor: "pointer", padding: 0, fontSize: "12px" }}>×</button>
                  </span>
                ))}
              </div>

              {/* Prize + team size */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Prize pool</label>
                  <input style={inputStyle} value={prizePool} onChange={e => setPrizePool(e.target.value)} placeholder="$10,000" />
                </div>
                <div>
                  <label style={labelStyle}>Max team size</label>
                  <input style={inputStyle} type="number" min={1} max={10} value={maxTeamSize} onChange={e => setMaxTeamSize(Number(e.target.value))} />
                </div>
              </div>

              {error && (
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "#f472b6", padding: "8px 12px", background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: "6px" }}>⚠ {error}</div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
                <Link href="/competitions" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "9px 18px", background: "none", border: "1px solid var(--sp-border)", borderRadius: "8px", color: "var(--sp-dim)", textDecoration: "none" }}>cancel</Link>
                <button type="submit" disabled={!name.trim() || !startTime || !endTime || saving} style={{
                  fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "9px 22px",
                  background: name.trim() && startTime && endTime && !saving ? "var(--sp-brand)" : "var(--sp-surface2)",
                  color: name.trim() && startTime && endTime && !saving ? "#000" : "var(--sp-dim)",
                  border: "none", borderRadius: "8px", fontWeight: 700,
                  cursor: name.trim() && startTime && endTime && !saving ? "pointer" : "not-allowed",
                }}>
                  {saving ? "creating…" : "create →"}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <footer className="sp-footer">
        <div className="sp-foot-l"><span>⚡</span><span>codefest.ai</span><span>·</span><span>throughline systems llc</span></div>
        <div className="sp-foot-r">built for builders · © 2026</div>
      </footer>
    </div>
  )
}
