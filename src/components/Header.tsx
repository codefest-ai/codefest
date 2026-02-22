"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Menu, X, Zap, LogOut, User, GraduationCap, Bookmark, ChevronDown } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import { ThemeToggle } from "@/components/ThemeToggle"

// Primary — always visible in desktop nav
const PRIMARY_NAV = [
  { label: "Library",   href: "/library" },
  { label: "Workspace", href: "/workspace" },
  { label: "Guide",     href: "/guide" },
]

// Secondary — lives in the "More" dropdown on desktop, shown in full on mobile
const MORE_NAV = [
  { label: "Blog",        href: "/blog",        desc: "Guides and thinking for hackathon builders" },
  { label: "Analyze",     href: "/analyze",     desc: "Paste a GitHub or DevPost URL — see their stack" },
  { label: "Organizers",  href: "/organizers",  desc: "Why faculty endorse Codefest at their events" },
  { label: "About",       href: "/about",       desc: "The belief system behind the platform" },
]

export function Header() {
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [moreOpen,    setMoreOpen]    = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const { user, loading, isEdu, signOut } = useAuth()

  const userMenuRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const avatarUrl   = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-surface-0/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 transition-shadow group-hover:shadow-lg group-hover:shadow-brand-500/25">
            <Zap className="h-4 w-4 text-black" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            codefest<span className="text-brand-400">.ai</span>
          </span>
        </Link>

        {/* ── Desktop primary nav ───────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white rounded-lg hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white rounded-lg hover:bg-white/5"
            >
              More
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-white/[0.06] bg-surface-1 shadow-xl shadow-black/40 py-2 overflow-hidden">
                {MORE_NAV.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col px-4 py-3 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm text-zinc-200 font-medium">{item.label}</span>
                    <span className="text-xs text-zinc-600 mt-0.5 leading-snug">{item.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ── Desktop right side ───────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {loading ? (
            <div className="h-8 w-20 rounded-lg bg-surface-2 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full ring-2 ring-white/10" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
                <span className="text-sm text-zinc-300 max-w-[120px] truncate">{displayName}</span>
                {isEdu && (
                  <span title="Student account">
                    <GraduationCap className="h-3.5 w-3.5 text-brand-400" />
                  </span>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/[0.06] bg-surface-1 shadow-xl shadow-black/40 py-1.5 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-medium text-white truncate">{displayName}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    {isEdu && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium text-brand-400 bg-brand-500/10 rounded-full px-2 py-0.5">
                        <GraduationCap className="h-2.5 w-2.5" />
                        Student
                      </span>
                    )}
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="h-3.5 w-3.5" />
                    My Profile
                  </Link>
                  <Link
                    href="/library"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    My Bookmarks
                  </Link>
                  <button
                    onClick={() => { setUserMenuOpen(false); signOut() }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white hover:bg-white/5"
              >
                Sign in
              </Link>
              <Link
                href="/library"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-black transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25"
              >
                Browse Library
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile toggle ────────────────────────────────────── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-surface-0/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">

            {/* Primary */}
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="pt-2 pb-1">
              <div className="border-t border-white/[0.05]" />
              <p className="px-4 pt-3 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                More
              </p>
            </div>

            {/* Secondary */}
            {MORE_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm text-zinc-500 hover:text-white rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}

            {/* Auth */}
            <div className="pt-2">
              <div className="border-t border-white/[0.05] mb-3" />
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); signOut() }}
                    className="block w-full mt-1 rounded-lg border border-white/10 px-4 py-3 text-sm text-zinc-300 text-center"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg border border-white/10 px-4 py-3 text-sm text-zinc-300 text-center"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/library"
                    onClick={() => setMobileOpen(false)}
                    className="block mt-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-black text-center"
                  >
                    Browse Library
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
