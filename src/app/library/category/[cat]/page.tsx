import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import componentsData from "@/data/components_seed.json"
import { CATEGORY_META, CATEGORIES } from "@/data/constants"

type EnrichedComponent = {
  name: string; category: string; description: string;
  github_url?: string; docs_url?: string;
  setup_time_minutes: number; difficulty: string; tags: string[];
  plainLanguageWhat?: string; skillRequired?: string;
}

const ALL_COMPONENTS: EnrichedComponent[] = (componentsData as { components: EnrichedComponent[] }).components

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ cat }))
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params
  const meta = CATEGORY_META[cat]
  if (!meta) return {}
  const count = ALL_COMPONENTS.filter(c => c.category === cat).length
  return {
    title: `${meta.label} for Hackathons — Codefest.ai`,
    description: `${meta.tagline} ${count} curated ${meta.label.toLowerCase()} tools for hackathon teams.`,
    openGraph: {
      title: `${meta.label} — Hackathon Component Library | Codefest.ai`,
      description: meta.why.slice(0, 160),
    },
  }
}

const DIFF_COLORS: Record<string, string> = {
  beginner: "#22c55e", intermediate: "#fbbf24", advanced: "#f472b6",
}

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params
  const meta = CATEGORY_META[cat]
  if (!meta) notFound()

  const components = ALL_COMPONENTS.filter(c => c.category === cat)
    .sort((a, b) => a.setup_time_minutes - b.setup_time_minutes)

  return (
    <div style={{ minHeight: "100vh", background: "var(--sp-bg)", color: "var(--sp-text)" }}>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(13,17,23,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--sp-border)", padding: "0 2rem", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: "28px", height: "28px", background: "var(--sp-brand)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em", color: "var(--sp-text)" }}>codefest<em style={{ color: "var(--sp-brand)", fontStyle: "normal" }}>.ai</em></span>
        </Link>
        <Link href="/library" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: "var(--sp-dim)", textDecoration: "none" }}>
          ← all categories
        </Link>
      </header>

      <main style={{ maxWidth: "820px", margin: "0 auto", padding: "80px 2rem 4rem" }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
          <Link href="/library" style={{ color: "var(--sp-dim)", textDecoration: "none" }}>library</Link>
          <span>›</span>
          <span style={{ color: meta.color }}>{meta.label}</span>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            <div style={{ fontSize: "36px" }}>{meta.icon}</div>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "4px" }}>{meta.label}</h1>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", color: meta.color }}>{components.length} components · sorted by setup time</div>
            </div>
          </div>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--sp-text)", lineHeight: 1.5, marginBottom: "12px", letterSpacing: "-0.01em" }}>
            {meta.tagline}
          </p>
        </div>

        {/* Editorial cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "2.5rem" }}>
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "18px 20px" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: meta.color, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>Why it matters</div>
            <p style={{ fontSize: "13px", color: "var(--sp-muted)", lineHeight: 1.7 }}>{meta.why}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "12px", padding: "16px 18px", flex: 1 }}>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>⚠ common pitfall</div>
              <p style={{ fontSize: "12px", color: "var(--sp-muted)", lineHeight: 1.7 }}>{meta.pitfall}</p>
            </div>
            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "16px 18px", flex: 1 }}>
              <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>✦ how to choose</div>
              <p style={{ fontSize: "12px", color: "var(--sp-muted)", lineHeight: 1.7 }}>{meta.tip}</p>
            </div>
          </div>
        </div>

        {/* Component list */}
        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "14px" }}>
          {components.length} {meta.label} tools — fastest setup first
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "2.5rem" }}>
          {components.map(c => (
            <Link
              key={c.name}
              href={`/library/${toSlug(c.name)}`}
              style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", textDecoration: "none", transition: "border-color 0.15s", cursor: "pointer" }}
            >
              {/* Setup time badge */}
              <div style={{ textAlign: "center", minWidth: "48px" }}>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "14px", fontWeight: 700, color: "var(--sp-brand)" }}>{c.setup_time_minutes}</div>
                <div style={{ fontFamily: "var(--sp-mono)", fontSize: "8px", color: "var(--sp-dim)", textTransform: "uppercase" }}>min</div>
              </div>

              {/* Divider */}
              <div style={{ width: "1px", height: "36px", background: "var(--sp-border)" }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--sp-text)" }}>{c.name}</span>
                  <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: DIFF_COLORS[c.difficulty] }}>{c.difficulty}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--sp-muted)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.plainLanguageWhat ?? c.description}
                </div>
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: "8px", flexShrink: 0, alignItems: "center" }}>
                {c.github_url && (
                  <a href={c.github_url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textDecoration: "none" }}>
                    GitHub↗
                  </a>
                )}
                {c.docs_url && (
                  <a href={c.docs_url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textDecoration: "none" }}>
                    Docs↗
                  </a>
                )}
                <span style={{ fontFamily: "var(--sp-mono)", fontSize: "13px", color: "var(--sp-dim)" }}>›</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Other categories */}
        <div style={{ borderTop: "1px solid var(--sp-border)", paddingTop: "2rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>Other building blocks</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CATEGORIES.filter(c => c !== cat).map(c => {
              const m = CATEGORY_META[c]
              return (
                <Link key={c} href={`/library/category/${c}`} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "8px", textDecoration: "none", transition: "border-color 0.15s" }}>
                  <span style={{ fontSize: "15px" }}>{m.icon}</span>
                  <span style={{ fontSize: "13px", color: "var(--sp-text)", fontWeight: 600 }}>{m.label}</span>
                  <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)" }}>{ALL_COMPONENTS.filter(comp => comp.category === c).length}</span>
                </Link>
              )
            })}
          </div>
        </div>

      </main>
    </div>
  )
}
