import Link from "next/link"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScreeningBadge } from "@/components/ScreeningBadge"
import { SCREENING_STATUSES, AAOIFI_CRITERIA, ACTIVITIES, type ScreeningStatus } from "@/data/screening"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About HalalJobs.ai",
  description:
    "Learn how we screen employers using AAOIFI-aligned criteria, our methodology, and our mission to help Muslims find work that aligns with their values.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      {/* Hero */}
      <section className="bg-white border-b border-stone-200 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-3">Our mission</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 leading-tight mb-5">
            See the whole market.<br className="hidden sm:block" /> Filter by your values.
          </h1>
          <p className="text-base text-ink-600 leading-relaxed max-w-2xl">
            HalalJobs.ai shows you the entire job market — not just a curated list of &ldquo;approved&rdquo; jobs.
            Every employer is screened using AAOIFI-aligned criteria, the same framework trusted by Islamic
            finance platforms worldwide. You see the facts. You decide what fits your values.
          </p>
          <p className="text-base text-ink-600 leading-relaxed max-w-2xl mt-4">
            We don&apos;t invent our own scoring system. We don&apos;t issue fatwas. We apply established,
            recognized screening criteria and let you filter based on your own madhhab, scholarship, and
            personal circumstances.
          </p>
        </div>
      </section>

      {/* Methodology */}
      <section id="methodology" className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-3">AAOIFI-aligned</div>
          <h2 className="text-2xl font-bold text-ink-900 mb-2">How we screen employers</h2>
          <p className="text-sm text-ink-500 mb-8 leading-relaxed">
            Our screening is based on AAOIFI Standard 21 — the same criteria that IFG (Islamic Finance Guru),
            Zoya, Musaffa, and Islamicly use for stock screening. We&apos;ve adapted these criteria from stocks to
            employers.
          </p>

          {/* AAOIFI Criteria */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-8">
            <h3 className="text-base font-bold text-ink-900 mb-4">AAOIFI screening criteria</h3>
            <div className="space-y-4">
              {AAOIFI_CRITERIA.map(c => (
                <div key={c.id} className="flex gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                    {c.threshold.includes("5%") ? "<5%" : "✓"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink-900 mb-0.5">{c.label}</div>
                    <p className="text-sm text-ink-600 leading-relaxed">{c.description}</p>
                    <p className="text-xs text-ink-400 mt-1">Threshold: {c.threshold} · Source: {c.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The 4 statuses */}
          <div className="space-y-4 mb-10">
            <h3 className="text-base font-bold text-ink-900 mb-2">Screening statuses</h3>
            <p className="text-sm text-ink-500 mb-4">
              Each employer receives one of four statuses based on how they perform against the criteria above.
              These match the terminology used across established Islamic finance platforms.
            </p>
            {(["COMPLIANT", "DOUBTFUL", "NON_COMPLIANT", "NOT_SCREENED"] as ScreeningStatus[]).map(status => {
              const info = SCREENING_STATUSES[status]
              return (
                <div key={status} className={`flex gap-4 rounded-2xl p-5 border ${info.bg} ${info.border}`}>
                  <div className="shrink-0 mt-0.5">
                    <ScreeningBadge status={status} size="md" />
                  </div>
                  <div>
                    <p className={`text-sm leading-relaxed ${info.color}`}>{info.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Activities we flag */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-8">
            <h3 className="text-base font-bold text-ink-900 mb-2">Activities we flag</h3>
            <p className="text-sm text-ink-500 mb-4">
              These are factual observations about an employer&apos;s business — not judgments. Activities marked
              &ldquo;auto-fail&rdquo; mean the employer&apos;s core business is in that activity. &ldquo;Requires review&rdquo; means
              the activity exists but may or may not affect compliance depending on the proportion and your madhhab.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACTIVITIES.map(a => (
                <div key={a.id} className="flex items-start gap-2 text-xs">
                  <span className="shrink-0 text-sm">{a.emoji}</span>
                  <div>
                    <span className="font-medium text-ink-800">{a.label}</span>
                    <span className={`ml-1 text-[10px] font-medium ${a.screening_impact === "fail" ? "text-red-600" : "text-amber-600"}`}>
                      ({a.screening_impact === "fail" ? "auto-fail" : "requires review"})
                    </span>
                    <p className="text-ink-500 mt-0.5">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What we consider */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
            <h3 className="text-base font-bold text-ink-900 mb-4">What we look at for each employer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <div className="text-sm font-semibold text-ink-800 mb-2">🏢 Core business</div>
                <p className="text-xs text-ink-500 leading-relaxed">
                  What does the company primarily do? Is the core business activity permissible?
                  A tech company that happens to have a small finance arm vs. a bank — different categories.
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-800 mb-2">💰 Revenue sources</div>
                <p className="text-xs text-ink-500 leading-relaxed">
                  Where does the money come from? We look at the proportion of revenue from different
                  sources, applying AAOIFI&apos;s 5% thresholds for non-permissible income.
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-800 mb-2">👤 Role specifics</div>
                <p className="text-xs text-ink-500 leading-relaxed">
                  Even at a compliant employer, some roles may have concerns. We flag role-specific
                  issues so you can evaluate the complete picture.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 leading-relaxed">
            <strong>Important:</strong> This screening uses established AAOIFI-aligned criteria, but the application
            to employment (rather than stock investment) is our adaptation. We are not scholars. We surface the
            relevant facts using a recognized framework, so you can make an informed decision. For complex
            situations, always consult a qualified scholar who knows your circumstances.
          </div>
        </div>
      </section>

      {/* Scholar panel */}
      <section id="scholars" className="py-14 bg-white border-t border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-3">Scholarly guidance</div>
          <h2 className="text-2xl font-bold text-ink-900 mb-2">Scholar panel</h2>
          <p className="text-sm text-ink-500 mb-8 leading-relaxed">
            We apply recognized AAOIFI standards as our baseline. We are currently building a formal scholar
            panel to review our adaptation of these criteria to employment screening — if you are a qualified
            scholar interested in reviewing our methodology, we would love to hear from you.
          </p>

          <div className="bg-cream-100 border border-stone-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🤲</div>
            <h3 className="text-base font-semibold text-ink-800 mb-2">Are you a qualified scholar?</h3>
            <p className="text-sm text-ink-500 mb-4 max-w-md mx-auto">
              We&apos;re actively looking for qualified scholars across madhabs to review and advise on our
              screening methodology. This is a voluntary, community-supported effort.
            </p>
            <a
              href="mailto:hello@halaljobs.ai?subject=Scholar Panel Interest"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              Get in touch
            </a>
          </div>

          {/* Methodological sources */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-ink-700 mb-3">Standards and sources we draw on</h3>
            <div className="space-y-2 text-sm text-ink-500">
              <div className="flex items-start gap-2">
                <span className="text-teal-500 mt-0.5">·</span>
                <span><strong className="text-ink-700">AAOIFI Standard 21</strong> — Shariah screening criteria used by Islamic financial institutions globally</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-500 mt-0.5">·</span>
                <span><strong className="text-ink-700">IFG, Zoya, Musaffa</strong> — Established Islamic finance platforms that apply these standards to stock screening</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-500 mt-0.5">·</span>
                <span><strong className="text-ink-700">Fiqh councils</strong> — OIC Fiqh Academy, ECFR, AMJA rulings on employment and commerce</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-500 mt-0.5">·</span>
                <span><strong className="text-ink-700">Halal certification bodies</strong> — IFANCA, HFA, ISWA standards where relevant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & sustainability */}
      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-3">Free. Always.</div>
          <h2 className="text-2xl font-bold text-ink-900 mb-4">Community-supported</h2>
          <p className="text-sm text-ink-600 leading-relaxed mb-6">
            HalalJobs.ai is free to use and always will be. We don&apos;t charge job seekers. We don&apos;t sell your
            data. We don&apos;t let employers pay to change their screening status.
          </p>
          <p className="text-sm text-ink-600 leading-relaxed mb-8">
            The site is supported entirely by optional sadaqah donations from Muslims who believe in the
            mission. If this has helped you, consider contributing — even a small amount keeps the lights on
            and lets us screen more employers and add more listings.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Donate (Sadaqah)
            </Link>
            <a
              href="/suggest"
              className="inline-flex items-center gap-2 border border-stone-300 text-ink-700 rounded-xl px-6 py-2.5 text-sm font-semibold hover:border-teal-400 hover:text-teal-700 transition-colors"
            >
              Suggest a job
            </a>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-teal-700 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <blockquote className="text-teal-100 text-base sm:text-lg leading-relaxed italic mb-3">
            &ldquo;And seek, through that which Allah has given you, the home of the Hereafter; and [yet],
            do not forget your share of the world.&rdquo;
          </blockquote>
          <cite className="text-teal-400 text-sm font-medium">Quran 28:77</cite>
        </div>
      </section>

      <Footer />
    </div>
  )
}
