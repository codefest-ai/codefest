import Link from "next/link"
import { Search } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScreeningBadge } from "@/components/ScreeningBadge"
import { SCREENING_STATUSES, INDUSTRIES, type ScreeningStatus } from "@/data/screening"
import employersData from "@/data/employers.json"
import jobsData from "@/data/jobs.json"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Screened Employers",
  description: "Browse all employers screened using AAOIFI-aligned criteria. See screening status, activities, and open jobs.",
}

type SearchParams = {
  q?: string
  screening?: string
  industry?: string
}

function getJobCount(employerId: string) {
  return jobsData.jobs.filter(j => j.employer_id === employerId).length
}

function filterEmployers(params: SearchParams) {
  let results = [...employersData.employers]

  if (params.q) {
    const q = params.q.toLowerCase()
    results = results.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.industry.toLowerCase().includes(q) ||
      e.hq_country.toLowerCase().includes(q)
    )
  }

  if (params.screening) {
    results = results.filter(e => e.screening_status === params.screening)
  }

  if (params.industry && params.industry !== "all") {
    results = results.filter(e => e.industry === params.industry)
  }

  // Sort: compliant first, then by job count
  const statusOrder: Record<string, number> = { COMPLIANT: 0, NOT_SCREENED: 1, DOUBTFUL: 2, NON_COMPLIANT: 3 }
  results.sort((a, b) => {
    const aStatus = statusOrder[a.screening_status] ?? 4
    const bStatus = statusOrder[b.screening_status] ?? 4
    if (aStatus !== bStatus) return aStatus - bStatus
    return getJobCount(b.id) - getJobCount(a.id)
  })

  return results
}

export default async function EmployersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const results = filterEmployers(sp)
  const activeScreening = sp.screening || ""
  const activeIndustry = sp.industry || "all"
  const query = sp.q || ""
  const hasFilters = !!(sp.q || sp.screening || sp.industry)

  // Stats
  const statusCounts = employersData.employers.reduce((acc, e) => {
    acc[e.screening_status] = (acc[e.screening_status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      {/* Header */}
      <div className="bg-white border-b border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Screened Employers</h1>
          <p className="text-sm text-ink-500 mb-4">
            {employersData.employers.length} employers screened using AAOIFI-aligned criteria
          </p>

          {/* Status summary pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["COMPLIANT", "DOUBTFUL", "NON_COMPLIANT", "NOT_SCREENED"] as ScreeningStatus[]).map(status => {
              const info = SCREENING_STATUSES[status]
              const count = statusCounts[status] || 0
              return (
                <Link
                  key={status}
                  href={activeScreening === status ? "/employers" : `/employers?screening=${status}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                    activeScreening === status
                      ? `${info.bg} ${info.color} ${info.border}`
                      : "bg-white text-ink-600 border-stone-300 hover:border-teal-300"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${info.dot}`} />
                  {info.shortLabel} ({count})
                </Link>
              )
            })}
          </div>

          {/* Search */}
          <form action="/employers" method="GET" className="flex gap-2 max-w-xl">
            {sp.screening && <input type="hidden" name="screening" value={sp.screening} />}
            {sp.industry && <input type="hidden" name="industry" value={sp.industry} />}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                name="q"
                type="text"
                defaultValue={query}
                placeholder="Search employer name or country..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors shrink-0"
            >
              Search
            </button>
            {hasFilters && (
              <Link
                href="/employers"
                className="flex items-center gap-1.5 text-sm text-ink-500 border border-stone-300 rounded-xl px-4 py-2.5 hover:border-red-300 hover:text-red-500 transition-colors shrink-0"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-sm text-ink-500 mb-4">{results.length} employer{results.length !== 1 ? "s" : ""} found</p>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🏢</div>
            <h2 className="text-lg font-semibold text-ink-800 mb-2">No employers match your search</h2>
            <Link
              href="/employers"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors mt-4"
            >
              View all employers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(employer => {
              const industry = INDUSTRIES.find(i => i.id === employer.industry)
              const jobCount = getJobCount(employer.id)
              const status = (employer.screening_status ?? "NOT_SCREENED") as ScreeningStatus

              return (
                <Link
                  key={employer.id}
                  href={`/employers/${employer.id}`}
                  className="group bg-white border border-stone-200 hover:border-teal-300 rounded-2xl p-5 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-ink-900 group-hover:text-teal-700 transition-colors leading-snug truncate">
                        {employer.name}
                      </h3>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {industry?.emoji} {industry?.label ?? employer.industry} · {employer.hq_country}
                      </p>
                    </div>
                    <ScreeningBadge status={status} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-ink-400">
                    <span>{employer.employee_count.toLocaleString()}+ employees</span>
                    <span className="font-medium text-teal-600">
                      {jobCount} {jobCount === 1 ? "job" : "jobs"}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
