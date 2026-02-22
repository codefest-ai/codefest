import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import componentsData from "@/data/components_seed.json"
import { Header } from "@/components/Header"

type FurtherReadingItem = {
  title: string
  url: string
  type?: "paper" | "article" | "docs" | "tutorial"
}

type EnrichedComponent = {
  name: string
  category: string
  description: string
  github_url?: string
  docs_url?: string
  setup_time_minutes: number
  difficulty: string
  tags: string[]
  domains?: string[]
  sdgs?: string[]
  plainLanguageWhat?: string
  plainLanguageWhy?: string
  commonUse?: string
  relatedComponents?: string[]
  skillRequired?: string
  further_reading?: FurtherReadingItem[]
  github_org?: string
}

const ALL_COMPONENTS: EnrichedComponent[] = (componentsData as { components: EnrichedComponent[] }).components

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function generateStaticParams() {
  return ALL_COMPONENTS.map((c) => ({ slug: toSlug(c.name) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const comp = ALL_COMPONENTS.find((c) => toSlug(c.name) === slug)
  if (!comp) return {}
  return {
    title: `${comp.name} — Hackathon Component Library`,
    description: `${comp.description} ${comp.plainLanguageWhy ?? ""} Setup time: ${comp.setup_time_minutes} min. Difficulty: ${comp.difficulty}.`.trim(),
    openGraph: {
      title: `${comp.name} for Hackathons — Codefest.ai`,
      description: comp.plainLanguageWhat ?? comp.description,
    },
  }
}

const CAT_COLORS: Record<string, string> = {
  auth: "#22d3ee", ai: "#a78bfa", database: "#60a5fa",
  ui: "#22c55e", payments: "#fbbf24", api: "#fb923c", devtools: "#f472b6",
}
const DIFF_COLORS: Record<string, string> = {
  beginner: "#22c55e", intermediate: "#fbbf24", advanced: "#f472b6",
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const comp = ALL_COMPONENTS.find((c) => toSlug(c.name) === slug)
  if (!comp) notFound()

  const related = comp.relatedComponents
    ?.map((name) => ALL_COMPONENTS.find((c) => c.name === name))
    .filter(Boolean) as EnrichedComponent[]

  const catColor = CAT_COLORS[comp.category] ?? "#888"
  const diffColor = DIFF_COLORS[comp.difficulty] ?? "#888"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "name": comp.name,
    "headline": `${comp.name} — Hackathon Setup Guide`,
    "description": comp.plainLanguageWhat ?? comp.description,
    "url": `https://codefest.ai/library/${slug}`,
    "publisher": { "@type": "Organization", "name": "Codefest.ai", "url": "https://codefest.ai" },
    "timeRequired": `PT${comp.setup_time_minutes}M`,
    "keywords": [comp.category, comp.difficulty, ...comp.tags].join(", "),
    ...(comp.docs_url ? { "sameAs": comp.docs_url } : {}),
    ...(comp.github_url ? { "codeRepository": comp.github_url } : {}),
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--sp-bg)", color: "var(--sp-text)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header />

      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "96px 2rem 4rem" }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "6px" }}>
          <Link href="/library" style={{ color: "var(--sp-dim)", textDecoration: "none" }}>library</Link>
          <span>›</span>
          <span style={{ color: "var(--sp-brand)" }}>{comp.name}</span>
        </div>

        {/* Title block */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "12px" }}>
            {/* Logo */}
            {comp.github_org && (
              <img
                src={`https://github.com/${comp.github_org}.png?size=56`}
                alt={comp.name}
                width={56}
                height={56}
                style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "var(--sp-surface)", flexShrink: 0 }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: catColor, background: `${catColor}18`, border: `1px solid ${catColor}30`, borderRadius: "5px", padding: "2px 8px" }}>{comp.category}</span>
                <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: diffColor }}>{comp.difficulty}</span>
                <span style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)" }}>⏱ {comp.setup_time_minutes} min setup</span>
              </div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>{comp.name}</h1>
              <p style={{ fontSize: "15px", color: "var(--sp-muted)", lineHeight: 1.7 }}>{comp.description}</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "2rem", flexWrap: "wrap" }}>
          {comp.github_url && (
            <a href={comp.github_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 16px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "8px", color: "var(--sp-text)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", transition: "border-color 0.15s" }}>
              GitHub ↗
            </a>
          )}
          {comp.docs_url && (
            <a href={comp.docs_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 16px", background: "var(--sp-brand)", border: "none", borderRadius: "8px", color: "#000", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
              Docs ↗
            </a>
          )}
          <Link href={`/workspace?add=${encodeURIComponent(comp.name)}`} style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 16px", background: "var(--sp-surface)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", color: "var(--sp-brand)", textDecoration: "none" }}>
            Add to workspace →
          </Link>
        </div>

        {/* Plain language section */}
        {(comp.plainLanguageWhat || comp.plainLanguageWhy) && (
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "20px 24px", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-brand)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "14px" }}>Plain language</div>
            {comp.plainLanguageWhat && (
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>What is it?</div>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--sp-text)" }}>{comp.plainLanguageWhat}</p>
              </div>
            )}
            {comp.plainLanguageWhy && (
              <div style={{ marginBottom: comp.commonUse ? "14px" : 0 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Why use it at a hackathon?</div>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--sp-text)" }}>{comp.plainLanguageWhy}</p>
              </div>
            )}
            {comp.commonUse && (
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Common use</div>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--sp-text)" }}>{comp.commonUse}</p>
              </div>
            )}
          </div>
        )}

        {/* Meta grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1.5rem" }}>

          {/* Tags */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "18px 20px" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {comp.tags.map(t => (
                <span key={t} style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "2px 8px", background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "4px", color: "var(--sp-muted)" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Skill + setup */}
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "18px 20px" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>At a glance</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontSize: "12px", color: "var(--sp-muted)" }}>Setup time: <span style={{ color: "var(--sp-text)" }}>{comp.setup_time_minutes} minutes</span></div>
              <div style={{ fontSize: "12px", color: "var(--sp-muted)" }}>Difficulty: <span style={{ color: diffColor }}>{comp.difficulty}</span></div>
              {comp.skillRequired && <div style={{ fontSize: "12px", color: "var(--sp-muted)" }}>Skill: <span style={{ color: "var(--sp-text)" }}>{comp.skillRequired}</span></div>}
            </div>
          </div>
        </div>

        {/* Domains + SDGs */}
        {((comp.domains && comp.domains.length > 0) || (comp.sdgs && comp.sdgs.length > 0)) && (
          <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "18px 20px", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>Impact context</div>
            {comp.domains && comp.domains.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "11px", color: "var(--sp-dim)", marginBottom: "5px" }}>Challenge domains</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {comp.domains.map(d => (
                    <span key={d} style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "2px 9px", background: "var(--sp-brand-dim)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "4px", color: "var(--sp-brand)" }}>{d}</span>
                  ))}
                </div>
              </div>
            )}
            {comp.sdgs && comp.sdgs.length > 0 && (
              <div>
                <div style={{ fontSize: "11px", color: "var(--sp-dim)", marginBottom: "5px" }}>SDGs</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {comp.sdgs.map(s => (
                    <span key={s} style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "2px 9px", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "4px", color: "#60a5fa" }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related components */}
        {related && related.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>Related components</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {related.map(r => (
                <Link key={r.name} href={`/library/${toSlug(r.name)}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "10px", textDecoration: "none", transition: "border-color 0.15s" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--sp-text)", marginBottom: "2px" }}>{r.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--sp-dim)" }}>{r.description.slice(0, 80)}…</div>
                  </div>
                  <span style={{ fontFamily: "var(--sp-mono)", fontSize: "12px", color: "var(--sp-dim)", flexShrink: 0, marginLeft: "12px" }}>›</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Further reading */}
        {comp.further_reading && comp.further_reading.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px" }}>Go deeper</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {comp.further_reading.map((item, i) => {
                const typeColor: Record<string, string> = {
                  paper: "#a78bfa", article: "#fbbf24", docs: "#22d3ee", tutorial: "#22c55e"
                }
                const color = typeColor[item.type ?? "article"] ?? "#888"
                return (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "10px", textDecoration: "none", transition: "border-color 0.15s", gap: "12px" }}
                  >
                    <span style={{ fontSize: "13px", color: "var(--sp-text)", fontWeight: 500 }}>{item.title}</span>
                    <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: "4px", padding: "2px 7px", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {item.type ?? "link"}
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "3px" }}>Building with {comp.name}?</div>
            <div style={{ fontSize: "12px", color: "var(--sp-muted)" }}>Add it to your hackathon session workspace.</div>
          </div>
          <Link href={`/workspace?add=${encodeURIComponent(comp.name)}`} style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "10px 18px", background: "var(--sp-brand)", color: "#000", borderRadius: "8px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
            Add to workspace →
          </Link>
        </div>

      </main>
    </div>
  )
}
