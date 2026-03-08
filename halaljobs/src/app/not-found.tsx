import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-ink-900 mb-3">Page not found</h1>
        <p className="text-ink-500 text-base mb-8">
          The page you&apos;re looking for doesn&apos;t exist. It may have moved or been removed.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
          >
            Browse jobs
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-stone-300 text-ink-700 rounded-xl px-6 py-2.5 text-sm font-semibold hover:border-teal-400 hover:text-teal-700 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
