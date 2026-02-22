"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { useAuth } from "@/components/AuthProvider"
import { getBookmarks, addBookmark, removeBookmark } from "@/lib/bookmarks"
import componentsData from "@/data/components_seed.json"
import { CATEGORY_META, CATEGORIES } from "@/data/constants"
import {
  Search,
  ExternalLink,
  BookOpen,
  Clock,
  Filter,
  X,
  Bookmark,
  ArrowUpDown,
  Sparkles,
  LogIn,
} from "lucide-react"
import Link from "next/link"

type Component = {
  name: string
  category: string
  description: string
  github_url?: string
  docs_url?: string
  setup_time_minutes: number
  difficulty: string
  tags: string[]
  github_org?: string
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const components: Component[] = componentsData.components

const categories = Array.from(new Set(components.map((c) => c.category))).sort()
const difficulties = ["beginner", "intermediate", "advanced"]

const categoryMeta: Record<string, { color: string; bg: string; label: string; border: string }> = {
  auth: { color: "text-accent-cyan", bg: "bg-accent-cyan/10", label: "Auth", border: "border-accent-cyan/20" },
  payments: { color: "text-accent-amber", bg: "bg-accent-amber/10", label: "Payments", border: "border-accent-amber/20" },
  ai: { color: "text-purple-400", bg: "bg-purple-500/10", label: "AI", border: "border-purple-500/20" },
  database: { color: "text-blue-400", bg: "bg-blue-500/10", label: "Database", border: "border-blue-500/20" },
  ui: { color: "text-brand-400", bg: "bg-brand-500/10", label: "UI", border: "border-brand-500/20" },
  api: { color: "text-orange-400", bg: "bg-orange-500/10", label: "API", border: "border-orange-500/20" },
  devtools: { color: "text-pink-400", bg: "bg-pink-500/10", label: "DevTools", border: "border-pink-500/20" },
}

const difficultyMeta: Record<string, { color: string; bg: string }> = {
  beginner: { color: "text-brand-400", bg: "bg-brand-500/10" },
  intermediate: { color: "text-accent-amber", bg: "bg-accent-amber/10" },
  advanced: { color: "text-accent-rose", bg: "bg-accent-rose/10" },
}

type SortKey = "name" | "setup_time" | "difficulty"

export default function LibraryPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>("name")
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Load bookmarks from Supabase when user changes
  useEffect(() => {
    if (user) {
      getBookmarks().then(setBookmarked)
    } else {
      setBookmarked(new Set())
    }
  }, [user])

  const toggleBookmark = useCallback(
    async (name: string) => {
      if (!user) return

      const isCurrentlyBookmarked = bookmarked.has(name)

      // Optimistic update
      setBookmarked((prev) => {
        const next = new Set(prev)
        if (isCurrentlyBookmarked) next.delete(name)
        else next.add(name)
        return next
      })

      // Persist to Supabase
      const success = isCurrentlyBookmarked
        ? await removeBookmark(name)
        : await addBookmark(name)

      // Rollback on failure + notify user
      if (!success) {
        setBookmarked((prev) => {
          const next = new Set(prev)
          if (isCurrentlyBookmarked) next.add(name)
          else next.delete(name)
          return next
        })
        setToast("Couldn't save bookmark — please try again")
        setTimeout(() => setToast(null), 3500)
      }
    },
    [user, bookmarked]
  )

  const filtered = useMemo(() => {
    let result = components

    if (showBookmarkedOnly) {
      result = result.filter((c) => bookmarked.has(c.name))
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory)
    }

    if (selectedDifficulty) {
      result = result.filter((c) => c.difficulty === selectedDifficulty)
    }

    const diffOrder: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 }
    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "setup_time") return a.setup_time_minutes - b.setup_time_minutes
      if (sortBy === "difficulty")
        return (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0)
      return 0
    })

    return result
  }, [search, selectedCategory, selectedDifficulty, sortBy, showBookmarkedOnly, bookmarked])

  const activeFilters =
    (selectedCategory ? 1 : 0) + (selectedDifficulty ? 1 : 0) + (search ? 1 : 0) + (showBookmarkedOnly ? 1 : 0)

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory(null)
    setSelectedDifficulty(null)
    setShowBookmarkedOnly(false)
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <Header />

      <main className="pt-20 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  Component Library
                </h1>
                <p className="text-zinc-400 text-lg max-w-2xl">
                  {components.length} curated tools and libraries for your next hackathon.
                  Every component vetted with setup times, difficulty ratings, and direct links.
                </p>
              </div>
              {!user && (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 shrink-0 rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-2 text-sm text-brand-400 hover:bg-brand-500/10 transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign in to bookmark
                </Link>
              )}
            </div>
          </div>

          {/* Category Building Blocks */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-mono">Browse by building block</p>
              <span className="text-xs text-zinc-600 font-mono">7 categories</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
              {CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat]
                const count = components.filter(c => c.category === cat).length
                return (
                  <Link
                    key={cat}
                    href={`/library/category/${cat}`}
                    className="group flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-surface-1/60 p-4 transition-all hover:border-white/[0.14] hover:bg-surface-2/80"
                  >
                    <div className="text-2xl">{meta.icon}</div>
                    <div>
                      <div className="text-sm font-semibold text-white leading-tight mb-0.5 group-hover:text-brand-400 transition-colors">
                        {meta.label}
                      </div>
                      <div className="text-[11px] font-mono" style={{ color: meta.color }}>{count} tools</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search components, tags, or descriptions..."
                className="w-full rounded-xl border border-white/[0.08] bg-surface-1 pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/25 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                <Filter className="h-3 w-3" />
                Filter
              </span>

              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const meta = categoryMeta[cat] || {
                    color: "text-zinc-400",
                    bg: "bg-zinc-800",
                    label: cat,
                    border: "border-zinc-700",
                  }
                  const isActive = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(isActive ? null : cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        isActive
                          ? `${meta.bg} ${meta.color} ring-1 ring-current/20`
                          : "text-zinc-500 bg-surface-2 hover:text-zinc-300 hover:bg-surface-3"
                      }`}
                    >
                      {meta.label}
                    </button>
                  )
                })}
              </div>

              <div className="h-4 w-px bg-white/[0.08]" />

              {/* Difficulty pills */}
              <div className="flex gap-1.5">
                {difficulties.map((diff) => {
                  const meta = difficultyMeta[diff] || {
                    color: "text-zinc-400",
                    bg: "bg-zinc-800",
                  }
                  const isActive = selectedDifficulty === diff
                  return (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(isActive ? null : diff)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                        isActive
                          ? `${meta.bg} ${meta.color} ring-1 ring-current/20`
                          : "text-zinc-500 bg-surface-2 hover:text-zinc-300 hover:bg-surface-3"
                      }`}
                    >
                      {diff}
                    </button>
                  )
                })}
              </div>

              {/* Bookmarked toggle */}
              {user && bookmarked.size > 0 && (
                <>
                  <div className="h-4 w-px bg-white/[0.08]" />
                  <button
                    onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all ${
                      showBookmarkedOnly
                        ? "text-brand-400 bg-brand-500/10 ring-1 ring-brand-500/20"
                        : "text-zinc-500 bg-surface-2 hover:text-zinc-300 hover:bg-surface-3"
                    }`}
                  >
                    <Bookmark className="h-3 w-3" fill={showBookmarkedOnly ? "currentColor" : "none"} />
                    Bookmarked ({bookmarked.size})
                  </button>
                </>
              )}

              {activeFilters > 0 && (
                <>
                  <div className="h-4 w-px bg-white/[0.08]" />
                  <button
                    onClick={clearFilters}
                    className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </button>
                </>
              )}

              {/* Sort */}
              <div className="ml-auto flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3 text-zinc-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="text-xs bg-surface-2 text-zinc-400 border border-white/[0.06] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500/50 cursor-pointer"
                >
                  <option value="name">Name</option>
                  <option value="setup_time">Setup Time</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 text-sm text-zinc-500">
            Showing {filtered.length} of {components.length} components
          </div>

          {/* Component Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-flex rounded-2xl bg-surface-2 p-4 mb-5">
                <Search className="h-6 w-6 text-zinc-600" />
              </div>
              <p className="text-zinc-400 text-lg mb-2">No components match your filters.</p>
              <button
                onClick={clearFilters}
                className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((comp) => {
                const catMeta = categoryMeta[comp.category] || {
                  color: "text-zinc-400",
                  bg: "bg-zinc-800",
                  label: comp.category,
                  border: "border-zinc-700",
                }
                const diffMeta = difficultyMeta[comp.difficulty] || {
                  color: "text-zinc-400",
                  bg: "bg-zinc-800",
                }
                const isBookmarked = bookmarked.has(comp.name)

                return (
                  <div
                    key={comp.name}
                    className="group relative rounded-2xl border border-white/[0.06] bg-surface-1/80 p-6 transition-all duration-200 hover:border-white/[0.12] hover:bg-surface-2/80"
                  >
                    {/* Stretch link — covers whole card, sits behind interactive elements */}
                    <Link href={`/library/${toSlug(comp.name)}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={`View ${comp.name} details`} />
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex items-start gap-3">
                        {/* Logo */}
                        {comp.github_org ? (
                          <img
                            src={`https://github.com/${comp.github_org}.png?size=40`}
                            alt=""
                            className="h-9 w-9 rounded-lg shrink-0 bg-surface-3 object-cover ring-1 ring-white/[0.06]"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`h-9 w-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold ${catMeta.bg} ${catMeta.color} ring-1 ring-white/[0.06]`}>
                            {comp.name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                        <h3 className="font-semibold text-white text-base mb-1.5 group-hover:text-brand-400 transition-colors truncate">
                          {comp.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${catMeta.bg} ${catMeta.color}`}
                          >
                            {catMeta.label}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${diffMeta.bg} ${diffMeta.color}`}
                          >
                            {comp.difficulty}
                          </span>
                        </div>
                        </div>{/* end name+badges */}
                      </div>{/* end logo+text row */}
                      {user && (
                        <button
                          onClick={() => toggleBookmark(comp.name)}
                          className={`relative z-10 p-2 rounded-lg transition-all shrink-0 ${
                            isBookmarked
                              ? "text-brand-400 bg-brand-500/10 hover:bg-brand-500/20"
                              : "text-zinc-600 hover:text-zinc-400 hover:bg-white/5"
                          }`}
                          title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                        >
                          <Bookmark
                            className="h-4 w-4"
                            fill={isBookmarked ? "currentColor" : "none"}
                          />
                        </button>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                      {comp.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {comp.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-surface-3/80 px-2 py-0.5 text-[11px] text-zinc-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {comp.setup_time_minutes} min setup
                      </span>
                      <div className="relative z-10 flex items-center gap-3">
                        {comp.github_url && (
                          <a
                            href={comp.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            GitHub
                          </a>
                        )}
                        {comp.docs_url && (
                          <a
                            href={comp.docs_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                          >
                            <BookOpen className="h-3 w-3" />
                            Docs
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Toast notification for bookmark errors */}
      {toast && (
        <div
          style={{
            position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
            zIndex: 9999, background: "#1c1c1e", border: "1px solid rgba(244,114,182,0.35)",
            borderRadius: "10px", padding: "10px 18px",
            fontFamily: "ui-monospace, monospace", fontSize: "12px", color: "#f9a8d4",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)", whiteSpace: "nowrap",
            animation: "fadeIn 0.15s ease",
          }}
        >
          ⚠ {toast}
        </div>
      )}
    </div>
  )
}
