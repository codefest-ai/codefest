import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Building2, ExternalLink, MapPin, Users } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScreeningBadge } from "@/components/ScreeningBadge"
import { ConcernBadges } from "@/components/ConcernBadges"
import { ACTIVITIES, POSITIVES, SCREENING_STATUSES, AAOIFI_CRITERIA, INDUSTRIES, type ActivityTag, type PositiveTag, type ScreeningStatus } from "@/data/screening"
import jobsData from "@/data/jobs.json"
import employersData from "@/data/employers.json"
import type { Metadata } from "next"

type Props = { params: Promise<{ id: string }> }

function getEmployer(id: string) {
  return employersData.employers.find(e => e.id === id) ?? null
}

function getEmployerJobs(employerId: string) {
  return jobsData.jobs.filter(j => j.employer_id === employerId)
}

export async function generateStaticParams() {
  return employersData.employers.map(e => ({ id: e.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const employer = getEmployer(id)
  if (!employer) return { title: "Employer Not Found" }
  const status = SCREENING_STATUSES[(employer.screening_status ?? "NOT_SCREENED") as ScreeningStatus]
  return {
    title: `${employer.name} — ${status.shortLabel}`,
    description: `${employer.name} screening: ${status.shortLabel}. See all ${getEmployerJobs(employer.id).length} jobs and the full employer classification.`,
  }
}

export default async function EmployerPage({ params }: Props) {
  const { id } = await params
  const employer = getEmployer(id)
  if (!employer) notFound()

  const jobs = getEmployerJobs(employer.id)
  const industry = INDUSTRIES.find(i => i.id === employer.industry)
  const screeningStatus = (employer.screening_status ?? "NOT_SCREENED") as ScreeningStatus
  const statusInfo = SCREENING_STATUSES[screeningStatus]
  const activities = (employer.activities ?? []) as ActivityTag[]
  const positives = employer.positives as PositiveTag[]

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <Link
          href="/employers"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          All employers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Employer header */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-xl bg-cream-200 border border-stone-200 flex items-center justify-center text-2xl shrink-0">
                  {industry?.emoji ?? "🏢"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-bold text-ink-900 leading-tight">{employer.name}</h1>
                    <ScreeningBadge status={screeningStatus} />
                  </div>
                  <p className="text-sm text-ink-500">{industry?.label ?? employer.industry} · {employer.hq_country}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-ink-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-ink-400" />
                  {employer.employee_count.toLocaleString()}+ employees
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-ink-400" />
                  {employer.hq_country}
                </span>
                {employer.publicly_traded && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-ink-400" />
                    Publicly traded
                  </span>
                )}
              </div>

              <ConcernBadges activities={activities} positives={positives} />

              {employer.careers_url && (
                <a
                  href={employer.careers_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  Careers page <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Jobs at this employer */}
            <div>
              <h2 className="text-base font-bold text-ink-900 mb-3">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} at {employer.name}
              </h2>
              {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center">
                  <p className="text-sm text-ink-500">No jobs currently listed for this employer.</p>
                  <a
                    href={`mailto:hello@halaljobs.ai?subject=Suggest job at ${encodeURIComponent(employer.name)}`}
                    className="inline-flex items-center gap-2 mt-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-2 text-sm font-semibold transition-colors"
                  >
                    Suggest a job
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map(job => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.slug}`}
                      className="group flex items-center justify-between bg-white border border-stone-200 hover:border-teal-300 rounded-xl p-4 transition-all hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink-800 group-hover:text-teal-700 transition-colors">{job.title}</div>
                        <div className="text-xs text-ink-500 mt-0.5">
                          {job.location} · {job.type}
                          {job.salary && ` · ${job.salary}`}
                        </div>
                        {job.role_concerns.length > 0 && (
                          <div className="mt-1.5">
                            <ConcernBadges
                              activities={job.role_concerns as ActivityTag[]}
                              positives={[]}
                              compact
                            />
                          </div>
                        )}
                      </div>
                      {job.featured && (
                        <span className="shrink-0 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 ml-3">
                          Featured
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-5">

            {/* Screening Card */}
            <div className={`rounded-2xl border p-5 ${statusInfo.bg} ${statusInfo.border}`}>
              <div className="text-xs font-semibold text-ink-500 uppercase tracking-widest mb-3">Screening result</div>
              <ScreeningBadge status={screeningStatus} size="md" showDescription />

              {/* Revenue Sources */}
              {employer.revenue_sources.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-ink-500 mb-2">Revenue sources</div>
                  <div className="space-y-1.5">
                    {employer.revenue_sources.map((rs, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-ink-700">{rs.source}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500 rounded-full"
                              style={{ width: `${rs.pct}%` }}
                            />
                          </div>
                          <span className="text-ink-500 font-medium w-8 text-right">{rs.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {activities.length > 0 && (
                <div className={`border-t pt-3 mt-4 ${statusInfo.border}`}>
                  <div className={`text-xs font-semibold mb-2 ${statusInfo.color}`}>Flagged activities</div>
                  <div className="space-y-1.5">
                    {activities.map(aid => {
                      const a = ACTIVITIES.find(x => x.id === aid)
                      if (!a) return null
                      return (
                        <div key={aid} className="flex items-start gap-1.5 text-xs text-ink-700">
                          <span className="shrink-0">{a.emoji}</span>
                          <div>
                            <span className="font-medium">{a.label}</span>
                            <span className={`ml-1 text-[10px] font-medium ${a.screening_impact === "fail" ? "text-red-600" : "text-amber-600"}`}>
                              ({a.screening_impact === "fail" ? "auto-fail" : "review"})
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Positives */}
              {positives.length > 0 && (
                <div className={`border-t pt-3 mt-3 ${statusInfo.border}`}>
                  <div className="text-xs font-semibold mb-2 text-green-700">Positives</div>
                  <div className="space-y-1.5">
                    {positives.map(pid => {
                      const p = POSITIVES.find(x => x.id === pid)
                      if (!p) return null
                      return (
                        <div key={pid} className="flex items-start gap-1.5 text-xs text-green-700">
                          <span className="shrink-0">{p.emoji}</span>
                          <span>{p.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-3 text-[10px] text-ink-400">
                Source: {employer.classification_source.replace(/_/g, " ")} · Updated {employer.last_reviewed}
              </div>
            </div>

            {/* AAOIFI info */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4">
              <div className="text-xs font-semibold text-ink-700 mb-2">AAOIFI-aligned screening</div>
              <p className="text-xs text-ink-500 leading-relaxed mb-2">
                We use the same criteria as IFG, Zoya, and Musaffa — adapted from stock screening to employer classification.
              </p>
              <Link
                href="/about#methodology"
                className="text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors"
              >
                Learn about our methodology →
              </Link>
            </div>

            {/* Feedback */}
            <div className="text-center">
              <a
                href={`mailto:hello@halaljobs.ai?subject=Screening feedback: ${encodeURIComponent(employer.name)}`}
                className="text-xs text-ink-400 hover:text-teal-600 transition-colors"
              >
                Think this screening is wrong? Let us know →
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
