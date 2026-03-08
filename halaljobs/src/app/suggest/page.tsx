"use client"

import { useState } from "react"
import Link from "next/link"
import { Send, CheckCircle, ArrowLeft } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function SuggestPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const company = data.get("company") as string
    const jobTitle = data.get("jobTitle") as string
    const jobUrl = data.get("jobUrl") as string
    const notes = data.get("notes") as string

    // Build mailto link with prefilled data
    const subject = encodeURIComponent(`Job Suggestion: ${jobTitle} at ${company}`)
    const body = encodeURIComponent(
      `Job Suggestion\n` +
      `─────────────\n\n` +
      `Company: ${company}\n` +
      `Job Title: ${jobTitle}\n` +
      `Job URL: ${jobUrl}\n\n` +
      `Notes:\n${notes || "(none)"}\n\n` +
      `─────────────\n` +
      `Sent via HalalJobs.ai suggestion form`
    )
    window.open(`mailto:hello@halaljobs.ai?subject=${subject}&body=${body}`, "_self")
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream-100">
        <Header />
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-ink-900 mb-2">Thank you!</h1>
            <p className="text-sm text-ink-600 mb-6">
              Your email client should have opened with the suggestion prefilled.
              If it didn&apos;t, you can also email us directly at{" "}
              <a href="mailto:hello@halaljobs.ai" className="text-teal-600 font-medium">
                hello@halaljobs.ai
              </a>
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Browse jobs
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2 border border-stone-300 text-ink-700 rounded-xl px-5 py-2.5 text-sm font-semibold hover:border-teal-400 hover:text-teal-700 transition-colors"
              >
                Suggest another
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-3">Community-powered</div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Suggest a job</h1>
        <p className="text-sm text-ink-500 mb-8 leading-relaxed">
          Know a job that should be on HalalJobs? Tell us about it and we&apos;ll screen the employer
          using our AAOIFI-aligned criteria. Every suggestion helps the community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-ink-700 mb-1">
              Company name <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              placeholder="e.g., Microsoft, Islamic Relief, Salam Bank..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-ink-700 mb-1">
              Job title <span className="text-red-500">*</span>
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              required
              placeholder="e.g., Software Engineer, Marketing Manager..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="jobUrl" className="block text-sm font-medium text-ink-700 mb-1">
              Job listing URL
            </label>
            <input
              id="jobUrl"
              name="jobUrl"
              type="url"
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-xs text-ink-400 mt-1">Link to the original job posting (LinkedIn, company careers page, etc.)</p>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-ink-700 mb-1">
              Anything else we should know?
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="e.g., 'This company is Muslim-founded' or 'The role involves alcohol service'"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-3 text-sm font-semibold transition-colors"
          >
            <Send className="h-4 w-4" />
            Submit suggestion
          </button>

          <p className="text-xs text-ink-400 text-center">
            This opens your email client with the details prefilled. We review every suggestion.
          </p>
        </form>

        <div className="mt-10 bg-stone-50 border border-stone-200 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-ink-700 mb-2">What happens next?</h3>
          <div className="space-y-2 text-xs text-ink-500">
            <div className="flex items-start gap-2">
              <span className="text-teal-500 mt-0.5 font-bold">1.</span>
              <span>We receive your suggestion and research the employer</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-500 mt-0.5 font-bold">2.</span>
              <span>We screen the employer using AAOIFI-aligned criteria (revenue sources, core business, etc.)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-500 mt-0.5 font-bold">3.</span>
              <span>The job goes live with the employer&apos;s screening status visible</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
