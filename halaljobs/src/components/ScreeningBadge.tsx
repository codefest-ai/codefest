import { SCREENING_STATUSES, type ScreeningStatus } from "@/data/screening"

interface ScreeningBadgeProps {
  status: ScreeningStatus
  size?: "sm" | "md" | "lg"
  showDescription?: boolean
}

export function ScreeningBadge({ status, size = "sm", showDescription = false }: ScreeningBadgeProps) {
  const info = SCREENING_STATUSES[status]
  if (!info) return null

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  }

  return (
    <div className={showDescription ? "space-y-1" : ""}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${info.bg} ${info.color} ${info.border} ${sizeClasses[size]}`}
      >
        <span className={`h-2 w-2 rounded-full ${info.dot} shrink-0`} />
        {info.shortLabel}
      </span>
      {showDescription && (
        <p className="text-xs text-ink-500 leading-relaxed">{info.description}</p>
      )}
    </div>
  )
}
