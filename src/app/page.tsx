"use client"

import { useState, useEffect, useRef } from "react"
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

const NAV_ITEMS = [
  { href: "#hero", icon: "⚡", id: "hero", label: "Home" },
  null,
  { href: "#domains", icon: "🌍", id: "domains", label: "Challenge Domains" },
  { href: "#patterns", icon: "🏆", id: "patterns", label: "Winning Patterns" },
  { href: "#library", icon: "📦", id: "library", label: "Component Library" },
  { href: "#gomode", icon: "▶", id: "gomode", label: "GO! Mode" },
  { href: "#impact", icon: "🎯", id: "impact", label: "Impact Frameworks" },
]

function slugify(s: string) {
  return s.replace(/[^a-z0-9]/gi, "-").toLowerCase()
}

// ── COMPONENT ────────────────────────────────────────────────

export default function HomePage() {
  const { user, signOut } = useAuth()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [goState, setGoState] = useState<Record<string, string>>({})
  const [activeSection, setActiveSection] = useState("hero")
  const [clock, setClock] = useState("")
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Live clock
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setClock(n.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Cursor glow
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + "px"
        glowRef.current.style.top = e.clientY + "px"
      }
    }
    document.addEventListener("mousemove", handleMove)
    return () => document.removeEventListener("mousemove", handleMove)
  }, [])

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === "Escape") searchRef.current?.blur()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  // Scroll observer → update active nav rail item
  useEffect(() => {
    const ids = ["hero", "domains", "patterns", "library", "gomode", "impact"]
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.35 }
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  // Filtered component list
  const filteredComponents = ALL_COMPONENTS.filter((c) => {
    if (activeFilter && c.category !== activeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return true
  })

  // Click domain → scroll + search
  const handleDomainClick = (name: string) => {
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" })
    setTimeout(() => setSearch(name.split(" ")[0].toLowerCase()), 600)
  }

  // Click stack pill → scroll + highlight component card
  const handleJumpToComp = (name: string) => {
    setActiveFilter(null)
    setSearch("")
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" })
    setTimeout(() => {
      const el = document.getElementById("comp-" + slugify(name))
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        setHighlighted(slugify(name))
        setTimeout(() => setHighlighted(null), 2200)
      }
    }, 500)
  }

  // GO! Mode selection
  const handlePickGo = (key: string, val: string) => {
    setGoState((prev) => {
      const next = { ...prev, [key]: val }
      if (key === "q1") { delete next.q2; delete next.q3 }
      if (key === "q2") { delete next.q3 }
      return next
    })
  }

  const goRec = () => {
    if (!goState.q3) return null
    if (goState.q3.includes("Climate")) return RECS.climate
    if (goState.q3.includes("Health")) return RECS.health
    if (goState.q3.includes("Civic")) return RECS.civic
    return RECS.default
  }
  const rec = goRec()

  return (
    <div className="sp-page">
      {/* Cursor glow */}
      <div ref={glowRef} className="sp-glow" />

      {/* ── HEADER ── */}
      <header className="sp-header">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-mark">⚡</div>
          <span className="sp-logo-name">codefest<em>.ai</em></span>
        </Link>

        <div className="sp-search-wrap">
          <span className="sp-search-prompt">&gt;</span>
          <input
            ref={searchRef}
            className="sp-search-input"
            placeholder="search tools, domains, strategies…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              if (e.target.value) document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
          />
          <span className="sp-kbd">/ focus</span>
        </div>

        <div className="sp-hdr-right">
          <span><span className="sp-status-dot" />online</span>
          <span>{ALL_COMPONENTS.length} components</span>
          <span suppressHydrationWarning>{clock}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {user ? (
              <>
                <span style={{ fontSize: "11px" }}>{user.email?.split("@")[0]}</span>
                <button className="sp-hdr-link" onClick={() => signOut()}>sign out</button>
              </>
            ) : (
              <Link href="/login" className="sp-hdr-link">sign in</Link>
            )}
          </div>
        </div>
      </header>

      {/* ── NAV RAIL ── */}
      <nav className="sp-rail">
        {NAV_ITEMS.map((item, i) =>
          item === null ? (
            <div key={i} className="sp-rail-divider" />
          ) : (
            <a
              key={item.id}
              className={`sp-rail-btn${activeSection === item.id ? " sp-active" : ""}`}
              href={item.href}
              title={item.label}
            >
              {item.icon}
            </a>
          )
        )}
      </nav>

      {/* ── MAIN ── */}
      <main className="sp-main">

        {/* HERO */}
        <section className="sp-hero" id="hero">
          <div className="sp-hero-grid" />
          <div className="sp-hero-glow" />
          <div className="sp-hero-inner">
            <div className="sp-hero-badge">hackathon operating system · live</div>
            <h1 className="sp-h1">
              Stop wasting<br />
              <span className="sp-grad">the first hour.</span>
            </h1>
            <p className="sp-hero-sub">
              Strategic intelligence for hackathon teams. Challenge domains, winning stacks,
              impact frameworks — everything you need at GO.
            </p>
            <div className="sp-hero-actions">
              <a href="/workspace" className="sp-btn sp-btn-green">▶ Start Session</a>
              <a href="#domains" className="sp-btn sp-btn-outline">Browse Domains ↓</a>
            </div>
          </div>
          <div className="sp-scroll-cue">
            <span>scroll to navigate</span>
            <span>↓</span>
          </div>
        </section>

        {/* CHALLENGE DOMAINS */}
        <section className="sp-section" id="domains">
          <div className="sp-section-head">
            <div className="sp-eyebrow">01 · navigate</div>
            <div className="sp-section-title">Challenge Domains</div>
            <div className="sp-section-sub">
              Start here. Pick your challenge domain to surface winning patterns,
              component stacks, and SDG alignment used in similar projects.
            </div>
          </div>
          <div className="sp-domains-grid">
            {DOMAINS.map((d) => (
              <div key={d.n} className="sp-domain-card" onClick={() => handleDomainClick(d.n)}>
                <div className="sp-domain-icon">{d.e}</div>
                <div className="sp-domain-name">{d.n}</div>
                <div className="sp-domain-desc">{d.d}</div>
                <div className="sp-domain-meta">
                  <div className="sp-domain-tags">
                    {d.tags.map((t) => <span key={t} className="sp-dtag">{t}</span>)}
                  </div>
                  <span className="sp-domain-count">{d.p} projects →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WINNING PATTERNS */}
        <section className="sp-section" id="patterns">
          <div className="sp-section-head">
            <div className="sp-eyebrow">02 · learn</div>
            <div className="sp-section-title">Winning Patterns</div>
            <div className="sp-section-sub">
              Real projects from top hackathons. Click any component pill to jump to it in the
              library — that&apos;s &ldquo;shop the look.&rdquo;
            </div>
          </div>
          <div className="sp-patterns-row">
            {PATTERNS.map((p) => (
              <div key={p.n} className="sp-pattern-card">
                <span className="sp-pattern-badge">{p.pl}</span>
                <div className="sp-pattern-event">{p.ev} · {p.dom}</div>
                <div className="sp-pattern-name">{p.n}</div>
                <div className="sp-pattern-desc">{p.d}</div>
                <div className="sp-pattern-stack">
                  {p.stack.map((s) => (
                    <span key={s} className="sp-spill" onClick={() => handleJumpToComp(s)}>{s}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {p.sdgs.map((s) => <span key={s} className="sp-sdg-chip">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPONENT LIBRARY */}
        <section className="sp-section" id="library">
          <div className="sp-section-head">
            <div className="sp-eyebrow">03 · build</div>
            <div className="sp-section-title">Component Library</div>
            <div className="sp-section-sub">
              Curated tools with setup times, difficulty ratings, and direct links. Press{" "}
              <code style={{ fontFamily: "var(--sp-mono)", background: "var(--sp-surface2)", padding: "1px 5px", borderRadius: "3px", fontSize: "11px" }}>/</code>
              {" "}to search from anywhere.
            </div>
          </div>

          <div className="sp-lib-controls">
            <span className="sp-flabel">filter</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`sp-fpill${activeFilter === cat ? " sp-on" : ""}`}
                style={{ color: activeFilter === cat ? CAT_COLORS[cat] : undefined }}
                onClick={() => setActiveFilter((prev) => (prev === cat ? null : cat))}
              >
                {cat}
              </button>
            ))}
            {(activeFilter || search) && (
              <button
                className="sp-fpill"
                onClick={() => { setActiveFilter(null); setSearch("") }}
                style={{ color: "#f472b6", borderColor: "rgba(244,114,182,0.3)" }}
              >
                ✕ clear
              </button>
            )}
          </div>

          <div className="sp-comp-grid">
            {filteredComponents.map((c) => (
              <div
                key={c.name}
                id={`comp-${slugify(c.name)}`}
                className={`sp-comp-card${highlighted === slugify(c.name) ? " sp-highlight" : ""}`}
              >
                <div className="sp-comp-top">
                  <div className="sp-comp-name">{c.name}</div>
                  <span className="sp-comp-cat" style={{ color: CAT_COLORS[c.category] }}>{c.category}</span>
                </div>
                <div className="sp-comp-desc">{c.description}</div>
                <div className="sp-comp-tags">
                  {c.tags.map((t) => <span key={t} className="sp-ctag">{t}</span>)}
                </div>
                <div className="sp-comp-foot">
                  <span className="sp-comp-time">
                    ⏱ {c.setup_time_minutes}min ·{" "}
                    <span style={{ color: DIFF_COLORS[c.difficulty] }}>{c.difficulty}</span>
                  </span>
                  <div className="sp-comp-links">
                    {c.github_url && <a className="sp-clink" href={c.github_url} target="_blank" rel="noopener noreferrer">GitHub↗</a>}
                    {c.docs_url && <a className="sp-clink" href={c.docs_url} target="_blank" rel="noopener noreferrer">Docs↗</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--sp-muted)", fontFamily: "var(--sp-mono)", fontSize: "13px" }}>
              no components match &ldquo;{search}&rdquo;
            </div>
          )}
        </section>

        {/* GO! MODE */}
        <section className="sp-section" id="gomode">
          <div className="sp-section-head">
            <div className="sp-eyebrow">04 · orient</div>
            <div className="sp-section-title">GO! Mode</div>
            <div className="sp-section-sub">
              Three questions. One stack recommendation. For when the clock just started
              and you need orientation fast.
            </div>
          </div>
          <div className="sp-go-wrap">
            {GO_QUESTIONS.map(({ key, q, opts }, i) => {
              const prevKey = i > 0 ? GO_QUESTIONS[i - 1].key : null
              const locked = i > 0 && !goState[prevKey!]
              return (
                <div key={key} className={`sp-go-step${locked ? " sp-locked" : ""}`}>
                  <div className="sp-go-q">{q}</div>
                  <div className="sp-go-opts">
                    {opts.map((o) => (
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
                  {rec.stack.map((s) => (
                    <span key={s} className="sp-spill" onClick={() => handleJumpToComp(s)}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* IMPACT FRAMEWORKS */}
        <section className="sp-section" id="impact">
          <div className="sp-section-head">
            <div className="sp-eyebrow">05 · align</div>
            <div className="sp-section-title">Impact Frameworks</div>
            <div className="sp-section-sub">
              SDG alignment is increasingly mandatory. Navigate from goal to implementation —
              see which projects addressed each goal and how.
            </div>
          </div>
          <div className="sp-sdg-grid">
            {SDGS.map((s) => (
              <div key={s.n} className="sp-sdg-card">
                <span className="sp-sdg-n">{s.n}</span>
                <div>
                  <div className="sp-sdg-name">{s.name}</div>
                  <div className="sp-sdg-proj">{s.p} projects</div>
                </div>
              </div>
            ))}
          </div>
        </section>

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
