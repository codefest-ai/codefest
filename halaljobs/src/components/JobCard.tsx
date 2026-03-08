import Link from "next/link"
import { MapPin, Clock, DollarSign } from "lucide-react"
import { ConcernBadges } from "@/components/ConcernBadges"
import { ScreeningBadge } from "@/components/ScreeningBadge"
import { INDUSTRIES, type ActivityTag, type PositiveTag, type ScreeningStatus } from "@/data/screening"

interface Employer {
  id: string
  name: string
  industry: string
  activities: ActivityTag[]
  positives: PositiveTag[]
  company_type: string
  screening_status: ScreeningStatus
}

interface Job {
  id: string
  slug: string
  employer_id: string
  title: string
  location: string
  remote: boolean
  type: string
  salary: string
  category: string
  description: string
  role_concerns: string[]
  featured: boolean
  tags: string[]
}

interface JobCardProps {
  job: Job
  employer: Employer
}

export function JobCard({ job, employer }: JobCardProps) {
  const industry = INDUSTRIES.find(i => i.id === employer.industry)

  // Merge employer activities + role concerns
  const allActivities = [
    ...employer.activities,
    ...job.role_concerns.filter(c => !employer.activities.includes(c as ActivityTag)),
  ] as ActivityTag[]

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className={`group block bg-white border rounded-2xl p-5 transition-all hover:shadow-md ${
        job.featured
          ? "border-teal-300 shadow-sm"
          : "border-stone-200 hover:border-teal-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            {job.featured && (
              <span className="shrink-0 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5">
                Featured
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-ink-900 group-hover:text-teal-700 transition-colors leading-snug">
            {job.title}
          </h3>
          <p className="text-sm text-ink-500 mt-0.5">{employer.name}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-ink-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {job.type}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {job.salary}
              </span>
            )}
            {industry && (
              <span>{industry.emoji} {industry.label}</span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <ScreeningBadge status={employer.screening_status} size="sm" />
            <ConcernBadges
              activities={allActivities}
              positives={employer.positives as PositiveTag[]}
              compact
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
