"use client"

import { useState } from "react"
import Link from "next/link"
import { Zap, ArrowRight, Clock, Github } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import componentsData from "@/data/components_seed.json"
import { DOMAINS, PATTERNS, CAT_COLORS, DIFF_COLORS } from "@/data/constants"

type Component = {
  name: string; category: string; description: string;
  github_url?: string; docs_url?: string;
  setup_time_minutes: number; difficulty: string; tags: string[];
}

const ALL_COMPONENTS: Component[] = (componentsData as { components: Component[] }).components
const FEATURED = ALL_COMPONENTS.slice(0, 6)

// ─── DIFFICULTY BADGE ────────────────────────────────────────
function DiffBadge({ d }: { d: string }) {
  const color = DIFF_COLORS[d] ?? "#6b7280"
  return (
    <span style={{ color, fontSize: "10px", fontFamily: "var(--font-geist-mono)", letterSpacing: "0.05em" }}>
      {d}
    </span>
  )
}

export default function HomePage() {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-surface-0 text-white">
      <Header />

      {/* ── HERO STRIP ─────────────────────────────────────────── */}
      {/* Compact, confident — not full-screen. Content follows immediately. */}
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

          {/* Stats strip */}
          <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/[0.05]">
            {[
              { value: `${ALL_COMPONENTS.length}`, label: "curated components" },
              { value: `${DOMAINS.length}`, label: "challenge domains" },
              { value: "~15min", label: "avg setup time saved" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-lg font-bold text-brand-400">{s.value}</div>
                <div className="text-xs text-zinc-600 font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE DOMAINS ───────────────────────────────────── */}
      {/* Content-first: this is the product, not a feature list */}
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
            <Link href="/showcase" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
              view showcase →
            </Link>
          </div>

          {/* Horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollSnapType: "x mandatory" }}>
            {PATTERNS.map((p) => (
              <div
                key={p.n}
                className="flex-none w-72 rounded-xl border border-white/[0.06] bg-surface-1 p-5"
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
                <div className="flex gap-1.5 flex-wrap">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[10px] px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
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
                03 · build
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
                  <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {c.name}
                  </span>
                  <span
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded"
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
