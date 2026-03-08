"use client"
import Link from "next/link"
import { useState } from "react"
import { Menu, X, Search } from "lucide-react"

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">هـ</span>
          </div>
          <div className="leading-tight">
            <div className="font-bold text-ink-900 text-base tracking-tight">HalalJobs</div>
            <div className="text-[10px] text-teal-600 font-medium tracking-wide uppercase">.ai</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-sm text-ink-700 hover:text-teal-600 transition-colors font-medium">Browse Jobs</Link>
          <Link href="/employers" className="text-sm text-ink-700 hover:text-teal-600 transition-colors font-medium">Employers</Link>
          <Link href="/about" className="text-sm text-ink-700 hover:text-teal-600 transition-colors font-medium">About</Link>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 text-sm text-ink-600 border border-stone-300 rounded-lg px-3 py-1.5 hover:border-teal-500 hover:text-teal-600 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            Search jobs
          </Link>
          <a
            href="mailto:hello@halaljobs.ai"
            className="text-sm bg-teal-600 text-white rounded-lg px-4 py-1.5 hover:bg-teal-700 transition-colors font-medium"
          >
            Post a Job
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-ink-700 p-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 flex flex-col gap-4">
          <Link href="/jobs" className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>Browse Jobs</Link>
          <Link href="/employers" className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>Employers</Link>
          <Link href="/about" className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>About</Link>
          <a href="mailto:hello@halaljobs.ai" className="text-sm bg-teal-600 text-white rounded-lg px-4 py-2 text-center font-medium">
            Post a Job
          </a>
        </div>
      )}
    </header>
  )
}
