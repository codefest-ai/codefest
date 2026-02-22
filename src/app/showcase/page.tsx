"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getShowcaseProjects, type ShowcaseProject } from "@/lib/showcase"
import { DOMAINS } from "@/data/constants"

const PLATFORM_LINKS = [
  { name: "Devpost", url: "https://devpost.com", desc: "Primary hackathon submission platform" },
  { name: "Dorahacks", url: "https://dorahacks.io", desc: "Web3 & open-source hackathons" },
  { name: "TAIKAI", url: "https://taikai.network", desc: "Innovation challenges & hackathons" },
  { name: "HackerEarth", url: "https://hackerearth.com", desc: "Technical hiring hackathons" },
  { name: "GitHub Explore", url: "https://github.com/explore", desc: "Trending repos & topics" },
]

const DOMAIN_COLORS: Record<string, string> = {
  "Climate & Environment": "#34d399",
  "Health & Wellbeing": "#fb7185",
  "Education & Access": "#60a5fa",
  "Economic Equity": "#f59e0b",
  "Civic Tech": "#a78bfa",
  "Food & Agriculture": "#4ade80",
  "Housing & Infrastructure": "#fb923c",
  "Crisis & Disaster Response": "#f87171",
  "Arts & Culture": "#e879f9",
  "Justice & Rights": "#818cf8",
  "Energy & Utilities": "#fbbf24",
  "Transportation": "#38bdf8",
}

export default function ShowcasePage() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([])
  const [loading, setLoading] = useState(true)
  const [domainFilter, setDomainFilter] = useState("")

  useEffect(() => {
    getShowcaseProjects(domainFilter ? { domain: domainFilter } : undefined)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [domainFilter])

  const domains = DOMAINS.map(d => d.n)

  return (
    <div className="sp-page" style={{ paddingTop: "88px", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>
            preservation layer
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: "8px" }}>
                Project Showcase
              </h1>
              <p style={{ fontSize: "14px", color: "var(--sp-muted)", lineHeight: 1.6, maxWidth: "520px" }}>
                Real hackathon projects with their full stack, lessons learned, and links to Devpost and GitHub. Curated context so next time you build, you start from what worked.
              </p>
            </div>
            <Link
              href="/showcase/submit"
              style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "10px 18px", background: "var(--sp-brand)", color: "#000", borderRadius: "8px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", alignSelf: "flex-start" }}
            >
              + submit project
            </Link>
          </div>
        </div>

        {/* External Platforms strip */}
        <div style={{ background: "var(--sp-surface2)", border: "1px solid var(--sp-border)", borderRadius: "10px", padding: "14px 18px", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>
            browse on other platforms →
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {PLATFORM_LINKS.map(p => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                title={p.desc}
                style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "5px 12px", background: "var(--sp-surface3)", border: "1px solid var(--sp-border)", borderRadius: "6px", color: "var(--sp-muted)", textDecoration: "none", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--sp-text)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--sp-border-active)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--sp-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--sp-border)" }}
              >
                {p.name} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Domain filter */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.75rem", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: "4px" }}>
            filter
          </span>
          <button
            onClick={() => setDomainFilter("")}
            style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "3px 10px", borderRadius: "5px", border: "1px solid var(--sp-border)", background: domainFilter === "" ? "var(--sp-brand-dim)" : "var(--sp-surface2)", color: domainFilter === "" ? "var(--sp-brand)" : "var(--sp-muted)", cursor: "pointer" }}
          >
            all
          </button>
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setDomainFilter(d === domainFilter ? "" : d)}
              style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", padding: "3px 10px", borderRadius: "5px", border: `1px solid ${d === domainFilter ? (DOMAIN_COLORS[d] ?? "var(--sp-brand)") + "44" : "var(--sp-border)"}`, background: d === domainFilter ? (DOMAIN_COLORS[d] ?? "var(--sp-brand)") + "14" : "var(--sp-surface2)", color: d === domainFilter ? (DOMAIN_COLORS[d] ?? "var(--sp-brand)") : "var(--sp-muted)", cursor: "pointer" }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: "220px", background: "var(--sp-surface2)", borderRadius: "12px", opacity: 0.4 }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>◇</div>
            <p style={{ fontFamily: "var(--sp-mono)", fontSize: "12px", color: "var(--sp-dim)", marginBottom: "1rem" }}>
              {domainFilter ? `no projects in ${domainFilter} yet` : "no projects submitted yet — be the first"}
            </p>
            <Link
              href="/showcase/submit"
              style={{ fontFamily: "var(--sp-mono)", fontSize: "11px", padding: "8px 18px", background: "var(--sp-brand)", color: "#000", borderRadius: "7px", fontWeight: 700, textDecoration: "none" }}
            >
              submit your project
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

function ProjectCard({ project: p }: { project: ShowcaseProject }) {
  const domainColor = p.domain ? (DOMAIN_COLORS[p.domain] ?? "var(--sp-brand)") : "var(--sp-brand)"

  return (
    <div style={{ background: "var(--sp-surface)", border: "1px solid var(--sp-border)", borderRadius: "12px", padding: "18px", display: "flex", flexDirection: "column", gap: "10px", transition: "all 0.18s", borderLeft: `3px solid ${domainColor}22` }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--sp-border-active)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)" }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--sp-border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {p.award && (
            <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "#fbbf24", marginBottom: "4px" }}>
              🏆 {p.award}
            </div>
          )}
          <h3 style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "2px", lineHeight: 1.3 }}>
            {p.title}
          </h3>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)" }}>
            {p.hackathon_name}{p.hackathon_year ? ` · ${p.hackathon_year}` : ""}
          </div>
        </div>
        {p.domain && (
          <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", padding: "2px 7px", borderRadius: "4px", background: domainColor + "14", color: domainColor, border: `1px solid ${domainColor}33`, whiteSpace: "nowrap", flexShrink: 0 }}>
            {p.domain}
          </span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: "12px", color: "var(--sp-muted)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {p.description}
      </p>

      {/* Stack pills */}
      {p.stack.length > 0 && (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {p.stack.slice(0, 5).map(s => (
            <span key={s} style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", padding: "1px 6px", borderRadius: "3px", background: "var(--sp-surface3)", color: "var(--sp-dim)", border: "1px solid var(--sp-border)" }}>
              {s}
            </span>
          ))}
          {p.stack.length > 5 && (
            <span style={{ fontFamily: "var(--sp-mono)", fontSize: "9px", color: "var(--sp-dim)" }}>+{p.stack.length - 5}</span>
          )}
        </div>
      )}

      {/* Lesson */}
      {p.lesson && (
        <div style={{ background: "var(--sp-surface2)", borderRadius: "6px", padding: "8px 10px", borderLeft: "2px solid var(--sp-brand)33" }}>
          <div style={{ fontFamily: "var(--sp-mono)", fontSize: "8px", color: "var(--sp-brand)", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.08em" }}>lesson</div>
          <p style={{ fontSize: "11px", color: "var(--sp-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {p.lesson}
          </p>
        </div>
      )}

      {/* Links */}
      <div style={{ display: "flex", gap: "10px", paddingTop: "6px", borderTop: "1px solid var(--sp-border)", marginTop: "auto" }}>
        {p.devpost_url && (
          <a href={p.devpost_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-muted)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--sp-brand)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--sp-muted)"}
          >
            Devpost ↗
          </a>
        )}
        {p.github_url && (
          <a href={p.github_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-muted)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--sp-brand)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--sp-muted)"}
          >
            GitHub ↗
          </a>
        )}
        {p.demo_url && (
          <a href={p.demo_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--sp-mono)", fontSize: "10px", color: "var(--sp-muted)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--sp-brand)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--sp-muted)"}
          >
            Demo ↗
          </a>
        )}
      </div>
    </div>
  )
}
