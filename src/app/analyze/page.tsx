"use client"

// Note: metadata must be in a separate server component for pages with "use client"
// See src/app/analyze/layout.tsx for metadata

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Search, ExternalLink, Clock, ArrowRight, Zap, Github } from "lucide-react"

type ComponentResult = {
  name: string
  category: string
  description: string
  github_url: string
  docs_url: string
  setup_time_minutes: number
  difficulty: string
  tags: string[]
}

type AnalyzeResult = {
  matched: ComponentResult[]
  totalSetupMinutes: number
  source: "github" | "devpost" | "page"
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     "text-emerald-400 bg-emerald-500/10",
  intermediate: "text-amber-400 bg-amber-500/10",
  advanced:     "text-red-400 bg-red-500/10",
}

const CATEGORY_LABEL: Record<string, string> = {
  auth:        "Auth",
  payments:    "Payments",
  ai:          "AI",
  database:    "Database",
  ui:          "UI",
  forms:       "Forms",
  email:       "Email",
  storage:     "Storage",
  realtime:    "Realtime",
  canvas:      "Canvas",
  state:       "State",
  analytics:   "Analytics",
  i18n:        "i18n",
  maps:        "Maps",
  deployment:  "Deploy",
  background:  "Background",
}

function formatMinutes(m: number) {
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem === 0 ? `${h}h` : `${h}h ${rem}m`
}

const EXAMPLE_URLS = [
  "https://github.com/vercel/ai-chatbot",
  "https://devpost.com/software/healthai-hackathon",
  "https://github.com/shadcn-ui/next-template",
]

export default function AnalyzePage() {
  const searchParams = useSearchParams()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  async function runAnalyze(targetUrl: string) {
    if (!targetUrl.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setResult(data)
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 80)
      }
    } catch {
      setError("Network error — check your connection")
    } finally {
      setLoading(false)
    }
  }

  // Pre-fill from ?url= query param and auto-run
  useEffect(() => {
    const param = searchParams.get("url")
    if (param) {
      setUrl(param)
      runAnalyze(param)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    runAnalyze(url)
  }

  const sourceLabel: Record<string, string> = {
    github:  "GitHub repo",
    devpost: "DevPost project",
    page:    "project page",
  }

  return (
    <div className="min-h-screen bg-surface-0 text-white">
      <Header />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.05]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[160px] bg-brand-500/8 blur-[80px] pointer-events-none" />
        <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/[0.06] px-3 py-1 mb-6">
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-400">
              Stack Analyzer
            </span>
          </div>

          <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] max-w-xl mb-4">
            Paste a project URL.{" "}
            <span className="text-brand-400">See their stack.</span>
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed max-w-lg mb-10">
            Drop a GitHub repo or DevPost link. We scan the README and
            dependencies, match everything to the Codefest library, and
            show you exactly what they built with — and how long it would
            take to set up yourself.
          </p>

          {/* ── Input ─────────────────────────────────────────── */}
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/user/repo  or  devpost.com/software/…"
                className="w-full rounded-xl border border-white/[0.08] bg-surface-1 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-black transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  Scanning…
                </span>
              ) : (
                "Analyze stack"
              )}
            </button>
          </form>

          {/* Example URLs */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-zinc-700 font-mono">try:</span>
            {EXAMPLE_URLS.map((u) => (
              <button
                key={u}
                onClick={() => setUrl(u)}
                className="text-[11px] text-zinc-600 hover:text-zinc-400 font-mono transition-colors"
              >
                {u.replace("https://", "")}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* ── RESULTS ───────────────────────────────────────────── */}
      {result && (
        <section ref={resultsRef} className="py-12">
          <div className="mx-auto max-w-3xl px-6">

            {/* Summary bar */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/[0.05]">
              <div>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-brand-500 mb-1">
                  {sourceLabel[result.source] ?? "project"} · {result.matched.length} component{result.matched.length !== 1 ? "s" : ""} found
                </div>
                <p className="text-sm text-zinc-500 truncate max-w-sm">{url}</p>
              </div>
              {result.matched.length > 0 && (
                <div className="text-right shrink-0 ml-4">
                  <div className="text-xl font-bold tabular-nums">
                    {formatMinutes(result.totalSetupMinutes)}
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-0.5">total setup</div>
                </div>
              )}
            </div>

            {result.matched.length === 0 ? (
              /* No matches */
              <div className="text-center py-16">
                <div className="h-12 w-12 rounded-xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-5 w-5 text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium mb-1">No library matches found</p>
                <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                  This project may use uncommon dependencies, or the README
                  doesn't list them explicitly. Try the GitHub URL directly
                  to get package.json coverage.
                </p>
              </div>
            ) : (
              /* Match grid */
              <div className="space-y-3">
                {result.matched.map((comp, i) => (
                  <div
                    key={comp.name}
                    className="group flex items-start gap-4 rounded-xl border border-white/[0.06] bg-surface-1 px-5 py-4 hover:border-white/[0.1] hover:bg-surface-2 transition-all"
                  >
                    {/* Index */}
                    <div className="font-mono text-[11px] text-zinc-700 pt-0.5 w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium text-zinc-100">{comp.name}</span>
                        {comp.category && (
                          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                            {CATEGORY_LABEL[comp.category] ?? comp.category}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-medium rounded-full px-1.5 py-0.5 ${
                            DIFFICULTY_COLOR[comp.difficulty] ?? "text-zinc-500 bg-white/5"
                          }`}
                        >
                          {comp.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                        {comp.description}
                      </p>
                    </div>

                    {/* Right side */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-xs text-zinc-600">
                        <Clock className="h-3 w-3" />
                        {formatMinutes(comp.setup_time_minutes)}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={comp.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-700 hover:text-zinc-400 transition-colors"
                          title="GitHub"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={comp.docs_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-700 hover:text-zinc-400 transition-colors"
                          title="Docs"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer CTAs */}
            {result.matched.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/workspace"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-black transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25"
                >
                  <Zap className="h-4 w-4" />
                  Build something like this
                </Link>
                <Link
                  href="/library"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-surface-1 px-5 py-3 text-sm text-zinc-300 transition-all hover:bg-surface-2 hover:border-white/[0.12]"
                >
                  Browse full library
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS (shown when no result yet) ───────────── */}
      {!result && !loading && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6">
            <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-zinc-700 mb-8">
              how it works
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  n: "01",
                  h: "Paste any URL",
                  b: "GitHub repo or DevPost project page. We'll pull the README and package.json automatically.",
                },
                {
                  n: "02",
                  h: "We scan the stack",
                  b: "Dependencies, tech mentions, and config files are matched against 58 curated components.",
                },
                {
                  n: "03",
                  h: "See what they built with",
                  b: "Every match links to the Codefest library entry — docs, setup time, difficulty, and all.",
                },
              ].map((item) => (
                <div key={item.n} className="rounded-xl border border-white/[0.06] bg-surface-1 p-5">
                  <div className="font-mono text-[10px] text-brand-500 mb-2">{item.n}</div>
                  <div className="text-sm font-medium text-zinc-200 mb-1.5">{item.h}</div>
                  <div className="text-xs text-zinc-500 leading-relaxed">{item.b}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
