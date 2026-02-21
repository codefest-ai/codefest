"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import componentsData from "@/data/components_seed.json"
import {
  DOMAINS, PATTERNS, SDGS, GO_QUESTIONS, RECS,
  CATEGORIES, CAT_COLORS, DIFF_COLORS,
  AUDIENCE_ARCHETYPES, PROBLEM_FRAMES,
} from "@/data/constants"

// ── TYPES ────────────────────────────────────────────────────

type EnrichedComponent = {
  name: string; category: string; description: string;
  github_url?: string; docs_url?: string;
  setup_time_minutes: number; difficulty: string; tags: string[];
  domains?: string[]; sdgs?: string[];
  plainLanguageWhat?: string; plainLanguageWhy?: string;
  commonUse?: string; relatedComponents?: string[]; skillRequired?: string;
}

const ALL_COMPONENTS: EnrichedComponent[] = (componentsData as { components: EnrichedComponent[] }).components

// ── PANEL CONFIG ──────────────────────────────────────────────
// Order: Problem → SDGs → Domain → Patterns → Stack → GO!
// (DSR Chatterjee: define the problem before the solution)

const PANELS = [
  { id: "problem",  num: "01", icon: "🎯", title: "Problem Framing",  sub: "Who are you building for, and what's broken?" },
  { id: "impact",   num: "02", icon: "🌐", title: "Impact Alignment", sub: "Pick the SDGs your project addresses." },
  { id: "domain",   num: "03", icon: "🌍", title: "Challenge Domain", sub: "What space are you building in?" },
  { id: "patterns", num: "04", icon: "🏆", title: "Winning Patterns", sub: "What worked at real hackathons." },
  { id: "stack",    num: "05", icon: "📦", title: "Component Stack",  sub: "Pick your tools. Highlighted = matches your context." },
  { id: "gomode",   num: "06", icon: "▶",  title: "GO! Mode",        sub: "3 questions → 1 recommended stack." },
]

// ── SOFT SUGGESTION LOGIC ─────────────────────────────────────

function getSuggestedComponents(domain: string | null, sdgs: Set<string>): Set<string> {
  if (!domain && sdgs.size === 0) return new Set()
  return new Set(
    ALL_COMPONENTS.filter(c => {
      const domainMatch = domain && c.domains?.some(d => {
        const dl = d.toLowerCase()
        const sl = domain.toLowerCase()
        // fuzzy: any meaningful word overlap
        return sl.split(/\s+/).some(w => w.length > 3 && dl.includes(w)) ||
               dl.split(/\s+/).some(w => w.length > 3 && sl.includes(w))
      })
      const sdgMatch = sdgs.size > 0 && c.sdgs?.some(s => sdgs.has(s))
      return domainMatch || sdgMatch
    }).map(c => c.name)
  )
}

// ── COMPONENT ────────────────────────────────────────────────

export default function WorkspacePage() {
  const { user, signOut } = useAuth()

  // Panel visibility
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set(["problem"]))

  // Session state
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null)
  const [problemStatement, setProblemStatement] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set())
  const [selectedSDGs, setSelectedSDGs] = useState<Set<string>>(new Set())
  const [goState, setGoState] = useState<Record<string, string>>({})

  // Library search/filter
  const [stackSearch, setStackSearch] = useState("")
  const [stackFilter, setStackFilter] = useState<string | null>(null)

  // Plain language view: which component cards are flipped
  const [plainCards, setPlainCards] = useState<Set<string>>(new Set())

  // Clock
  const [clock, setClock] = useState("")
  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // ── LOCALSTORAGE: restore session ────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("codefest-session")
      if (saved) {
        const s = JSON.parse(saved)
        if (s.selectedAudience) setSelectedAudience(s.selectedAudience)
        if (s.problemStatement) setProblemStatement(s.problemStatement)
        if (s.selectedDomain) setSelectedDomain(s.selectedDomain)
        if (s.selectedComponents) setSelectedComponents(new Set(s.selectedComponents))
        if (s.selectedSDGs) setSelectedSDGs(new Set(s.selectedSDGs))
        if (s.goState) setGoState(s.goState)
        if (s.openPanels) setOpenPanels(new Set(s.openPanels))
      }
    } catch {}
  }, [])

  // ── LOCALSTORAGE: persist session ────────────────────────────
  useEffect(() => {
    const isEmpty = !selectedAudience && !selectedDomain && selectedComponents.size === 0 && selectedSDGs.size === 0
    if (isEmpty) return
    try {
      localStorage.setItem("codefest-session", JSON.stringify({
        selectedAudience, problemStatement, selectedDomain,
        selectedComponents: [...selectedComponents],
        selectedSDGs: [...selectedSDGs],
        goState,
        openPanels: [...openPanels],
      }))
    } catch {}
  }, [selectedAudience, problemStatement, selectedDomain, selectedComponents, selectedSDGs, goState, openPanels])

  // ── HANDLERS ─────────────────────────────────────────────────

  const togglePanel = (id: string) => {
    setOpenPanels(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openNext = (currentId: string) => {
    const idx = PANELS.findIndex(p => p.id === currentId)
    if (idx >= 0 && idx < PANELS.length - 1) {
      setOpenPanels(prev => new Set([...prev, PANELS[idx + 1].id]))
    }
  }

  const pickAudience = (id: string) => {
    setSelectedAudience(id)
  }

  const pickDomain = (name: string) => {
    setSelectedDomain(name)
    openNext("domain")
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

  const togglePlainCard = (name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPlainCards(prev => {
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

  // Soft suggestion
  const suggestedComponents = getSuggestedComponents(selectedDomain, selectedSDGs)

  const filteredComponents = ALL_COMPONENTS.filter(c => {
    if (stackFilter && c.category !== stackFilter) return false
    if (stackSearch) {
      const q = stackSearch.toLowerCase()
      return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some(t => t.includes(q))
    }
    return true
  }).sort((a, b) => {
    // Suggested components float to the top
    const aS = suggestedComponents.has(a.name)
    const bS = suggestedComponents.has(b.name)
    if (aS && !bS) return -1
    if (!aS && bS) return 1
    return 0
  })

  const sessionEmpty = !selectedAudience && !selectedDomain && selectedComponents.size === 0 && selectedSDGs.size === 0
  const rec = getGoRec()
  const selectedArchetype = AUDIENCE_ARCHETYPES.find(a => a.id === selectedAudience)

  // ── RENDER ──────────────────────────────────────────────────

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
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "70px 2rem 2rem" }}>

        {/* Page header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
            hackathon session workspace
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Define the problem first.
          </h1>
          <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.6 }}>
            Work through the panels in order. Start with who you&apos;re building for — the tech follows.
          </p>
        </div>

        {/* ── ACCORDION PANELS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {PANELS.map(panel => {
            const isOpen = openPanels.has(panel.id)
            const hasPick = (
              (panel.id === "problem" && selectedAudience) ||
              (panel.id === "domain" && selectedDomain) ||
              (panel.id === "stack" && selectedComponents.size > 0) ||
              (panel.id === "impact" && selectedSDGs.size > 0) ||
              (panel.id === "gomode" && goState.q3)
            )

            return (
              <div key={panel.id} className="ws-panel" style={{
                background: "var(--sp-surface)",
                border: `1px solid ${isOpen ? "rgba(34,197,94,0.2)" : "var(--sp-border)"}`,
                borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s"
              }}>

                {/* Panel header */}
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
                          {panel.id === "problem" && selectedArchetype?.label}
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

                {/* Panel body */}
                {isOpen && (
                  <div style={{ padding: "0 20px 24px", borderTop: "1px solid var(--sp-border)" }}>

                    {/* ─────────────────────────────────────────────
                        01 PROBLEM FRAMING
                    ───────────────────────────────────────────── */}
                    {panel.id === "problem" && (
                      <div style={{ paddingTop: "18px" }}>
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          Step 1 of 2 — Who are you at this hackathon?
                        </div>

                        {/* Audience archetypes */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px", marginBottom: "20px" }}>
                          {AUDIENCE_ARCHETYPES.map(a => (
                            <div
                              key={a.id}
                              onClick={() => pickAudience(a.id)}
                              className="ws-card-hover"
                              style={{
                                background: selectedAudience === a.id ? "rgba(34,197,94,0.07)" : "var(--sp-surface2)",
                                border: `1px solid ${selectedAudience === a.id ? "rgba(34,197,94,0.4)" : "var(--sp-border)"}`,
                                borderRadius: "10px", padding: "14px 16px", cursor: "pointer", transition: "all 0.15s",
                              }}
                            >
                              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{a.icon}</div>
                              <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "4px", color: selectedAudience === a.id ? "var(--sp-brand)" : "var(--sp-text)", letterSpacing: "-0.01em" }}>{a.label}</div>
                              <div style={{ fontSize: "11px", color: "var(--sp-muted)", lineHeight: 1.5 }}>{a.desc}</div>
                            </div>
                          ))}
                        </div>

                        {/* Problem statement area — shown after picking audience */}
                        {selectedAudience && selectedArchetype && (
                          <div style={{ background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "10px", padding: "16px 18px" }}>
                            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                              Step 2 of 2 — Frame your problem
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--sp-brand)", fontWeight: 600, marginBottom: "4px" }}>{selectedArchetype.prompt}</div>
                            <div style={{ fontSize: "11px", color: "var(--sp-dim)", marginBottom: "12px" }}>{selectedArchetype.hint}</div>

                            <textarea
                              value={problemStatement}
                              onChange={e => setProblemStatement(e.target.value)}
                              placeholder="Write it out — even rough is fine. This is for you, not the judges."
                              rows={3}
                              style={{
                                width: "100%", background: "var(--sp-bg)", border: "1px solid var(--sp-border)",
                                borderRadius: "8px", padding: "10px 12px", color: "var(--sp-text)",
                                fontSize: "12px", fontFamily: "var(--sp-mono)", resize: "vertical",
                                outline: "none", lineHeight: 1.6, boxSizing: "border-box",
                              }}
                            />

                            <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {PROBLEM_FRAMES.map(f => (
                                  <button
                                    key={f}
                                    onClick={() => setProblemStatement(f)}
                                    style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", padding: "3px 8px", background: "none", border: "1px solid var(--sp-border)", borderRadius: "4px", color: "var(--sp-dim)", cursor: "pointer", transition: "all 0.15s" }}
                                  >
                                    {f.split(" ").slice(0, 4).join(" ")}…
                                  </button>
                                ))}
                              </div>
                              <button
                                onClick={() => openNext("problem")}
                                style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "6px 14px", background: "var(--sp-brand)", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap" }}
                              >
                                next: SDGs →
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ─────────────────────────────────────────────
                        02 IMPACT ALIGNMENT (SDGs)
                    ───────────────────────────────────────────── */}
                    {panel.id === "impact" && (
                      <div style={{ paddingTop: "18px" }}>
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginBottom: "12px" }}>
                          Which UN Sustainable Development Goals does your project address? Pick all that apply.
                        </div>
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
                        {selectedSDGs.size > 0 && (
                          <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => openNext("impact")}
                              style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "6px 14px", background: "var(--sp-brand)", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
                            >
                              next: domain →
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ─────────────────────────────────────────────
                        03 CHALLENGE DOMAIN
                    ───────────────────────────────────────────── */}
                    {panel.id === "domain" && (
                      <div style={{ paddingTop: "18px" }}>
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginBottom: "12px" }}>
                          Which challenge space does your problem live in? This shapes your winning patterns and suggested components.
                        </div>
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

                    {/* ─────────────────────────────────────────────
                        04 WINNING PATTERNS
                    ───────────────────────────────────────────── */}
                    {panel.id === "patterns" && (
                      <div style={{ paddingTop: "18px" }}>
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginBottom: "12px" }}>
                          Real stacks from real winning teams. Click any component pill to add it to your stack.
                        </div>
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
                        <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => openNext("patterns")}
                            style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "6px 14px", background: "var(--sp-brand)", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 700 }}
                          >
                            next: build your stack →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ─────────────────────────────────────────────
                        05 COMPONENT STACK
                    ───────────────────────────────────────────── */}
                    {panel.id === "stack" && (
                      <div style={{ paddingTop: "18px" }}>

                        {/* Soft suggestion banner */}
                        {suggestedComponents.size > 0 && (
                          <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "14px" }}>✦</span>
                            <div>
                              <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-brand)", fontWeight: 600 }}>{suggestedComponents.size} components suggested</span>
                              <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}> based on your domain + SDG selections — sorted to the top.</span>
                            </div>
                          </div>
                        )}

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

                        {/* Plain language hint */}
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginBottom: "12px" }}>
                          Click a card to add to stack · press <span style={{ color: "var(--sp-muted)" }}>ℹ</span> for plain-language explanation · ✦ = suggested for your context
                        </div>

                        {/* Component grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "8px" }}>
                          {filteredComponents.map(c => {
                            const selected = selectedComponents.has(c.name)
                            const suggested = suggestedComponents.has(c.name)
                            const showPlain = plainCards.has(c.name)

                            return (
                              <div
                                key={c.name}
                                onClick={() => toggleComponent(c.name)}
                                style={{
                                  background: selected ? "rgba(34,197,94,0.06)" : suggested ? "rgba(34,197,94,0.02)" : "var(--sp-surface2)",
                                  border: `1px solid ${selected ? "rgba(34,197,94,0.3)" : suggested ? "rgba(34,197,94,0.12)" : "var(--sp-border)"}`,
                                  borderLeft: `2px solid ${selected ? "var(--sp-brand)" : suggested ? "rgba(34,197,94,0.35)" : "transparent"}`,
                                  borderRadius: "10px", padding: "14px", cursor: "pointer", transition: "all 0.15s", position: "relative",
                                }}
                                className="ws-card-hover"
                              >
                                {/* Suggested badge */}
                                {suggested && !selected && (
                                  <span style={{
                                    position: "absolute", top: "8px", right: "32px",
                                    fontFamily: "var(--sp-mono)", fontSize: "8px", color: "var(--sp-brand)",
                                    background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.2)",
                                    borderRadius: "3px", padding: "1px 5px", letterSpacing: "0.05em",
                                  }}>✦ match</span>
                                )}

                                {/* Plain language toggle */}
                                <button
                                  onClick={e => togglePlainCard(c.name, e)}
                                  title={showPlain ? "Show technical view" : "Plain language explanation"}
                                  style={{
                                    position: "absolute", top: "8px", right: "8px",
                                    width: "20px", height: "20px", borderRadius: "50%",
                                    background: showPlain ? "var(--sp-brand)" : "var(--sp-surface)",
                                    border: `1px solid ${showPlain ? "var(--sp-brand)" : "var(--sp-border)"}`,
                                    color: showPlain ? "#000" : "var(--sp-dim)",
                                    fontSize: "10px", cursor: "pointer", display: "flex",
                                    alignItems: "center", justifyContent: "center", fontWeight: 600,
                                    lineHeight: 1, transition: "all 0.15s",
                                  }}
                                >
                                  ℹ
                                </button>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "5px", paddingRight: "24px" }}>
                                  <span style={{ fontWeight: 600, fontSize: "12px", color: selected ? "var(--sp-brand)" : "var(--sp-text)" }}>{c.name}</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: CAT_COLORS[c.category] }}>{c.category}</span>
                                    {selected && <span style={{ color: "var(--sp-brand)", fontSize: "11px" }}>✓</span>}
                                  </div>
                                </div>

                                {/* Technical view */}
                                {!showPlain && (
                                  <>
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
                                  </>
                                )}

                                {/* Plain language view */}
                                {showPlain && (
                                  <div style={{ borderTop: "1px solid rgba(34,197,94,0.15)", paddingTop: "10px" }}>
                                    {c.plainLanguageWhat && (
                                      <div style={{ marginBottom: "8px" }}>
                                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>What is it?</div>
                                        <div style={{ fontSize: "11px", color: "var(--sp-text)", lineHeight: 1.5 }}>{c.plainLanguageWhat}</div>
                                      </div>
                                    )}
                                    {c.plainLanguageWhy && (
                                      <div style={{ marginBottom: "8px" }}>
                                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "3px" }}>Why use it?</div>
                                        <div style={{ fontSize: "11px", color: "var(--sp-text)", lineHeight: 1.5 }}>{c.plainLanguageWhy}</div>
                                      </div>
                                    )}
                                    {c.skillRequired && (
                                      <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", paddingTop: "6px", borderTop: "1px solid var(--sp-border)" }}>
                                        skill level: <span style={{ color: DIFF_COLORS[c.difficulty] }}>{c.skillRequired}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* ─────────────────────────────────────────────
                        06 GO! MODE
                    ───────────────────────────────────────────── */}
                    {panel.id === "gomode" && (
                      <div style={{ paddingTop: "18px", maxWidth: "600px" }}>
                        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginBottom: "16px" }}>
                          3 quick questions → 1 opinionated stack recommendation.
                        </div>
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

          {selectedAudience && selectedArchetype && (
            <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "3px 9px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "5px", color: "#a78bfa", whiteSpace: "nowrap" }}>
              {selectedArchetype.icon} {selectedArchetype.label.split(" ")[0]}
            </span>
          )}

          {selectedDomain && (
            <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "3px 9px", background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "5px", color: "var(--sp-brand)", whiteSpace: "nowrap" }}>
              🌍 {selectedDomain}
            </span>
          )}

          {selectedSDGs.size > 0 && (
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {[...selectedSDGs].map(name => (
                <span key={name} className="sp-sdg-chip" style={{ cursor: "pointer" }} onClick={() => toggleSDG(name)}>{name} ×</span>
              ))}
            </div>
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

          <button
            onClick={() => {
              setSelectedAudience(null)
              setProblemStatement("")
              setSelectedDomain(null)
              setSelectedComponents(new Set())
              setSelectedSDGs(new Set())
              setGoState({})
              setPlainCards(new Set())
              setOpenPanels(new Set(["problem"]))
              try { localStorage.removeItem("codefest-session") } catch {}
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
