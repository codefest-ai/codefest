"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Zap, ArrowRight, Clock, Github, Bookmark, TrendingUp } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import componentsData from "@/data/components_seed.json"
import hackathonsData from "@/data/hackathons.json"
import { DOMAINS, PATTERNS, CAT_COLORS, DIFF_COLORS } from "@/data/constants"
import { createClient } from "@/lib/supabase/client"

type Component = {
  name: string; category: string; description: string;
  github_url?: string; docs_url?: string; github_org?: string;
  setup_time_minutes: number; difficulty: string; tags: string[];
}

type EngagementStats = {
  totalBookmarks: number
  totalSessions: number
  trending: Array<{ name: string; category: string; saves: number; github_org?: string }>
}

const ALL_COMPONENTS: Component[] = (componentsData as { components: Component[] }).components
const FEATURED = ALL_COMPONENTS.slice(0, 6)
const COMPONENT_MAP = new Map(ALL_COMPONENTS.map(c => [c.name, c]))

// ─── DIFFICULTY BADGE ────────────────────────────────────────
function DiffBadge({ d }: { d: string }) {
  const color = DIFF_COLORS[d] ?? "#6b7280"
  return (
    <span style={{ color, fontSize: "10px", fontFamily: "var(--font-geist-mono)", letterSpacing: "0.05em" }}>
      {d}
    </span>
  )
}

// ─── TRENDING CARD ────────────────────────────────────────────
function TrendingCard({ name, category, saves, github_org }: {
  name: string; category: string; saves: number; github_org?: string
}) {
  function toSlug(n: string) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }
  const color = CAT_COLORS[category] ?? "#6b7280"

  return (
    <Link
      href={`/library/${toSlug(name)}`}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-surface-1 p-3.5 transition-all hover:border-white/[0.12] hover:bg-surface-2"
    >
      {github_org ? (
        <img
          src={`https://github.com/${github_org}.png?size=36`}
          alt=""
          className="h-9 w-9 rounded-lg shrink-0 bg-surface-3 object-cover ring-1 ring-white/[0.06]"
          loading="lazy"
        />
      ) : (
        <div
          className="h-9 w-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold ring-1 ring-white/[0.06]"
          style={{ background: `${color}15`, color }}
        >
          {name[0]}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">{name}</div>
        <div className="text-xs text-zinc-600 font-mono" style={{ color }}>{category}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Bookmark className="h-3 w-3 text-brand-500" />
        <span className="font-mono text-[10px] text-brand-400">{saves}</span>
      </div>
    </Link>
  )
}

// ─── SKELETON ────────────────────────────────────────────────
function StatSkeleton() {
  return <div className="h-5 w-12 bg-white/[0.06] rounded animate-pulse" />
}

export default function HomePage() {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null)
  const [stats, setStats] = useState<EngagementStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient()

        // Total bookmarks count
        const { count: totalBookmarks } = await supabase
          .from("bookmarks")
          .select("*", { count: "exact", head: true })

        // Workspace sessions count
        const { count: totalSessions } = await supabase
          .from("workspace_sessions")
          .select("*", { count: "exact", head: true })

        // Top bookmarked components
        const { data: rawBookmarks } = await supabase
          .from("bookmarks")
          .select("component_name")
          .limit(2000)

        // Count saves per component
        const counts: Record<string, number> = {}
        for (const b of rawBookmarks || []) {
          counts[b.component_name] = (counts[b.component_name] || 0) + 1
        }

        const trendingComponents = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, saves]) => {
            const comp = COMPONENT_MAP.get(name)
            return {
              name,
              category: comp?.category ?? "Tool",
              saves,
              github_org: comp?.github_org,
            }
          })

        setStats({
          totalBookmarks: totalBookmarks ?? 0,
          totalSessions: totalSessions ?? 0,
          trending: trendingComponents,
        })
      } catch {
        // Supabase not yet configured — silently fail
        setStats({ totalBookmarks: 0, totalSessions: 0, trending: [] })
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const showTrending = stats && stats.trending.length > 0

  return (
    <div className="min-h-screen bg-surface-0 text-white">
      <Header />

      {/* ── HERO STRIP ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.05]">
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Green glow top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-500/10 blur-[80px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
          {/* Headline */}
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] max-w-3xl mb-5">
            Stop wasting{" "}
            <span className="text-brand-400">the first hour.</span>
          </h1>

          {/* Subhead */}
          <p className="text-zinc-400 text-lg leading-relaxed max-w-xl mb-8">
            Curated components, winning patterns, and SDG-aligned frameworks —
            everything you need the moment the clock starts.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25"
            >
              <Zap className="h-4 w-4" />
              Start Session
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            >
              Browse Library
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Stats strip — live data when available */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 pt-8 border-t border-white/[0.05]">
            {[
              {
                value: statsLoading ? null : (stats?.totalBookmarks ?? 0) > 0
                  ? stats!.totalBookmarks.toLocaleString()
                  : `${ALL_COMPONENTS.length}`,
                label: (stats?.totalBookmarks ?? 0) > 0 ? "tools bookmarked" : "curated tools",
              },
              {
                value: statsLoading ? null : (stats?.totalSessions ?? 0) > 0
                  ? stats!.totalSessions.toLocaleString()
                  : `${DOMAINS.length}`,
                label: (stats?.totalSessions ?? 0) > 0 ? "sessions started" : "challenge domains",
              },

            ].map((s, i) => (
              <div key={i}>
                <div className="text-lg font-bold text-brand-400">
                  {s.value === null ? <StatSkeleton /> : s.value}
                </div>
                <div className="text-xs text-zinc-600 font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING THIS WEEK (only when data exists) ──────────── */}
      {showTrending && (
        <section className="border-b border-white/[0.05] py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-baseline justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-500" />
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500">
                  trending this week
                </span>
              </div>
              <Link href="/library" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
                browse all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stats!.trending.map((t) => (
                <TrendingCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CHALLENGE DOMAINS ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
              01 · navigate
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Challenge Domains</h2>
          </div>
          <Link href="/workspace" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
            open workspace →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {DOMAINS.map((d) => (
            <Link
              key={d.n}
              href={`/workspace?domain=${d.slug}`}
              onMouseEnter={() => setHoveredDomain(d.n)}
              onMouseLeave={() => setHoveredDomain(null)}
              className="group relative rounded-xl border border-white/[0.06] bg-surface-1 p-4 transition-all duration-150 hover:border-brand-500/25 hover:bg-surface-2 block"
            >
              <div className="text-xl mb-3">{d.e}</div>
              <div className="text-sm font-medium text-zinc-200 mb-1 leading-snug group-hover:text-white transition-colors">
                {d.n}
              </div>
              <div className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                {d.d}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                <div className="flex gap-1 flex-wrap">
                  {d.tags.slice(0, 2).map((t) => (
                    <span key={t} className="font-mono text-[9px] text-zinc-600 bg-white/[0.04] rounded px-1.5 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[9px] text-zinc-700">
                  {d.p} projects
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WINNING PATTERNS ────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
                02 · learn
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Winning Patterns</h2>
              <p className="text-sm text-zinc-500 mt-1">Real stacks from top hackathons. &ldquo;Shop the look.&rdquo;</p>
            </div>
            <Link href="/analyze" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
              analyze a stack →
            </Link>
          </div>

          {/* Horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollSnapType: "x mandatory" }}>
            {PATTERNS.map((p) => (
              <div
                key={p.n}
                className="flex-none w-72 rounded-xl border border-white/[0.06] bg-surface-1 p-5 flex flex-col"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Place badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                    {p.ev} · {p.dom}
                  </span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${
                    p.pl === "1st Place"
                      ? "text-brand-400 bg-brand-500/10 border-brand-500/20"
                      : "text-zinc-400 bg-white/[0.04] border-white/[0.06]"
                  }`}>
                    {p.pl}
                  </span>
                </div>

                <div className="text-sm font-semibold text-zinc-100 mb-2">{p.n}</div>
                <div className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{p.d}</div>

                {/* Stack pills */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10px] px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  <Link
                    href={`/workspace?domain=${p.domainSlug}`}
                    className="flex-1 text-center text-[10px] font-mono rounded-lg border border-brand-500/25 text-brand-400 py-1.5 hover:bg-brand-500/10 transition-colors"
                  >
                    build this →
                  </Link>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-[10px] font-mono rounded-lg border border-white/[0.08] text-zinc-500 py-1.5 hover:text-zinc-300 hover:border-white/20 transition-colors"
                  >
                    view project ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING HACKATHONS ─────────────────────────────────── */}
      <section className="border-t border-white/[0.05] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
                03 · compete
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Upcoming Hackathons</h2>
              <p className="text-sm text-zinc-500 mt-1">Events worth preparing for. Show up ready.</p>
            </div>
            <a
              href="https://mlh.io/seasons/2026/events"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono shrink-0"
            >
              all events on MLH →
            </a>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6" style={{ scrollSnapType: "x mandatory" }}>
            {hackathonsData.hackathons.map((h) => (
              <a
                key={h.name}
                href={h.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ scrollSnapAlign: "start" }}
                className="flex-none w-60 rounded-xl border border-white/[0.06] bg-surface-1 p-4 hover:border-white/[0.12] hover:bg-surface-2 transition-all block"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 ${
                    h.registrationOpen
                      ? "text-brand-400 bg-brand-500/10 border-brand-500/20"
                      : "text-zinc-500 bg-white/[0.03] border-white/[0.06]"
                  }`}>
                    {h.registrationOpen ? "open" : "soon"}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">
                    {h.format}
                  </span>
                </div>
                <div className="text-sm font-semibold text-zinc-100 mb-0.5">{h.name}</div>
                <div className="text-[11px] text-zinc-600 mb-3">{h.org}</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-500">{h.date}</span>
                  <ArrowRight className="h-3 w-3 text-zinc-700" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPONENT PREVIEW ───────────────────────────────────── */}
      <section className="border-t border-white/[0.05] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-2">
                04 · build
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Component Library</h2>
              <p className="text-sm text-zinc-500 mt-1">
                {ALL_COMPONENTS.length} tools. Every one vetted with setup times and difficulty ratings.
              </p>
            </div>
            <Link href="/library" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
              browse all {ALL_COMPONENTS.length} →
            </Link>
          </div>

          {/* Preview grid — 6 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {FEATURED.map((c) => (
              <Link
                key={c.name}
                href="/library"
                className="group rounded-xl border border-white/[0.06] bg-surface-1 p-4 transition-all hover:border-white/[0.12] hover:bg-surface-2 block"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {c.github_org ? (
                      <img
                        src={`https://github.com/${c.github_org}.png?size=32`}
                        alt=""
                        className="h-7 w-7 rounded-md shrink-0 bg-surface-3 object-cover ring-1 ring-white/[0.06]"
                        loading="lazy"
                      />
                    ) : null}
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                      {c.name}
                    </span>
                  </div>
                  <span
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded shrink-0 ml-2"
                    style={{ color: CAT_COLORS[c.category], background: `${CAT_COLORS[c.category]}15` }}
                  >
                    {c.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">
                  {c.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-zinc-600">
                    <Clock className="h-3 w-3" style={{ color: "#fbbf24" }} />
                    <span className="font-mono text-[10px]" style={{ color: "#fbbf24" }}>
                      {c.setup_time_minutes}min
                    </span>
                    <span className="font-mono text-[10px] text-zinc-700 mx-1">·</span>
                    <DiffBadge d={c.difficulty} />
                  </div>
                  {c.github_url && (
                    <Github className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-2.5 text-sm text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
            >
              Browse all {ALL_COMPONENTS.length} components
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ───────────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-brand-500/15 bg-brand-500/[0.04] px-8 py-10 text-center">
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-brand-500 mb-4">
              ready to build
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              The workspace opens in seconds.
            </h2>
            <p className="text-zinc-500 text-sm mb-7 max-w-md mx-auto leading-relaxed">
              Define your problem, pick your domain, get a recommended stack — before your team
              has even found a table.
            </p>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/20"
            >
              <Zap className="h-4 w-4" />
              Open Workspace
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
