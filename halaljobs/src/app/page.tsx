import Link from "next/link"
import { Search, ArrowRight, CheckCircle, Users, Filter } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { JobCard } from "@/components/JobCard"
import { ScreeningBadge } from "@/components/ScreeningBadge"
import { ConcernBadges } from "@/components/ConcernBadges"
import { SCREENING_STATUSES, INDUSTRIES, type ActivityTag, type PositiveTag, type ScreeningStatus } from "@/data/screening"
import jobsData from "@/data/jobs.json"
import employersData from "@/data/employers.json"

function getEmployer(id: string) {
  return employersData.employers.find(e => e.id === id) ?? null
}

const FEATURED = jobsData.jobs
  .filter(j => j.featured)
  .map(job => ({ job, employer: getEmployer(job.employer_id) }))
  .filter((x): x is { job: typeof jobsData.jobs[0]; employer: NonNullable<ReturnType<typeof getEmployer>> } => x.employer !== null)
  .slice(0, 6)

export default function HomePage() {
  const totalJobs = jobsData.jobs.length
  const totalEmployers = employersData.employers.length
  const compliantJobs = jobsData.jobs.filter(j => {
    const emp = getEmployer(j.employer_id)
    return emp && emp.screening_status === "COMPLIANT"
  }).length

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      {/* HERO */}
      <section className="pattern-bg border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-6">
              <span className="text-xs font-semibold text-teal-700 tracking-wide">
                {totalJobs} jobs · {totalEmployers} screened employers
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 leading-[1.1] tracking-tight mb-5">
              See the job market
              <span className="text-teal-600"> through</span>
              <br />your values.
            </h1>
            <p className="text-lg text-ink-600 leading-relaxed mb-8 max-w-lg">
              Every employer screened using AAOIFI-aligned criteria. Filter by what matters to you.
              We show the facts — you decide.
            </p>
            <form action="/jobs" method="GET" className="flex gap-2 max-w-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  name="q"
                  type="text"
                  placeholder="Job title, company, or keyword..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-3 text-sm font-semibold transition-colors shrink-0">
                Search
              </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: "Compliant", href: "/jobs?screening=COMPLIANT" },
                { label: "🕌 Islamic orgs", href: "/jobs?show=islamic_org" },
                { label: "Remote", href: "/jobs?q=Remote" },
                { label: "Technology", href: "/jobs?industry=technology" },
                { label: "Healthcare", href: "/jobs?industry=healthcare" },
              ].map(tag => (
                <Link key={tag.label} href={tag.href} className="text-xs text-ink-600 bg-white border border-stone-200 rounded-full px-3 py-1 hover:border-teal-400 hover:text-teal-600 transition-colors">
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-stone-200 py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-2">AAOIFI-aligned screening</div>
              <h2 className="text-2xl font-bold text-ink-900">How it works</h2>
            </div>
            <Link href="/about#methodology" className="text-sm text-ink-500 hover:text-teal-600 font-medium transition-colors hidden sm:block">Learn more →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-cream-100 rounded-xl p-5 border border-stone-200">
              <div className="text-2xl mb-3">🏢</div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">We screen employers</h3>
              <p className="text-xs text-ink-500 leading-relaxed">Using AAOIFI-aligned criteria — the same standards IFG, Zoya, and Musaffa use for stock screening — adapted for employers.</p>
            </div>
            <div className="bg-cream-100 rounded-xl p-5 border border-stone-200">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">You see the screening</h3>
              <p className="text-xs text-ink-500 leading-relaxed">Every listing shows the employer&apos;s screening status: Compliant, Doubtful, Non-Compliant, or Not Yet Screened.</p>
            </div>
            <div className="bg-cream-100 rounded-xl p-5 border border-stone-200">
              <div className="text-2xl mb-3">⚙️</div>
              <h3 className="text-sm font-bold text-ink-900 mb-1">You filter by your values</h3>
              <p className="text-xs text-ink-500 leading-relaxed">Show only compliant employers, exclude specific activities, or browse the full market. Your madhhab, your call.</p>
            </div>
          </div>

          {/* Example screening statuses */}
          <div className="bg-cream-100 border border-stone-200 rounded-xl p-5">
            <div className="text-xs font-semibold text-ink-500 mb-3">Example screening results you&apos;ll see</div>
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-[10px] text-ink-400 mb-1">Islamic Relief</div>
                <div className="flex items-center gap-2">
                  <ScreeningBadge status="COMPLIANT" />
                  <ConcernBadges activities={[]} positives={["islamic_mission", "humanitarian", "zakat_eligible"] as PositiveTag[]} compact />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-ink-400 mb-1">Microsoft</div>
                <div className="flex items-center gap-2">
                  <ScreeningBadge status="COMPLIANT" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-ink-400 mb-1">JPMorgan Chase</div>
                <div className="flex items-center gap-2">
                  <ScreeningBadge status="DOUBTFUL" />
                  <ConcernBadges activities={["interest_based_revenue", "speculation_heavy"] as ActivityTag[]} positives={[]} compact />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-ink-400 mb-1">Anheuser-Busch</div>
                <div className="flex items-center gap-2">
                  <ScreeningBadge status="NON_COMPLIANT" />
                  <ConcernBadges activities={["alcohol_production"] as ActivityTag[]} positives={[]} compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-2">Featured</div>
              <h2 className="text-2xl font-bold text-ink-900">Highlighted opportunities</h2>
            </div>
            <Link href="/jobs" className="flex items-center gap-1 text-sm text-ink-500 hover:text-teal-600 font-medium transition-colors">
              View all {totalJobs} jobs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURED.map(({ job, employer }) => (
              <JobCard
                key={job.id}
                job={job}
                employer={{
                  ...employer,
                  activities: (employer.activities ?? []) as ActivityTag[],
                  positives: employer.positives as PositiveTag[],
                  screening_status: (employer.screening_status ?? "NOT_SCREENED") as ScreeningStatus,
                }}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/jobs" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-7 py-3 text-sm font-semibold transition-colors">
              Browse all {totalJobs} jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-t border-b border-stone-200 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600">{totalJobs}</div>
              <div className="text-xs text-ink-500 mt-1">Jobs listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600">{totalEmployers}</div>
              <div className="text-xs text-ink-500 mt-1">Employers screened</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600">{compliantJobs}</div>
              <div className="text-xs text-ink-500 mt-1">Compliant jobs</div>
            </div>
          </div>
        </div>
      </section>

      {/* BROWSE BY INDUSTRY */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <div className="text-xs font-semibold text-teal-600 tracking-widest uppercase mb-2">By industry</div>
            <h2 className="text-2xl font-bold text-ink-900">Browse by industry</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {INDUSTRIES.map(ind => {
              const count = jobsData.jobs.filter(j => {
                const emp = getEmployer(j.employer_id)
                return emp && emp.industry === ind.id
              }).length
              if (count === 0) return null
              return (
                <Link key={ind.id} href={`/jobs?industry=${ind.id}`} className="group flex items-center gap-3 bg-white hover:bg-teal-50 border border-stone-200 hover:border-teal-300 rounded-xl p-4 transition-all">
                  <span className="text-xl">{ind.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-800 group-hover:text-teal-700 transition-colors leading-snug">{ind.label}</div>
                    <div className="text-xs text-ink-400">{count} {count === 1 ? "job" : "jobs"}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Filter className="h-6 w-6 text-teal-600" />, title: "You control the filter", desc: "Show only compliant employers, or browse the full market and filter by specific activities. Your values, your filters." },
              { icon: <CheckCircle className="h-6 w-6 text-teal-600" />, title: "Established standards", desc: "We use AAOIFI-aligned screening criteria — the same framework trusted by Islamic finance platforms worldwide. Not a custom invention." },
              { icon: <Users className="h-6 w-6 text-teal-600" />, title: "Community-supported", desc: "Free to use, always. No paywalls, no data selling. Supported by Muslims who believe in the mission." },
            ].map(f => (
              <div key={f.title} className="flex gap-4">
                <div className="shrink-0 mt-1">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-ink-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-teal-300 text-sm font-semibold tracking-widest uppercase mb-4">Free. Always.</div>
          <h2 className="text-3xl font-bold text-white mb-4">Know a job we should list?</h2>
          <p className="text-teal-100 text-base mb-8 max-w-md mx-auto leading-relaxed">
            Suggest any role — we&apos;ll screen the employer. Or donate to help us keep growing.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="/suggest" className="bg-white text-teal-700 rounded-xl px-6 py-3 text-sm font-semibold hover:bg-teal-50 transition-colors">
              Suggest a job
            </a>
            <Link href="/about" className="border border-teal-400 text-teal-100 rounded-xl px-6 py-3 text-sm font-semibold hover:bg-teal-600 transition-colors">
              Our mission
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
