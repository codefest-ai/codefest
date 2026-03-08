import Link from "next/link"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { JobCard } from "@/components/JobCard"
import { ACTIVITIES, SCREENING_STATUSES, INDUSTRIES, JOB_TYPES, type ActivityTag, type PositiveTag, type ScreeningStatus } from "@/data/screening"
import jobsData from "@/data/jobs.json"
import employersData from "@/data/employers.json"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Jobs",
  description: "Browse the real job market. Filter by your values — AAOIFI-aligned screening, employer classifications, you decide.",
}

type SearchParams = {
  q?: string
  industry?: string
  exclude?: string // comma-separated activity IDs
  show?: string // "islamic_org" | "no_concerns"
  screening?: string // "COMPLIANT" | "DOUBTFUL" | "NON_COMPLIANT" | "NOT_SCREENED"
  type?: string
  page?: string
}

function getEmployer(id: string) {
  return employersData.employers.find(e => e.id === id) ?? null
}

function filterJobs(params: SearchParams) {
  let results = jobsData.jobs.map(job => {
    const employer = getEmployer(job.employer_id)
    return { job, employer }
  }).filter((x): x is { job: typeof jobsData.jobs[0]; employer: NonNullable<ReturnType<typeof getEmployer>> } => x.employer !== null)

  // Text search
  if (params.q) {
    const q = params.q.toLowerCase()
    results = results.filter(({ job, employer }) =>
      job.title.toLowerCase().includes(q) ||
      employer.name.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.tags.some(t => t.toLowerCase().includes(q)) ||
      job.location.toLowerCase().includes(q)
    )
  }

  // Industry filter
  if (params.industry && params.industry !== "all") {
    results = results.filter(({ employer }) => employer.industry === params.industry)
  }

  // Screening status filter
  if (params.screening) {
    results = results.filter(({ employer }) => employer.screening_status === params.screening)
  }

  // Exclude activities
  if (params.exclude) {
    const excluded = params.exclude.split(",") as ActivityTag[]
    results = results.filter(({ job, employer }) => {
      const allActivities = [
        ...(employer.activities ?? []),
        ...job.role_concerns,
      ]
      return !allActivities.some(c => excluded.includes(c as ActivityTag))
    })
  }

  // Show only specific types
  if (params.show === "islamic_org") {
    results = results.filter(({ employer }) =>
      employer.company_type === "islamic_org" ||
      employer.company_type === "muslim_founded" ||
      employer.company_type === "halal_certified"
    )
  } else if (params.show === "no_concerns") {
    results = results.filter(({ employer }) => (employer.activities ?? []).length === 0)
  }

  // Job type
  if (params.type) {
    results = results.filter(({ job }) => job.type === params.type)
  }

  // Sort: featured first, then compliant, then doubtful, then non-compliant
  const statusOrder: Record<string, number> = { COMPLIANT: 0, NOT_SCREENED: 1, DOUBTFUL: 2, NON_COMPLIANT: 3 }
  results.sort((a, b) => {
    if (a.job.featured && !b.job.featured) return -1
    if (!a.job.featured && b.job.featured) return 1
    const aStatus = statusOrder[a.employer.screening_status] ?? 4
    const bStatus = statusOrder[b.employer.screening_status] ?? 4
    if (aStatus !== bStatus) return aStatus - bStatus
    return new Date(b.job.posted).getTime() - new Date(a.job.posted).getTime()
  })

  return results
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const allResults = filterJobs(sp)

  // Pagination
  const JOBS_PER_PAGE = 20
  const currentPage = Math.max(1, parseInt(sp.page || "1", 10) || 1)
  const totalPages = Math.ceil(allResults.length / JOBS_PER_PAGE)
  const results = allResults.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE)

  const activeIndustry = sp.industry || "all"
  const activeType = sp.type || ""
  const activeShow = sp.show || ""
  const activeScreening = sp.screening || ""
  const excludedActivities = sp.exclude ? sp.exclude.split(",") : []
  const query = sp.q || ""

  const hasFilters = !!(sp.industry || sp.exclude || sp.show || sp.type || sp.q || sp.screening)

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-ink-900">
              {query
                ? `Results for "${query}"`
                : activeScreening
                ? `${SCREENING_STATUSES[activeScreening as ScreeningStatus]?.label ?? ""} jobs`
                : activeIndustry !== "all"
                ? `${INDUSTRIES.find(i => i.id === activeIndustry)?.label ?? "Jobs"}`
                : "Browse the job market"}
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              {allResults.length} {allResults.length === 1 ? "job" : "jobs"} found
              {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
              {excludedActivities.length > 0 && ` · ${excludedActivities.length} activit${excludedActivities.length > 1 ? "ies" : "y"} excluded`}
              {!hasFilters && ` · Filter by your values`}
            </p>
          </div>

          {/* Search bar */}
          <form action="/jobs" method="GET" className="flex gap-2 max-w-2xl">
            {sp.industry && <input type="hidden" name="industry" value={sp.industry} />}
            {sp.exclude && <input type="hidden" name="exclude" value={sp.exclude} />}
            {sp.show && <input type="hidden" name="show" value={sp.show} />}
            {sp.type && <input type="hidden" name="type" value={sp.type} />}
            {sp.screening && <input type="hidden" name="screening" value={sp.screening} />}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                name="q"
                type="text"
                defaultValue={query}
                placeholder="Search title, company, keyword..."
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
                href="/jobs"
                className="flex items-center gap-1.5 text-sm text-ink-500 border border-stone-300 rounded-xl px-4 py-2.5 hover:border-red-300 hover:text-red-500 transition-colors shrink-0"
              >
                Clear
              </Link>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* SIDEBAR FILTERS */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Screening Status */}
              <div>
                <div className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Screening status</div>
                <div className="space-y-1">
                  <Link
                    href={buildFilterUrl(sp, "screening", "")}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !activeScreening ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                    }`}
                  >
                    All statuses
                  </Link>
                  {(["COMPLIANT", "DOUBTFUL", "NON_COMPLIANT", "NOT_SCREENED"] as ScreeningStatus[]).map(status => {
                    const info = SCREENING_STATUSES[status]
                    const count = employersData.employers.filter(e => e.screening_status === status).length
                    return (
                      <Link
                        key={status}
                        href={buildFilterUrl(sp, "screening", status)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeScreening === status ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${info.dot}`} />
                          {info.shortLabel}
                        </span>
                        <span className="text-xs text-ink-400">{count}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Exclude Activities */}
              <div>
                <div className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Exclude activities</div>
                <div className="space-y-1">
                  {ACTIVITIES.map(a => {
                    const isExcluded = excludedActivities.includes(a.id)
                    const newExclude = isExcluded
                      ? excludedActivities.filter(x => x !== a.id)
                      : [...excludedActivities, a.id]
                    return (
                      <Link
                        key={a.id}
                        href={buildFilterUrl(sp, "exclude", newExclude.join(","))}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isExcluded
                            ? "bg-red-50 text-red-700 font-medium border border-red-200"
                            : "text-ink-600 hover:bg-cream-200"
                        }`}
                      >
                        <span>{a.emoji}</span>
                        <span>{a.label}</span>
                        {isExcluded && <span className="ml-auto text-red-400">✕</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Show Only */}
              <div>
                <div className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Show only</div>
                <div className="space-y-1">
                  <Link
                    href={buildFilterUrl(sp, "show", "")}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !activeShow ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                    }`}
                  >
                    All employers
                  </Link>
                  <Link
                    href={buildFilterUrl(sp, "show", "islamic_org")}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeShow === "islamic_org" ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                    }`}
                  >
                    🕌 Islamic / Muslim-founded
                  </Link>
                  <Link
                    href={buildFilterUrl(sp, "show", "no_concerns")}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeShow === "no_concerns" ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                    }`}
                  >
                    ✓ No known activities
                  </Link>
                </div>
              </div>

              {/* Job Type */}
              <div>
                <div className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Type</div>
                <div className="space-y-1">
                  <Link
                    href={buildFilterUrl(sp, "type", "")}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !activeType ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                    }`}
                  >
                    All types
                  </Link>
                  {JOB_TYPES.map(t => (
                    <Link
                      key={t}
                      href={buildFilterUrl(sp, "type", t)}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeType === t ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                      }`}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div>
                <div className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Industry</div>
                <div className="space-y-1">
                  <Link
                    href={buildFilterUrl(sp, "industry", "")}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeIndustry === "all" ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                    }`}
                  >
                    All industries
                  </Link>
                  {INDUSTRIES.map(ind => {
                    const count = jobsData.jobs.filter(j => {
                      const emp = getEmployer(j.employer_id)
                      return emp && emp.industry === ind.id
                    }).length
                    if (count === 0) return null
                    return (
                      <Link
                        key={ind.id}
                        href={buildFilterUrl(sp, "industry", ind.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeIndustry === ind.id ? "bg-teal-50 text-teal-700 font-medium" : "text-ink-600 hover:bg-cream-200"
                        }`}
                      >
                        <span>{ind.emoji} {ind.label}</span>
                        <span className="text-xs text-ink-400">{count}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0">
            {/* Mobile filters */}
            <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                <Link
                  href="/jobs"
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap ${
                    !hasFilters ? "bg-teal-600 text-white border-teal-600" : "bg-white text-ink-600 border-stone-300"
                  }`}
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  All
                </Link>
                <Link
                  href={buildFilterUrl(sp, "screening", "COMPLIANT")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap ${
                    activeScreening === "COMPLIANT" ? "bg-green-600 text-white border-green-600" : "bg-white text-ink-600 border-stone-300"
                  }`}
                >
                  ● Compliant
                </Link>
                <Link
                  href={buildFilterUrl(sp, "show", "islamic_org")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap ${
                    activeShow === "islamic_org" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-ink-600 border-stone-300"
                  }`}
                >
                  🕌 Islamic orgs
                </Link>
                {INDUSTRIES.slice(0, 5).map(ind => (
                  <Link
                    key={ind.id}
                    href={buildFilterUrl(sp, "industry", ind.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap ${
                      activeIndustry === ind.id
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white text-ink-600 border-stone-300"
                    }`}
                  >
                    {ind.emoji} {ind.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Results */}
            {results.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-lg font-semibold text-ink-800 mb-2">No jobs match your filters</h2>
                <p className="text-ink-500 text-sm mb-6">
                  Try removing some exclusions or broadening your search.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {results.map(({ job, employer }) => (
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {currentPage > 1 ? (
                  <Link
                    href={buildFilterUrl(sp, "page", String(currentPage - 1))}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl border border-stone-300 text-sm text-ink-600 hover:border-teal-400 hover:text-teal-600 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-4 py-2 rounded-xl border border-stone-200 text-sm text-ink-300 cursor-not-allowed">
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                      if (i > 0 && arr[i - 1] !== p - 1) acc.push("ellipsis")
                      acc.push(p)
                      return acc
                    }, [])
                    .map((item, i) =>
                      item === "ellipsis" ? (
                        <span key={`e${i}`} className="px-2 text-ink-400 text-sm">…</span>
                      ) : (
                        <Link
                          key={item}
                          href={buildFilterUrl(sp, "page", String(item))}
                          className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            item === currentPage
                              ? "bg-teal-600 text-white"
                              : "text-ink-600 hover:bg-teal-50 hover:text-teal-700"
                          }`}
                        >
                          {item}
                        </Link>
                      )
                    )}
                </div>

                {currentPage < totalPages ? (
                  <Link
                    href={buildFilterUrl(sp, "page", String(currentPage + 1))}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl border border-stone-300 text-sm text-ink-600 hover:border-teal-400 hover:text-teal-600 transition-colors"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 px-4 py-2 rounded-xl border border-stone-200 text-sm text-ink-300 cursor-not-allowed">
                    Next <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-10 bg-teal-50 border border-teal-200 rounded-2xl px-6 py-6 text-center">
                <p className="text-sm font-semibold text-ink-800 mb-1">Know a job we&apos;re missing?</p>
                <p className="text-xs text-ink-500 mb-4">We add new listings regularly. Suggest any role — we&apos;ll screen the employer.</p>
                <a
                  href="/suggest"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-2 text-sm font-semibold transition-colors"
                >
                  Suggest a job
                </a>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function buildFilterUrl(current: SearchParams, key: string, value: string): string {
  const params = new URLSearchParams()
  if (current.q) params.set("q", current.q)
  if (current.industry && key !== "industry") params.set("industry", current.industry)
  if (current.exclude && key !== "exclude") params.set("exclude", current.exclude)
  if (current.show && key !== "show") params.set("show", current.show)
  if (current.type && key !== "type") params.set("type", current.type)
  if (current.screening && key !== "screening") params.set("screening", current.screening)
  if (value) params.set(key, value)
  // Reset to page 1 when any filter changes; only keep page param when paginating
  if (key !== "page") {
    params.delete("page")
  } else if (value === "1") {
    params.delete("page") // Don't show page=1 in URL
  }
  const qs = params.toString()
  return qs ? `/jobs?${qs}` : "/jobs"
}
