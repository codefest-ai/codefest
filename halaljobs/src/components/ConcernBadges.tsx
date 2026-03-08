import { ACTIVITIES, POSITIVES, type ActivityTag, type PositiveTag } from "@/data/screening"

interface ConcernBadgesProps {
  activities: ActivityTag[]
  positives: PositiveTag[]
  compact?: boolean
}

export function ConcernBadges({ activities, positives, compact = false }: ConcernBadgesProps) {
  const hasNoActivities = activities.length === 0

  return (
    <div className="flex flex-wrap gap-1.5">
      {/* Positives first */}
      {positives.map(pid => {
        const p = POSITIVES.find(x => x.id === pid)
        if (!p) return null
        return (
          <span
            key={pid}
            title={p.description}
            className={`inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 text-green-700 ${
              compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
            }`}
          >
            <span>{p.emoji}</span>
            {!compact && <span>{p.label}</span>}
          </span>
        )
      })}

      {/* Show "No known concerns" if clean */}
      {hasNoActivities && positives.length === 0 && (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 text-stone-600 ${
            compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
          }`}
        >
          <span>✓</span>
          {!compact && <span>No known concerns</span>}
        </span>
      )}

      {hasNoActivities && positives.length > 0 && (
        <span
          className={`inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 text-green-700 ${
            compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
          }`}
        >
          <span>✓</span>
          {!compact && <span>No concerns</span>}
        </span>
      )}

      {/* Activities (concerns) */}
      {activities.map(aid => {
        const a = ACTIVITIES.find(x => x.id === aid)
        if (!a) return null
        const isFail = a.screening_impact === "fail"
        return (
          <span
            key={aid}
            title={a.description}
            className={`inline-flex items-center gap-1 rounded-full border ${
              isFail
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            } ${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"}`}
          >
            <span>{a.emoji}</span>
            {!compact && <span>{a.label}</span>}
          </span>
        )
      })}
    </div>
  )
}
