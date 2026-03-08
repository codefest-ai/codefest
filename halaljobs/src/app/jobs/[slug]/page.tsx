import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Clock, DollarSign, ExternalLink, Building2 } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ConcernBadges } from "@/components/ConcernBadges"
import { ScreeningBadge } from "@/components/ScreeningBadge"
import { ACTIVITIES, POSITIVES, SCREENING_STATUSES, AAOIFI_CRITERIA, INDUSTRIES, type ActivityTag, type PositiveTag, type ScreeningStatus } from "@/data/screening"
import jobsData from "@/data/jobs.json"
import employersData from "@/data/employers.json"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

function getJob(slug: string) {
  return jobsData.jobs.find(j => j.slug === slug) ?? null
}

function getEmployer(id: string) {
  return employersData.employers.find(e => e.id === id) ?? null
}

export async function generateStaticParams() {
  return jobsData.jobs.map(j => ({ slug: j.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const job = getJob(slug)
  if (!job) return { title: "Job Not Found" }
  const employer = getEmployer(job.employer_id)
  return {
    title: `${job.title} at ${employer?.name ?? "Unknown"}`,
    description: `${job.title} at ${employer?.name ?? "Unknown"} — ${job.description.slice(0, 140)}...`,
  }
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params
  const job = getJob(slug)
  if (!job) notFound()

  const employer = getEmployer(job.employer_id)
  if (!employer) notFound()

  const industry = INDUSTRIES.find(i => i.id === employer.industry)
  const employerActivities = (employer.activities ?? []) as ActivityTag[]
  const allActivities = [
    ...employerActivities,
    ...job.role_concerns.filter(c => !employerActivities.includes(c as ActivityTag)),
  ] as ActivityTag[]
  const hasActivities = allActivities.length > 0
  const screeningStatus = (employer.screening_status ?? "NOT_SCREENED") as ScreeningStatus
  const statusInfo = SCREENING_STATUSES[screeningStatus]

  const relatedJobs = jobsData.jobs
    .filter(j => j.employer_id === job.employer_id && j.slug !== job.slug)
    .slice(0, 3)

  const sameIndustryJobs = relatedJobs.length < 3
    ? jobsData.jobs
        .filter(j => j.category === job.category && j.slug !== job.slug && !relatedJobs.find(rj => rj.slug === j.slug))
        .slice(0, 3 - relatedJobs.length)
    : []

  // JSON-LD structured data for Google Jobs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.posted,
    employmentType: job.type === "Full-time" ? "FULL_TIME" : job.type === "Part-time" ? "PART_TIME" : job.type === "Contract" ? "CONTRACTOR" : job.type === "Internship" ? "INTERN" : "OTHER",
    hiringOrganization: {
      "@type": "Organization",
      name: employer.name,
      sameAs: employer.careers_url || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: employer.hq_country,
      },
    },
    ...(job.remote && { jobLocationType: "TELECOMMUTE" }),
    ...(job.salary && { baseSalary: { "@type": "MonetaryAmount", currency: "USD", value: { "@type": "QuantitativeValue", value: job.salary } } }),
    directApply: false,
    url: `https://halaljobs.ai/jobs/${job.slug}`,
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job header */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {job.featured && (
                    <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-0.5">
                      Featured
                    </span>
                  )}
                  <ScreeningBadge status={screeningStatus} />
                </div>
                <h1 className="text-xl font-bold text-ink-900 leading-tight">{job.title}</h1>
                <p className="text-base text-ink-600 mt-0.5">{employer.name}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-ink-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-ink-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-ink-400" />
                  {job.type}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-ink-400" />
                    {job.salary}
                  </span>
                )}
                {industry && (
                  <span>{industry.emoji} {industry.label}</span>
                )}
              </div>

              {/* Activity badges */}
              <div className="mb-5">
                <ConcernBadges
                  activities={allActivities}
                  positives={employer.positives as PositiveTag[]}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {job.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/jobs?q=${tag}`}
                    className="text-xs bg-cream-200 text-ink-600 rounded-full px-2.5 py-0.5 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                Apply now <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-base font-bold text-ink-900 mb-3">About this role</h2>
              <p className="text-sm text-ink-700 leading-relaxed">{job.description}</p>

              {job.requirements && job.requirements.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-ink-800 mb-2">Requirements</h3>
                  <ul className="space-y-1.5">
                    {job.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                        <span className="text-teal-500 mt-0.5 shrink-0">·</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Related jobs */}
            {(relatedJobs.length > 0 || sameIndustryJobs.length > 0) && (
              <div>
                <h2 className="text-base font-bold text-ink-900 mb-3">
                  {relatedJobs.length > 0 ? `More at ${employer.name}` : `Similar ${industry?.label} jobs`}
                </h2>
                <div className="space-y-3">
                  {[...relatedJobs, ...sameIndustryJobs].map(rj => {
                    const rjEmp = getEmployer(rj.employer_id)
                    return (
                      <Link
                        key={rj.id}
                        href={`/jobs/${rj.slug}`}
                        className="group flex items-center justify-between bg-white border border-stone-200 hover:border-teal-300 rounded-xl p-4 transition-all"
                      >
                        <div>
                          <div className="text-sm font-semibold text-ink-800 group-hover:text-teal-700 transition-colors">{rj.title}</div>
                          <div className="text-xs text-ink-500">{rjEmp?.name ?? ""} · {rj.location}</div>
                        </div>
                        {rjEmp && (
                          <ScreeningBadge status={(rjEmp.screening_status ?? "NOT_SCREENED") as ScreeningStatus} />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-5">

            {/* Screening Status Card */}
            <div className={`rounded-2xl border p-5 ${statusInfo.bg} ${statusInfo.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className={`h-4 w-4 shrink-0 ${statusInfo.color}`} />
                <span className={`text-sm font-bold ${statusInfo.color}`}>
                  Employer Screening
                </span>
              </div>

              {/* Screening status prominently */}
              <div className="mb-4">
                <ScreeningBadge status={screeningStatus} size="md" showDescription />
              </div>

              <dl className="space-y-2 mb-4 text-xs">
                <div>
                  <dt className="text-ink-500">Company</dt>
                  <dd className="font-medium text-ink-800">{employer.name}</dd>
                </div>
                <div>
                  <dt className="text-ink-500">Industry</dt>
                  <dd className="font-medium text-ink-800">{industry?.emoji} {industry?.label ?? employer.industry}</dd>
                </div>
                <div>
                  <dt className="text-ink-500">Employees</dt>
                  <dd className="font-medium text-ink-800">{employer.employee_count.toLocaleString()}+</dd>
                </div>
                <div>
                  <dt className="text-ink-500">HQ</dt>
                  <dd className="font-medium text-ink-800">{employer.hq_country}</dd>
                </div>
                {employer.publicly_traded && (
                  <div>
                    <dt className="text-ink-500">Publicly traded</dt>
                    <dd className="font-medium text-ink-800">Yes</dd>
                  </div>
                )}
              </dl>

              {/* Revenue Sources */}
              {employer.revenue_sources.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-ink-500 mb-2">Revenue sources</div>
                  <div className="space-y-1.5">
                    {employer.revenue_sources.map((rs, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-ink-700">{rs.source}</span>
                        <span className="text-ink-500 font-medium">{rs.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities detail */}
              {hasActivities && (
                <div className={`border-t pt-3 ${statusInfo.border}`}>
                  <div className={`text-xs font-semibold mb-2 ${statusInfo.color}`}>Flagged activities</div>
                  <div className="space-y-1.5">
                    {allActivities.map(aid => {
                      const a = ACTIVITIES.find(x => x.id === aid)
                      if (!a) return null
                      return (
                        <div key={aid} className={`flex items-start gap-1.5 text-xs ${statusInfo.color}`}>
                          <span className="shrink-0">{a.emoji}</span>
                          <div>
                            <span className="font-medium">{a.label}</span>
                            <span className="text-ink-500"> — {a.description}</span>
                            <span className={`ml-1 text-[10px] font-medium ${a.screening_impact === "fail" ? "text-red-600" : "text-amber-600"}`}>
                              ({a.screening_impact === "fail" ? "auto-fail" : "requires review"})
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Positives detail */}
              {employer.positives.length > 0 && (
                <div className={`border-t pt-3 mt-3 ${statusInfo.border}`}>
                  <div className="text-xs font-semibold mb-2 text-green-700">Positives</div>
                  <div className="space-y-1.5">
                    {(employer.positives as PositiveTag[]).map(pid => {
                      const p = POSITIVES.find(x => x.id === pid)
                      if (!p) return null
                      return (
                        <div key={pid} className="flex items-start gap-1.5 text-xs text-green-700">
                          <span className="shrink-0">{p.emoji}</span>
                          <span>{p.description}</span>
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

            {/* AAOIFI Criteria */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4">
              <div className="text-xs font-semibold text-ink-700 mb-2">Screening criteria (AAOIFI-aligned)</div>
              <div className="space-y-2">
                {AAOIFI_CRITERIA.map(c => (
                  <div key={c.id} className="text-xs">
                    <div className="font-medium text-ink-700">{c.label}</div>
                    <div className="text-ink-400">{c.threshold} — {c.source}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
              <div className="text-xs font-semibold text-ink-700 mb-1">We show the facts. You decide.</div>
              <p className="text-xs text-ink-500 leading-relaxed">
                This screening uses AAOIFI-aligned criteria — the same framework used by Islamic finance
                platforms like IFG and Zoya. It is not a fatwa or religious ruling. Your madhhab, personal
                circumstances, and the specific role may affect your assessment.
              </p>
              <Link
                href="/about#methodology"
                className="inline-block mt-2 text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors"
              >
                About our methodology →
              </Link>
            </div>

            {/* Quick facts */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <div className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-3">Quick facts</div>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Location</dt>
                  <dd className="text-ink-800 font-medium">{job.location}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Type</dt>
                  <dd className="text-ink-800 font-medium">{job.type}</dd>
                </div>
                {job.salary && (
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Salary</dt>
                    <dd className="text-ink-800 font-medium">{job.salary}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink-500">Posted</dt>
                  <dd className="text-ink-800 font-medium">
                    {new Date(job.posted).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </dd>
                </div>
              </dl>

              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                Apply now <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="text-center">
              <a
                href={`mailto:hello@halaljobs.ai?subject=Screening feedback: ${encodeURIComponent(job.title + " at " + employer.name)}`}
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
