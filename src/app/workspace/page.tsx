"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import componentsData from "@/data/components_seed.json"
import { DOMAINS, PATTERNS, SDGS, GO_QUESTIONS, RECS, CATEGORIES, CAT_COLORS, DIFF_COLORS } from "@/data/constants"


type Component = {
  name: string; category: string; description: string;
  github_url?: string; docs_url?: string;
  setup_time_minutes: number; difficulty: string; tags: string[];
}
const ALL_COMPONENTS: Component[] = (componentsData as { components: Component[] }).components

// ── PANEL CONFIG ──────────────────────────────────────────────

const PANELS = [
  { id: "domain",   num: "01", icon: "🌍", title: "Challenge Domain",  sub: "What are you building for?" },
  { id: "patterns", num: "02", icon: "🏆", title: "Winning Patterns",  sub: "What worked at real hackathons." },
  { id: "stack",    num: "03", icon: "📦", title: "Component Stack",   sub: "Pick your tools." },
  { id: "gomode",   num: "04", icon: "▶",  title: "GO! Mode",         sub: "3 questions → 1 recommendation." },
  { id: "impact",   num: "05", icon: "🎯", title: "Impact Alignment",  sub: "Lock in your SDG angle." },
]

// ── COMPONENT ────────────────────────────────────────────────

export default function WorkspacePage() {
  const { user, signOut } = useAuth()

  // Which panels are open
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set(["domain"]))

  // Session state — what you've picked
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set())
  const [selectedSDGs, setSelectedSDGs] = useState<Set<string>>(new Set())
  const [goState, setGoState] = useState<Record<string, string>>({})

  // Library search/filter within the stack panel
  const [stackSearch, setStackSearch] = useState("")
  const [stackFilter, setStackFilter] = useState<string | null>(null)

  // Clock
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

  // ── LOCALSTORAGE: load session on mount ─────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('codefest-session')
      if (saved) {
        const s = JSON.parse(saved)
        if (s.selectedDomain) setSelectedDomain(s.selectedDomain)
        if (s.selectedComponents) setSelectedComponents(new Set(s.selectedComponents))
        if (s.selectedSDGs) setSelectedSDGs(new Set(s.selectedSDGs))
        if (s.goState) setGoState(s.goState)
        if (s.openPanels) setOpenPanels(new Set(s.openPanels))
      }
    } catch {}
  }, [])

  // ── LOCALSTORAGE: save session on change ────────────────────
  useEffect(() => {
    const isEmpty = !selectedDomain && selectedComponents.size === 0 && selectedSDGs.size === 0 && !goState.q1
    if (isEmpty) return
    try {
      localStorage.setItem('codefest-session', JSON.stringify({
        selectedDomain,
        selectedComponents: [...selectedComponents],
        selectedSDGs: [...selectedSDGs],
        goState,
        openPanels: [...openPanels],
      }))
    } catch {}
  }, [selectedDomain, selectedComponents, selectedSDGs, goState, openPanels])

  // ── HANDLERS ────────────────────────────────────────────────

  const togglePanel = (id: string) => {
    setOpenPanels(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const pickDomain = (name: string) => {
    setSelectedDomain(name)
    // auto-open patterns after picking domain
    setOpenPanels(prev => new Set([...prev, "patterns"]))
  }

  const toggleComponent = (name: string) => {
    setSelectedComponents(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const toggleSDG = (name: string) => {
    setSelectedSDGs(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const handlePickGo = (key: string, val: string) => {
    setGoState(prev => {
      const next = { ...prev, [key]: val }
      if (key === "q1") { delete next.q2; delete next.q3 }
      if (key === "q2") { delete next.q3 }
      return next
    })
  }

  const getGoRec = () => {
    if (!goState.q3) return null
    if (goState.q3.includes("Climate")) return RECS.climate
    if (goState.q3.includes("Health")) return RECS.health
    if (goState.q3.includes("Civic")) return RECS.civic
    return RECS.default
  }

  const addRecToStack = (rec: { stack: string[] }) => {
    rec.stack.forEach(s => {
      const match = ALL_COMPONENTS.find(c => c.name.toLowerCase().includes(s.toLowerCase()))
      if (match) setSelectedComponents(prev => new Set([...prev, match.name]))
    })
  }

  const filteredComponents = ALL_COMPONENTS.filter(c => {
    if (stackFilter && c.category !== stackFilter) return false
    if (stackSearch) {
      const q = stackSearch.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some(t => t.includes(q))
    }
    return true
  })

  const sessionEmpty = !selectedDomain && selectedComponents.size === 0 && selectedSDGs.size === 0 && !goState.q1
  const rec = getGoRec()

  // ── RENDER ───────────────────────────────────────────────────

  return (
    <div className="sp-page" style={{ paddingBottom: sessionEmpty ? 0 : "80px" }}>

      {/* ── HEADER ── */}
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)" }}>
          <span style={{ color: "var(--sp-brand)", fontWeight: 600 }}>workspace</span>
          <span>·</span>
          <span><span className="sp-status-dot" />session active</span>
          <span suppressHydrationWarning>{clock}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/" className="sp-hdr-link">← browse</Link>
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
      <main style={{ paddingTop: "50px", maxWidth: "860px", margin: "0 auto", padding: "70px 2rem 2rem" }}>

        {/* Page header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
            hackathon session workspace
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Build your session.
          </h1>
          <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6 }}>
            Click any panel to open it. Your picks accumulate in the session bar at the bottom.
          </p>
        </div>

        {/* ── ACCORDION PANELS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {PANELS.map(panel => {
            const isOpen = openPanels.has(panel.id)
            const hasPick = (
              (panel.id === "domain" && selectedDomain) ||
              (panel.id === "stack" && selectedComponents.size > 0) ||
              (panel.id === "impact" && selectedSDGs.size > 0) ||
              (panel.id === "gomode" && goState.q3) ||
              (panel.id === "patterns" && false)
            )

            return (
              <div key={panel.id} className="ws-panel" style={{ background: "var(--sp-surface)", border: `1px solid ${isOpen ? "rgba(34,197,94,0.2)" : "var(--sp-border)"}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s" }}>

                {/* Panel header — always visible, click to toggle */}
                <div
                  onClick={() => togglePanel(panel.id)}
                  style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", cursor: "pointer", userSelect: "none" }}
                  className="ws-panel-hdr"
                >
                  <span style={{ fontSize: "18px" }}>{panel.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", letterSpacing: "0.1em" }}>{panel.num}</span>
                      <span style={{ fontWeight: 600, fontSize: "14px", letterSpacing: "-0.01em" }}>{panel.title}</span>
                      {hasPick && (
                        <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "4px", padding: "1px 7px" }}>
                          {panel.id === "domain" && selectedDomain?.split(" ").slice(0, 2).join(" ")}
                          {panel.id === "stack" && `${selectedComponents.size} selected`}
                          {panel.id === "impact" && `${selectedSDGs.size} selected`}
                          {panel.id === "gomode" && "done"}
                        </span>
                      )}
                    </div>
                    {!isOpen && <div style={{ fontSize: "11px", color: "var(--sp-dim)", marginTop: "2px" }}>{panel.sub}</div>}
                  </div>
                  <span style={{ fontFamily: "var(--sp-mono)", fontSize: "14px", color: isOpen ? "var(--sp-brand)" : "var(--sp-dim)", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>›</span>
                </div>

                {/* Panel body — only shown when open */}
                {isOpen && (
                  <div style={{ padding: "0 20px 24px", borderTop: "1px solid var(--sp-border)" }}>

                    {/* ── DOMAIN PANEL ── */}
                    {panel.id === "domain" && (
                      <div style={{ paddingTop: "18px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "8px" }}>
                          {DOMAINS.map(d => (
                            <div
                              key={d.n}
                              onClick={() => pickDomain(d.n)}
                              style={{
                                background: selectedDomain === d.n ? "rgba(34,197,94,0.07)" : "var(--sp-surface2)",
                                border: `1px solid ${selectedDomain === d.n ? "rgba(34,197,94,0.35)" : "var(--sp-border)"}`,
                                borderRadius: "10px", padding: "14px", cursor: "pointer", transition: "all 0.15s",
                              }}
                              className="ws-card-hover"
                            >
                              <div style={{ fontSize: "18px", marginBottom: "6px" }}>{d.e}</div>
                              <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", letterSpacing: "-0.01em", color: selectedDomain === d.n ? "var(--sp-brand)" : "var(--sp-text)" }}>{d.n}</div>
                              <div style={{ fontSize: "11px", color: "var(--sp-muted)", lineHeight: 1.5, marginBottom: "8px" }}>{d.d}</div>
                              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                {d.tags.map(t => <span key={t} className="sp-dtag">{t}</span>)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── PATTERNS PANEL ── */}
                    {panel.id === "patterns" && (
                      <div style={{ paddingTop: "18px" }}>
                        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
                          {PATTERNS.map(p => (
                            <div key={p.n} className="sp-pattern-card" style={{ flex: "0 0 300px" }}>
                              <span className="sp-pattern-badge">{p.pl}</span>
                              <div className="sp-pattern-event">{p.ev} · {p.dom}</div>
                              <div className="sp-pattern-name">{p.n}</div>
                              <div className="sp-pattern-desc">{p.d}</div>
                              <div className="sp-pattern-stack">
                                {p.stack.map(s => {
                                  const inLib = ALL_COMPONENTS.find(c => c.name.toLowerCase().includes(s.toLowerCase()))
                                  return (
                                    <span
                                      key={s}
                                      className="sp-spill"
                                      style={inLib && selectedComponents.has(inLib.name) ? { borderColor: "var(--sp-brand)", color: "var(--sp-brand)", background: "var(--sp-brand-dim)" } : {}}
                                      onClick={() => inLib && toggleComponent(inLib.name)}
                                    >
                                      {s}{inLib && selectedComponents.has(inLib.name) ? " ✓" : ""}
                                    </span>
                                  )
                                })}
                              </div>
                              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                {p.sdgs.map(s => <span key={s} className="sp-sdg-chip">{s}</span>)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: "12px", fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                          Click any component pill to add it to your stack
                        </div>
                      </div>
                    )}

                    {/* ── STACK PANEL ── */}
                    {panel.id === "stack" && (
                      <div style={{ paddingTop: "18px" }}>
                        {/* Controls */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px", alignItems: "center" }}>
                          <div className="sp-search-wrap" style={{ width: "220px" }}>
                            <span className="sp-search-prompt">&gt;</span>
                            <input
                              className="sp-search-input"
                              placeholder="search…"
                              value={stackSearch}
                              onChange={e => setStackSearch(e.target.value)}
                            />
                          </div>
                          <span className="sp-flabel">filter</span>
                          {CATEGORIES.map(cat => (
                            <button
                              key={cat}
                              className={`sp-fpill${stackFilter === cat ? " sp-on" : ""}`}
                              style={{ color: stackFilter === cat ? CAT_COLORS[cat] : undefined }}
                              onClick={() => setStackFilter(prev => prev === cat ? null : cat)}
                            >
                              {cat}
                            </button>
                          ))}
                          {selectedComponents.size > 0 && (
                            <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", marginLeft: "auto" }}>
                              {selectedComponents.size} in stack
                            </span>
                          )}
                        </div>

                        {/* Component grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "8px" }}>
                          {filteredComponents.map(c => {
                            const selected = selectedComponents.has(c.name)
                            return (
                              <div
                                key={c.name}
                                onClick={() => toggleComponent(c.name)}
                                style={{
                                  background: selected ? "rgba(34,197,94,0.06)" : "var(--sp-surface2)",
                                  border: `1px solid ${selected ? "rgba(34,197,94,0.3)" : "var(--sp-border)"}`,
                                  borderLeft: `2px solid ${selected ? "var(--sp-brand)" : "transparent"}`,
                                  borderRadius: "10px", padding: "14px", cursor: "pointer", transition: "all 0.15s",
                                }}
                                className="ws-card-hover"
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px" }}>
                                  <span style={{ fontWeight: 600, fontSize: "12px", color: selected ? "var(--sp-brand)" : "var(--sp-text)" }}>{c.name}</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: CAT_COLORS[c.category] }}>{c.category}</span>
                                    {selected && <span style={{ color: "var(--sp-brand)", fontSize: "11px" }}>✓</span>}
                                  </div>
                                </div>
                                <div style={{ fontSize: "11px", color: "var(--sp-muted)", lineHeight: 1.5, marginBottom: "8px" }}>{c.description}</div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--sp-border)" }}>
                                  <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>
                                    ⏱ {c.setup_time_minutes}min · <span style={{ color: DIFF_COLORS[c.difficulty] }}>{c.difficulty}</span>
                                  </span>
                                  <div style={{ display: "flex", gap: "8px" }}>
                                    {c.github_url && <a className="sp-clink" href={c.github_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>GitHub↗</a>}
                                    {c.docs_url && <a className="sp-clink" href={c.docs_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>Docs↗</a>}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* ── GO! MODE PANEL ── */}
                    {panel.id === "gomode" && (
                      <div style={{ paddingTop: "18px", maxWidth: "600px" }}>
                        {GO_QUESTIONS.map(({ key, q, opts }, i) => {
                          const prevKey = i > 0 ? GO_QUESTIONS[i - 1].key : null
                          const locked = i > 0 && !goState[prevKey!]
                          return (
                            <div key={key} className={`sp-go-step${locked ? " sp-locked" : ""}`}>
                              <div className="sp-go-q">{q}</div>
                              <div className="sp-go-opts">
                                {opts.map(o => (
                                  <div
                                    key={o}
                                    className={`sp-go-opt${goState[key] === o ? " sp-sel" : ""}`}
                                    onClick={() => !locked && handlePickGo(key, o)}
                                  >
                                    {o}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}

                        {rec && (
                          <div className="sp-go-result">
                            <div className="sp-go-result-eye">⚡ recommended stack</div>
                            <div className="sp-go-result-title">{rec.title}</div>
                            <div className="sp-go-result-desc">{rec.desc}</div>
                            <div className="sp-go-stack">
                              {rec.stack.map(s => (
                                <span key={s} className="sp-spill" onClick={() => {
                                  const match = ALL_COMPONENTS.find(c => c.name.toLowerCase().includes(s.toLowerCase()))
                                  if (match) toggleComponent(match.name)
                                }}>{s}</span>
                              ))}
                            </div>
                            <button
                              onClick={() => addRecToStack(rec)}
                              style={{ marginTop: "12px", fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "7px 14px", background: "var(--sp-brand)", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}
                            >
                              + add all to stack
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── IMPACT PANEL ── */}
                    {panel.id === "impact" && (
                      <div style={{ paddingTop: "18px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "7px" }}>
                          {SDGS.map(s => {
                            const selected = selectedSDGs.has(s.name)
                            return (
                              <div
                                key={s.n}
                                onClick={() => toggleSDG(s.name)}
                                className="sp-sdg-card"
                                style={selected ? { borderColor: "rgba(96,165,250,0.5)", background: "rgba(96,165,250,0.08)" } : {}}
                              >
                                <span className="sp-sdg-n">{s.n}</span>
                                <div>
                                  <div className="sp-sdg-name" style={{ color: selected ? "var(--sp-blue)" : undefined }}>{s.name}</div>
                                  {selected && <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-blue)" }}>selected ✓</div>}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )
          })}
        </div>

      </main>

      {/* ── SESSION BAR (fixed bottom) ── */}
      {!sessionEmpty && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 300,
          background: "rgba(13,17,23,0.96)", backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(34,197,94,0.2)",
          padding: "12px 2rem", display: "flex", alignItems: "center", gap: "16px",
          flexWrap: "wrap",
        }}>
          <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>
            ⚡ session
          </span>

          {selectedDomain && (
            <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "3px 9px", background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "5px", color: "var(--sp-brand)", whiteSpace: "nowrap" }}>
              🌍 {selectedDomain}
            </span>
          )}

          {selectedComponents.size > 0 && (
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {[...selectedComponents].map(name => (
                <span
                  key={name}
                  className="sp-spill"
                  style={{ borderColor: "rgba(34,197,94,0.25)", color: "var(--sp-text)" }}
                  onClick={() => toggleComponent(name)}
                  title="click to remove"
                >
                  {name} ×
                </span>
              ))}
            </div>
          )}

          {selectedSDGs.size > 0 && (
            <div style={{ display: "flex", gap: "5px" }}>
              {[...selectedSDGs].map(name => (
                <span key={name} className="sp-sdg-chip" style={{ cursor: "pointer" }} onClick={() => toggleSDG(name)}>{name} ×</span>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setSelectedDomain(null)
              setSelectedComponents(new Set())
              setSelectedSDGs(new Set())
              setGoState({})
              try { localStorage.removeItem('codefest-session') } catch {}
            }}
            style={{ marginLeft: "auto", fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", background: "none", border: "1px solid var(--sp-border)", borderRadius: "5px", padding: "3px 10px", cursor: "pointer" }}
          >
            clear session
          </button>
        </div>
      )}
    </div>
  )
}
