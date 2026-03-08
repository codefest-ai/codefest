import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Donate — Support HalalJobs.ai",
  description: "Support HalalJobs.ai with optional sadaqah. Free to use, community-supported.",
}

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-4xl mb-6">🤲</div>
        <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-3">Sadaqah</div>
        <h1 className="text-3xl font-bold text-ink-900 mb-4">Support the mission</h1>
        <p className="text-base text-ink-600 leading-relaxed mb-4 max-w-lg mx-auto">
          HalalJobs.ai is free to use and always will be. No paywalls, no data selling, no pay-to-rank employers.
        </p>
        <p className="text-base text-ink-600 leading-relaxed mb-10 max-w-lg mx-auto">
          If this has helped you find work aligned with your values — or if you simply believe in the
          mission — any contribution is a sadaqah that helps keep the site running, maintained, and growing.
        </p>

        <div className="bg-white border border-stone-200 rounded-2xl p-8 mb-8">
          <p className="text-sm text-ink-500 mb-4">Donation support coming soon.</p>
          <p className="text-sm text-ink-500 mb-6">
            In the meantime, the best thing you can do is suggest a job, share the site with a Muslim
            job seeker, or send us feedback.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/suggest"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Suggest a job
            </a>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 border border-stone-300 text-ink-700 rounded-xl px-6 py-2.5 text-sm font-semibold hover:border-teal-400 hover:text-teal-700 transition-colors"
            >
              Browse jobs
            </Link>
          </div>
        </div>

        <blockquote className="text-sm text-ink-400 italic">
          &ldquo;The believer&apos;s shade on the Day of Resurrection will be his charity.&rdquo;
          <br /><span className="text-xs not-italic">— Tirmidhi</span>
        </blockquote>
      </div>

      <Footer />
    </div>
  )
}
